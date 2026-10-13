/**
 * Legal Topic Structure for Indian Youth Rights
 * Organized by category with provisions, sections, and source references.
 *
 * Verification status:
 * - "verified": Text matches authoritative sources reviewed by legal professionals
 * - "authoritative": Source is an official government publication
 * - "unverified": Text has not been confirmed against the official statute; use with caution
 *
 * All provisions should be periodically reviewed for amendments.
 * Last reviewed: October 2026
 */

const legalTopics = [
  // ===== CONSTITUTIONAL RIGHTS =====
  {
    category: 'Constitutional Rights',
    topic: 'Right to Equality',
    description: 'Article 14 guarantees equality before the law and equal protection of the laws within the territory of India.',
    provisions: [
      {
        article: 'Article 14',
        law: 'Constitution of India',
        text: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
      {
        article: 'Article 15',
        law: 'Constitution of India',
        text: 'The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
      {
        article: 'Article 16',
        law: 'Constitution of India',
        text: 'There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
    ],
  },
  {
    category: 'Constitutional Rights',
    topic: 'Right to Freedom',
    description: 'Articles 19-22 protect fundamental freedoms including speech, assembly, and personal liberty.',
    provisions: [
      {
        article: 'Article 19',
        law: 'Constitution of India',
        text: 'All citizens shall have the right to freedom of speech and expression, to assemble peaceably and without arms, to form associations or unions, to move freely throughout the territory of India, to reside and settle in any part of the territory of India, and to practice any profession, or to carry on any trade, business or occupation.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
      {
        article: 'Article 21',
        law: 'Constitution of India',
        text: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
    ],
  },
  {
    category: 'Constitutional Rights',
    topic: 'Right Against Exploitation',
    description: 'Articles 23-24 prohibit trafficking, forced labor, and child labor.',
    provisions: [
      {
        article: 'Article 23',
        law: 'Constitution of India',
        text: 'Traffic in human beings and begar and other similar forms of forced labour are prohibited and any contravention of this provision shall be an offence punishable in accordance with law.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
      {
        article: 'Article 24',
        law: 'Constitution of India',
        text: 'No child below the age of fourteen years shall be employed to work in any factory or mine or engaged in any other hazardous employment.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
    ],
  },
  {
    category: 'Constitutional Rights',
    topic: 'Right to Education',
    description: 'Article 21A guarantees free and compulsory education for children aged 6-14. Article 45 (as amended) covers early childhood care.',
    provisions: [
      {
        article: 'Article 21A',
        law: 'Constitution of India',
        text: 'The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '2002-04-01',
        amendmentNote: 'Inserted by the 86th Amendment Act, 2002',
      },
      {
        article: 'Article 45',
        law: 'Constitution of India',
        text: 'The State shall endeavour to provide early childhood care and education for all children until they complete the age of six years.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '2002-04-01',
        amendmentNote: 'Substituted by the 86th Amendment Act, 2002. Original text referred to free and compulsory education up to age 14.',
      },
    ],
  },

  // ===== EDUCATION RIGHTS =====
  {
    category: 'Education Rights',
    topic: 'Ragging Prevention',
    description: 'UGC regulations and Supreme Court guidelines prohibit ragging in educational institutions.',
    provisions: [
      {
        article: 'Regulation 3',
        law: 'UGC (Regulation on Ragging in Higher Educational Institutions) Regulations, 2009',
        text: 'Ragging in any form is strictly prohibited in higher educational institutions. Any student found guilty of ragging shall be punished as per the regulations, which may include expulsion, suspension, or cancellation of admission.',
        sourceUrl: 'https://www.ugc.ac.in/pdfnews/7588756_Regulation-on-Ragging.pdf',
        sourceName: 'University Grants Commission',
        verificationStatus: 'authoritative',
        effectiveDate: '2009-06-17',
      },
      {
        article: 'Regulation 6',
        law: 'UGC (Regulation on Ragging in Higher Educational Institutions) Regulations, 2009',
        text: 'Every institution shall constitute an Anti-Ragging Committee and an Anti-Ragging Squad to prevent ragging. Students can report ragging incidents to these bodies or to the institutional head.',
        sourceUrl: 'https://www.ugc.ac.in/pdfnews/7588756_Regulation-on-Ragging.pdf',
        sourceName: 'University Grants Commission',
        verificationStatus: 'authoritative',
        effectiveDate: '2009-06-17',
      },
    ],
  },
  {
    category: 'Education Rights',
    topic: 'College Document Retention',
    description: 'Colleges cannot legally withhold original documents such as mark sheets, certificates, or degrees.',
    provisions: [
      {
        article: 'UGC Guidelines',
        law: 'UGC Guidelines for Withholding Academic Documents',
        text: 'Educational institutions shall not withhold original academic documents of students. Original degrees, mark sheets, and certificates must be returned to students even if there are pending fees or other disputes.',
        sourceUrl: 'https://www.ugc.ac.in',
        sourceName: 'University Grants Commission',
        verificationStatus: 'unverified',
        verificationNote: 'UGC has issued advisories against withholding original documents. Verify specific regulation number.',
      },
      {
        article: 'Section 2(1)(r)',
        law: 'Consumer Protection Act, 2019',
        text: 'Unfair trade practice includes making false or misleading representations about goods or services. Withholding original documents may constitute an unfair trade practice.',
        sourceUrl: 'https://egazette.nic.in/WriteReadData/2019/210427.pdf',
        sourceName: 'Ministry of Law and Justice — Official Gazette',
        verificationStatus: 'authoritative',
        effectiveDate: '2019-07-20',
      },
    ],
  },
  {
    category: 'Education Rights',
    topic: 'Scholarship Rights',
    description: 'Students have the right to timely disbursement of scholarships as per government schemes.',
    provisions: [
      {
        article: 'National Scholarship Portal Guidelines',
        law: 'Ministry of Education Scholarships Guidelines',
        text: 'Students who meet eligibility criteria for government scholarships have the right to receive their scholarship amounts within the timelines specified by the respective scholarship scheme. Delays can be reported through the National Scholarship Portal grievance mechanism.',
        sourceUrl: 'https://scholarships.gov.in/',
        sourceName: 'Ministry of Education, Government of India',
        verificationStatus: 'authoritative',
        verificationNote: 'Portal is authoritative; specific scheme timelines vary.',
      },
    ],
  },

  // ===== EMPLOYMENT & INTERNSHIP RIGHTS =====
  {
    category: 'Employment & Internships',
    topic: 'Internship Stipend Rights',
    description: 'Interns have rights regarding timely payment of promised stipends.',
    provisions: [
      {
        article: 'Section 73',
        law: 'Indian Contract Act, 1872',
        text: 'When a contract has been broken, the party who suffers by such breach is entitled to receive compensation from the party who has broken the contract for any loss or damage caused to him thereby.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/4857/1/indian_contract_act.pdf',
        sourceName: 'India Code — Indian Contract Act, 1872',
        verificationStatus: 'authoritative',
        effectiveDate: '1872-04-25',
      },
      {
        article: 'Article 23',
        law: 'Constitution of India',
        text: 'Traffic in human beings and begar and other similar forms of forced labour are prohibited. Unpaid labour where a promise of payment exists may be challenged as a form of exploitation.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1950-01-26',
      },
    ],
  },
  {
    category: 'Employment & Internships',
    topic: 'Workplace Harassment',
    description: 'The POSH Act, 2013 mandates prevention of sexual harassment at the workplace, including internships.',
    provisions: [
      {
        article: 'Section 3',
        law: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
        text: 'No woman shall be subjected to sexual harassment at any workplace. The Act applies to all workplaces including educational institutions, companies, and organizations where interns work.',
        sourceUrl: 'https://legislative.gov.in/sites/default/files/A2013-19.pdf',
        sourceName: 'Legislative Department, Ministry of Law and Justice',
        verificationStatus: 'authoritative',
        effectiveDate: '2013-04-22',
      },
      {
        article: 'Section 9',
        law: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
        text: 'Any woman who is aggrieved by the acts of the respondent may make a written complaint to the Internal Complaints Committee (ICC) or Local Complaints Committee (LCC) within three months from the date of the incident.',
        sourceUrl: 'https://legislative.gov.in/sites/default/files/A2013-19.pdf',
        sourceName: 'Legislative Department, Ministry of Law and Justice',
        verificationStatus: 'authoritative',
        effectiveDate: '2013-04-22',
      },
      {
        article: 'Section 19',
        law: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
        text: 'Every employer shall constitute an Internal Complaints Committee (ICC) at each office or branch with 10 or more employees. The ICC shall be headed by a woman employee and include at least two members from amongst employees committed to the cause of women.',
        sourceUrl: 'https://legislative.gov.in/sites/default/files/A2013-19.pdf',
        sourceName: 'Legislative Department, Ministry of Law and Justice',
        verificationStatus: 'authoritative',
        effectiveDate: '2013-04-22',
      },
    ],
  },
  {
    category: 'Employment & Internships',
    topic: 'Minimum Wages',
    description: 'The Minimum Wages Act ensures fair wages for workers including apprentices.',
    provisions: [
      {
        article: 'Section 3',
        law: 'Minimum Wages Act, 1948',
        text: 'The appropriate Government shall fix the minimum rates of wages payable to employees employed in employments mentioned in Part I or Part II of the Schedule.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/1625/1/the_minimum_wages_act_1948.pdf',
        sourceName: 'India Code — Minimum Wages Act, 1948',
        verificationStatus: 'authoritative',
        effectiveDate: '1948-03-15',
      },
    ],
  },

  // ===== ONLINE SAFETY =====
  {
    category: 'Online Safety',
    topic: 'Fake Social Media Profiles',
    description: 'Creating fake profiles or impersonation online is punishable under IT Act and BNS.',
    provisions: [
      {
        article: 'Section 66D',
        law: 'Information Technology Act, 2000',
        text: 'Whoever, by means of any communication device or computer resource cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/1372/1/information_technology_act_2000.pdf',
        sourceName: 'India Code — Information Technology Act, 2000',
        verificationStatus: 'authoritative',
        effectiveDate: '2000-10-17',
        amendmentNote: 'Inserted by the Information Technology (Amendment) Act, 2008',
      },
      {
        article: 'Section 319',
        law: 'Bharatiya Nyaya Sanhita (BNS), 2023',
        text: 'Whoever cheats by personation shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
        sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20062',
        sourceName: 'India Code — Bharatiya Nyaya Sanhita, 2023',
        verificationStatus: 'unverified',
        verificationNote: 'BNS Section 319 covers cheating by personation. Corresponds to IPC Section 419. Verify against official BNS text at indiacode.nic.in.',
        effectiveDate: '2024-07-01',
      },
    ],
  },
  {
    category: 'Online Safety',
    topic: 'Cyberbullying',
    description: 'Online harassment, stalking, and bullying are criminal offenses under IT Act and BNS.',
    provisions: [
      {
        article: 'Section 67',
        law: 'Information Technology Act, 2000',
        text: 'Whoever publishes or transmits or causes to be published or transmitted in the electronic form, any material which is lascivious or appeals to the prurient interest or if its effect is such as to tend to deprave and corrupt persons who are likely, having regard to all relevant circumstances, to read, see or hear the matter contained or embodied in it, shall be punished on first conviction with imprisonment of either description for a term which may extend to three years and with fine which may extend to five lakh rupees.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/1372/1/information_technology_act_2000.pdf',
        sourceName: 'India Code — Information Technology Act, 2000',
        verificationStatus: 'authoritative',
        effectiveDate: '2000-10-17',
      },
      {
        article: 'Section 352',
        law: 'Bharatiya Nyaya Sanhita (BNS), 2023',
        text: 'Whoever intentionally insults, and thereby gives provocation to any person, intending or knowing it to be likely that such provocation will cause him to break the public peace, or to commit any other offence, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.',
        sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20062',
        sourceName: 'India Code — Bharatiya Nyaya Sanhita, 2023',
        verificationStatus: 'unverified',
        verificationNote: 'BNS Section 352 covers intentional insult with intent to provoke breach of peace. Corresponds to IPC Section 504. Verify against official BNS text at indiacode.nic.in.',
        effectiveDate: '2024-07-01',
      },
    ],
  },
  {
    category: 'Online Safety',
    topic: 'Reporting Cybercrime',
    description: 'How to report cybercrime and the National Cyber Crime Portal.',
    provisions: [
      {
        article: 'National Cyber Crime Portal',
        law: 'Ministry of Home Affairs',
        text: 'Victims of cybercrime can file complaints at https://cybercrime.gov.in or call the National Cyber Crime Helpline at 1930. The portal allows reporting of various cybercrimes including online harassment, financial fraud, and identity theft.',
        sourceUrl: 'https://cybercrime.gov.in/',
        sourceName: 'National Cyber Crime Reporting Portal',
        verificationStatus: 'authoritative',
      },
      {
        article: 'Section 78',
        law: 'Information Technology Act, 2000',
        text: 'Police officers not below the rank of Inspector can investigate any offence under this Act.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/1372/1/information_technology_act_2000.pdf',
        sourceName: 'India Code — Information Technology Act, 2000',
        verificationStatus: 'authoritative',
        effectiveDate: '2000-10-17',
      },
    ],
  },

  // ===== CONSUMER RIGHTS =====
  {
    category: 'Consumer Rights',
    topic: 'Online Shopping Refunds',
    description: 'Consumer Protection Act and E-Commerce Rules protect online shoppers.',
    provisions: [
      {
        article: 'Section 2(1)(r)',
        law: 'Consumer Protection Act, 2019',
        text: 'Unfair trade practice includes making false or misleading representations about goods or services. Online sellers must honor legitimate refund requests as per their stated return policies.',
        sourceUrl: 'https://egazette.nic.in/WriteReadData/2019/210427.pdf',
        sourceName: 'Ministry of Law and Justice — Official Gazette',
        verificationStatus: 'authoritative',
        effectiveDate: '2019-07-20',
      },
      {
        article: 'Rule 5(3)',
        law: 'Consumer Protection (E-Commerce) Rules, 2020',
        text: 'Every e-commerce entity shall provide clear information about return, refund, exchange, warranty and guarantee, delivery and shipment, grievance redressal mechanism, and modes of payment.',
        sourceUrl: 'https://consumeraffairs.nic.in/sites/default/files/E%20commerce%20rules%202020.pdf',
        sourceName: 'Ministry of Consumer Affairs, Food and Public Distribution',
        verificationStatus: 'authoritative',
        effectiveDate: '2020-07-23',
      },
      {
        article: 'Rule 7',
        law: 'Consumer Protection (E-Commerce) Rules, 2020',
        text: 'No e-commerce entity shall manipulate the price of the goods or services offered on its platform to gain unreasonable profit by imposing unjustified charges.',
        sourceUrl: 'https://consumeraffairs.nic.in/sites/default/files/E%20commerce%20rules%202020.pdf',
        sourceName: 'Ministry of Consumer Affairs, Food and Public Distribution',
        verificationStatus: 'authoritative',
        effectiveDate: '2020-07-23',
      },
    ],
  },
  {
    category: 'Consumer Rights',
    topic: 'Consumer Grievance Redressal',
    description: 'How to file consumer complaints and the three-tier redressal system.',
    provisions: [
      {
        article: 'Section 35',
        law: 'Consumer Protection Act, 2019',
        text: 'A consumer can file a complaint before the District Commission when the value of goods or services paid as consideration does not exceed one crore rupees. The State Commission handles complaints between one crore and ten crore rupees, and the National Commission handles complaints exceeding ten crore rupees.',
        sourceUrl: 'https://egazette.nic.in/WriteReadData/2019/210427.pdf',
        sourceName: 'Ministry of Law and Justice — Official Gazette',
        verificationStatus: 'authoritative',
        effectiveDate: '2019-07-20',
      },
      {
        article: 'National Consumer Helpline',
        law: 'Consumer Affairs Ministry',
        text: 'Consumers can call the National Consumer Helpline at 1800-11-4000 or 14404 for assistance with grievances, or file complaints online at the Consumer Online Resource and Empowerment Centre (CORE) portal.',
        sourceUrl: 'https://consumerhelpline.gov.in/',
        sourceName: 'National Consumer Helpline',
        verificationStatus: 'authoritative',
      },
    ],
  },

  // ===== FUNDAMENTAL DUTIES =====
  {
    category: 'Fundamental Duties',
    topic: 'Duties of Citizens',
    description: 'Article 51A outlines the fundamental duties of every Indian citizen.',
    provisions: [
      {
        article: 'Article 51A',
        law: 'Constitution of India',
        text: 'It shall be the duty of every citizen of India to abide by the Constitution and respect its ideals and institutions; to cherish and follow the noble ideals which inspired our national struggle for freedom; to uphold and protect the sovereignty, unity and integrity of India; to defend the country and render national service when called upon to do so; to promote harmony and the spirit of common brotherhood amongst all the people of India; to renounce practices derogatory to the dignity of women; to value and preserve the rich heritage of our composite culture; to protect and improve the natural environment; to develop the scientific temper, humanism and the spirit of inquiry and reform; to safeguard public property and to abjure violence; to strive towards excellence in all spheres of individual and collective activity.',
        sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf',
        sourceName: 'India Code — Constitution of India',
        verificationStatus: 'authoritative',
        effectiveDate: '1976-01-03',
        amendmentNote: 'Inserted by the 42nd Amendment Act, 1976',
      },
    ],
  },
];

module.exports = legalTopics;
