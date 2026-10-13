const legalTopics = require('../server/data/legalTopics');

/**
 * Regression tests for BNS section-to-description mapping accuracy.
 *
 * These tests prevent incorrect assignment of legal descriptions to BNS sections.
 * The BNS replaced the Indian Penal Code (IPC) on 1 July 2024.
 *
 * Source: Bharatiya Nyaya Sanhita, 2023 (BNS)
 * Expected IPC correspondence (for reference only, not used in verification):
 *   BNS 318 -> IPC 420 (Cheating)
 *   BNS 319 -> IPC 419 (Cheating by personation)
 *   BNS 351 -> IPC 503 (Criminal intimidation)
 *   BNS 352 -> IPC 504 (Intentional insult with intent to provoke breach of peace)
 */

describe('BNS Section Mapping Accuracy', () => {
  const bnsProvisions = [];
  for (const topic of legalTopics) {
    for (const provision of topic.provisions) {
      if (provision.law.includes('Bharatiya Nyaya Sanhita')) {
        bnsProvisions.push({ ...provision, category: topic.category, topic: topic.topic });
      }
    }
  }

  test('should have exactly 2 BNS provisions', () => {
    expect(bnsProvisions.length).toBe(2);
  });

  test('BNS Section 319 should be about cheating by personation (NOT Section 318)', () => {
    const section319 = bnsProvisions.find(p => p.article === 'Section 319');
    expect(section319).toBeDefined();
    expect(section319.text).toMatch(/cheats by personation/i);
    expect(section319.text).toMatch(/imprisonment.*three years/i);

    // Ensure Section 318 is NOT used for cheating by personation
    const section318 = bnsProvisions.find(p => p.article === 'Section 318');
    expect(section318).toBeUndefined();
  });

  test('BNS Section 352 should be about intentional insult (NOT Section 351)', () => {
    const section352 = bnsProvisions.find(p => p.article === 'Section 352');
    expect(section352).toBeDefined();
    expect(section352.text).toMatch(/intentionally insults/i);
    expect(section352.text).toMatch(/provocation/i);
    expect(section352.text).toMatch(/public peace/i);

    // Ensure Section 351 is NOT used for intentional insult
    const section351 = bnsProvisions.find(p => p.article === 'Section 351');
    expect(section351).toBeUndefined();
  });

  test('BNS Section 318 should NOT be labeled as cheating by personation', () => {
    // This was the original error: Section 318 was incorrectly labeled
    const allProvisions = legalTopics.flatMap(t => t.provisions);
    const wrongMapping = allProvisions.find(
      p => p.article === 'Section 318' && p.text.includes('personation')
    );
    expect(wrongMapping).toBeUndefined();
  });

  test('BNS Section 351 should NOT be labeled as criminal insult', () => {
    // This was the original error: Section 351 was incorrectly labeled
    const allProvisions = legalTopics.flatMap(t => t.provisions);
    const wrongMapping = allProvisions.find(
      p => p.article === 'Section 351' && p.text.includes('insult')
    );
    expect(wrongMapping).toBeUndefined();
  });

  test('all BNS provisions should have unverified status (pending official text verification)', () => {
    for (const provision of bnsProvisions) {
      expect(provision.verificationStatus).toBe('unverified');
      expect(provision.verificationNote).toBeDefined();
      expect(provision.verificationNote.length).toBeGreaterThan(0);
    }
  });

  test('all BNS provisions should have effective date of 1 July 2024', () => {
    for (const provision of bnsProvisions) {
      expect(provision.effectiveDate).toBe('2024-07-01');
    }
  });
});

describe('Legal Topic Structure Integrity', () => {
  test('every provision should have required fields', () => {
    for (const topic of legalTopics) {
      for (const provision of topic.provisions) {
        expect(provision).toHaveProperty('article');
        expect(provision).toHaveProperty('law');
        expect(provision).toHaveProperty('text');
        expect(provision).toHaveProperty('sourceUrl');
        expect(provision).toHaveProperty('sourceName');
        expect(provision).toHaveProperty('verificationStatus');
        expect(provision.text.length).toBeGreaterThan(50);
      }
    }
  });

  test('every provision should have a valid source URL', () => {
    for (const topic of legalTopics) {
      for (const provision of topic.provisions) {
        expect(provision.sourceUrl).toMatch(/^https?:\/\//);
      }
    }
  });

  test('every provision should have verification status', () => {
    const validStatuses = ['authoritative', 'unverified'];
    for (const topic of legalTopics) {
      for (const provision of topic.provisions) {
        expect(validStatuses).toContain(provision.verificationStatus);
      }
    }
  });

  test('unverified provisions should have verification notes', () => {
    for (const topic of legalTopics) {
      for (const provision of topic.provisions) {
        if (provision.verificationStatus === 'unverified') {
          expect(provision.verificationNote).toBeDefined();
          expect(provision.verificationNote.length).toBeGreaterThan(10);
        }
      }
    }
  });

  test('should cover all required legal categories', () => {
    const categories = new Set(legalTopics.map(t => t.category));
    expect(categories.has('Constitutional Rights')).toBe(true);
    expect(categories.has('Education Rights')).toBe(true);
    expect(categories.has('Employment & Internships')).toBe(true);
    expect(categories.has('Online Safety')).toBe(true);
    expect(categories.has('Consumer Rights')).toBe(true);
  });
});
