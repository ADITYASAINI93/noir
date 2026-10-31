export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  contactEmail: string;
  contactPhone: string;
  operatingRegion: string;
  cityState: string;
  instagramHandle: string;
  instagramUrl: string;
  operatingHours: string;
  admissionPolicy: string;
  updatedAt?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'NOIR EVENTS',
  brandTagline: 'THE ART OF EXCLUSIVE NIGHTLIFE',
  contactEmail: 'noirchd@gmail.com',
  contactPhone: '+91 81685 11261',
  operatingRegion: 'Sector 26 Nightlife Hub & Madhya Marg, Chandigarh, India',
  cityState: 'Chandigarh, India',
  instagramHandle: '@noir.chd',
  instagramUrl: 'https://www.instagram.com/noir.chd/',
  operatingHours: 'Daily: 12:00 PM — 02:00 AM IST',
  admissionPolicy: 'All guests attending NOIR showcases must be 21+ with verified government photo identification. A strict zero-tolerance drug policy is enforced at all venues.',
};
