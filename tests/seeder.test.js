const mongoose = require('mongoose');
const { seedLegalDocuments } = require('../server/services/legalSeeder');
const legalTopics = require('../server/data/legalTopics');
const Embedding = require('../server/models/Embedding');

describe('Legal Seeder', () => {
  test('should seed legal provisions on first run', async () => {
    const result = await seedLegalDocuments();
    expect(result.seeded).toBe(true);
    expect(result.count).toBeGreaterThan(0);

    const count = await Embedding.countDocuments({ documentId: null });
    expect(count).toBe(result.count);
  });

  test('should skip seeding on second run (idempotent)', async () => {
    // First run
    await seedLegalDocuments();

    // Second run should skip
    const result = await seedLegalDocuments();
    expect(result.seeded).toBe(false);
    expect(result.reason).toBe('already_seeded');
  });

  test('should not create duplicate provisions on re-seed', async () => {
    // Seed once
    await seedLegalDocuments();
    const firstCount = await Embedding.countDocuments({ documentId: null });

    // Seed again — should skip (idempotent)
    await seedLegalDocuments();
    const secondCount = await Embedding.countDocuments({ documentId: null });

    // Count should not increase — this is the key idempotency check
    expect(secondCount).toBe(firstCount);
    expect(secondCount).toBeGreaterThan(0);
  });

  test('should index all provisions from legalTopics', async () => {
    const result = await seedLegalDocuments();

    // Count expected provisions
    let expectedCount = 0;
    for (const topic of legalTopics) {
      expectedCount += topic.provisions.length;
    }

    expect(result.count).toBe(expectedCount);
  });

  test('should include source URLs in metadata', async () => {
    await seedLegalDocuments();

    const provisions = await Embedding.find({ documentId: null }).lean();

    const withUrls = provisions.filter(p => p.metadata && p.metadata.sourceUrl);
    expect(withUrls.length).toBeGreaterThan(0);
  });
});
