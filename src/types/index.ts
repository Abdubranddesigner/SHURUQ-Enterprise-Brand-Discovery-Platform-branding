export type PackageId = 'basic' | 'pro' | 'premium';

export interface PackageDetails {
  id: PackageId;
  name: string;
  badge?: string;
  priceETB: string;
  priceNumeric: number;
  timeline: string;
  features: string[];
  popular?: boolean;
}

export interface ClientInfo {
  fullName: string;
  businessName: string;
  whatsappNumber: string;
  preferredContactMethod: 'whatsapp' | 'call' | 'telegram';
  email?: string;
  additionalComments?: string;
  honeypot?: string; // Spam protection honeypot
}

export interface QuestionnaireAnswers {
  // Section A: Business Foundation
  q1: string; // What is your product? What do you do? Or what service do you provide?
  q2: string; // Why does your company exist? What are the functional, symbolic or experiential benefits?
  q3: string; // What is the full name of your business?
  q4: string; // Is there a compelling story behind your company? How did you get started?
  q5: string; // What values does your company live by?

  // Section B: Market and Positioning
  q6: string; // How do you differ from your competitors? What sets you apart?
  q7: string; // How old is your target audience?
  q8: string; // Where are your target audience based?

  // Section C: Visual Direction
  q9: string;  // Do you have a specific idea in mind for your new logo?
  q10: string; // Do you want to use existing brand colours or a particular range of colours?
  q11: string; // Does your logo need a tagline?
  q12: string; // What current logos do you like and why? Provide links if you can.
  inspirationUrls: string[];

  // Section D: Project Requirements
  q13: string; // Do you require any additional supporting designs alongside your logo?
  q14: string; // Any questions or comments?
  q15: string; // And finally, what does success look like for this project?
}

export interface SubmissionPayload {
  clientInfo: ClientInfo;
  selectedPackage: PackageId;
  answers: QuestionnaireAnswers;
  pdfBase64?: string;
  referenceId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  referenceId?: string;
}
