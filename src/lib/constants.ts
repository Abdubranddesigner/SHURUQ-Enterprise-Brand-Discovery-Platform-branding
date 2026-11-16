import { PackageDetails, PackageId } from '../types';

export const STORAGE_KEY = 'shuruq_discovery_draft_v1';

export const OFFICIAL_PACKAGES: Record<PackageId, PackageDetails> = {
  basic: {
    id: 'basic',
    name: 'BASIC',
    priceETB: '25,000 ETB',
    priceNumeric: 25000,
    timeline: '5–7 days',
    features: [
      'Logo Usage Guide',
      'Color Palette',
      'Typography',
    ],
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    badge: 'MOST POPULAR',
    priceETB: '35,000 ETB',
    priceNumeric: 35000,
    timeline: '7–14 days',
    features: [
      'Full Brand Kit',
      'Logo Variations',
      'Color System',
      'Typography System',
      'Social Media Kit',
    ],
    popular: true,
  },
  premium: {
    id: 'premium',
    name: 'PREMIUM',
    badge: 'ENTERPRISE SUITE',
    priceETB: '50,000 ETB',
    priceNumeric: 50000,
    timeline: '14–25 days',
    features: [
      'Complete Brand Strategy',
      'Brand Guidelines (PDF)',
      'Visual Identity System',
      'Stationery Design',
      'Social Media Assets',
    ],
  },
};

export const COMPANY_INFO = {
  name: 'SHURUQ ENTERPRISE',
  tagline: 'Empowering Ideas. Building the Future.',
  directLine: '+251 955 303 950',
  whatsappNumber: '251955303950',
  whatsappUrl: 'https://wa.me/251955303950',
  email: 'shuruqenterprise@gmail.com',
};

export const QUESTION_DEFINITIONS = [
  // Section A
  { id: 'q1', number: '01', section: 'A', title: 'What is your product? What do you do? Or what service do you provide?', placeholder: 'Describe your core products, services, or offerings in detail...' },
  { id: 'q2', number: '02', section: 'A', title: 'Why does your company exist? What are the functional, symbolic or experiential benefits?', placeholder: 'Explain the deeper mission and benefits your clients experience...' },
  { id: 'q3', number: '03', section: 'A', title: 'What is the full name of your business?', placeholder: 'The exact legal / trade name of your company...' },
  { id: 'q4', number: '04', section: 'A', title: 'Is there a compelling story behind your company? How did you get started?', placeholder: 'Share your founding story, milestone moments, and inspiration...' },
  { id: 'q5', number: '05', section: 'A', title: 'What values does your company live by?', placeholder: 'e.g. Integrity, Innovation, Excellence, Speed, Craftsmanship...' },

  // Section B
  { id: 'q6', number: '06', section: 'B', title: 'How do you differ from your competitors? What sets you apart?', placeholder: 'Detail your unique selling propositions (USPs) and competitive edge...' },
  { id: 'q7', number: '07', section: 'B', title: 'How old is your target audience?', placeholder: 'e.g. 18-24, 25-40, corporate executives, all age groups...' },
  { id: 'q8', number: '08', section: 'B', title: 'Where are your target audience based?', placeholder: 'e.g. Addis Ababa, Ethiopia-wide, East Africa, International diaspora...' },

  // Section C
  { id: 'q9', number: '09', section: 'C', title: 'Do you have a specific idea in mind for your new logo?', placeholder: 'Describe any visual concepts, emblems, minimalist marks, or symbols you envision...' },
  { id: 'q10', number: '10', section: 'C', title: 'Do you want to use existing brand colours or a particular range of colours?', placeholder: 'List specific hex codes, color moods (e.g. Gold & Obsidian, Emerald & Slate), or leave it to our creative direction...' },
  { id: 'q11', number: '11', section: 'C', title: 'Does your logo need a tagline?', placeholder: 'State your current tagline or mention if you need assistance formulating one...' },
  { id: 'q12', number: '12', section: 'C', title: 'What current logos do you like and why? Provide links if you can. Try dribbble.com or behance.net for some inspiration.', placeholder: 'Describe reference logos, brand aesthetics, or design styles you admire...' },

  // Section D
  { id: 'q13', number: '13', section: 'D', title: 'Do you require any additional supporting designs alongside your logo? (e.g., business cards, social media kits, packaging)', placeholder: 'List any stationery, packaging, 3D mockups, or collateral needs...' },
  { id: 'q14', number: '14', section: 'D', title: 'Any questions or comments?', placeholder: 'Any special requirements, deadlines, or inquiries for our team...' },
  { id: 'q15', number: '15', section: 'D', title: 'And finally, what does success look like for this project?', placeholder: 'What outcome or milestone will make this branding engagement an absolute win for you?' },
] as const;
