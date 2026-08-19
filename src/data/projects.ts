export type Project = {
  id: 'bunderstack' | 'bunderhost' | 'hrbreakers' | 'telegram-vpn' | 'klaud';
  name: string;
  description: string;
  accent: string;
  role: string;
  status: string;
  href: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: 'bunderstack',
    name: 'Bunderstack',
    description: 'A batteries-included Bun backend organized around one type-safe oRPC graph.',
    accent: '#9b7bff',
    role: 'Foundational opus',
    status: 'Building',
    href: 'https://github.com/kirill-dev-pro/bunderstack',
    featured: true,
  },
  {
    id: 'bunderhost',
    name: 'Bunderhost',
    description: 'Hosting for Bunderstack applications with Git-connected deploys, managed resources, and PR preview environments.',
    accent: '#55e6ff',
    role: 'Infrastructure',
    status: 'Building',
    href: 'https://bunderhost.kcrz.dev',
  },
  {
    id: 'hrbreakers',
    name: 'HR Breakers',
    description: 'AI-assisted resume adaptation that turns a resume and job description into a targeted PDF.',
    accent: '#d7ff43',
    role: 'Product',
    status: 'Shipped',
    href: 'https://hrbreakers.com',
  },
  {
    id: 'telegram-vpn',
    name: 'Telegram VPN',
    description: 'Traffic-based VPN access across devices with Telegram, billing, and a user dashboard.',
    accent: '#3f87ff',
    role: 'Product',
    status: 'Shipped',
    href: 'https://telegram-vpn.xyz',
  },
  {
    id: 'klaud',
    name: 'Klaud',
    description: 'Group-based identity provider for OAuth/OIDC and SAML applications.',
    accent: '#ff7043',
    role: 'Infrastructure',
    status: 'Building',
    href: 'https://klaud.me',
  },
];
