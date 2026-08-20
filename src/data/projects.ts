export type Project = {
  id: 'bunderstack' | 'bunderhost' | 'hrbreakers' | 'telegram-vpn' | 'klaud';
  name: string;
  title: string;
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
    title: 'Bunderstack is a type-safe backend foundation.',
    description: 'A batteries-included Bun stack organized around one oRPC graph, with the recurring infrastructure decisions already made.',
    accent: '#9b7bff',
    role: 'Foundational opus',
    status: 'Building',
    href: 'https://github.com/kirill-dev-pro/bunderstack',
    featured: true,
  },
  {
    id: 'bunderhost',
    name: 'Bunderhost',
    title: 'Bunderhost deploys Bunderstack applications.',
    description: 'Git-connected deploys, managed resources, and preview environments for every pull request.',
    accent: '#55e6ff',
    role: 'Infrastructure',
    status: 'Building',
    href: 'https://bunderhost.kcrz.dev',
  },
  {
    id: 'hrbreakers',
    name: 'HR Breakers',
    title: 'HR Breakers turns vacancies into targeted resumes.',
    description: 'It adapts an existing resume to a job description and produces a focused PDF ready to send.',
    accent: '#d7ff43',
    role: 'Product',
    status: 'Shipped',
    href: 'https://hrbreakers.com',
  },
  {
    id: 'telegram-vpn',
    name: 'Telegram VPN',
    title: 'Telegram VPN sells traffic-based access inside Telegram.',
    description: 'One account connects devices, billing, traffic limits, and a dashboard without a separate support flow.',
    accent: '#3f87ff',
    role: 'Product',
    status: 'Shipped',
    href: 'https://telegram-vpn.xyz',
  },
  {
    id: 'klaud',
    name: 'Klaud',
    title: 'Klaud provides identity for OAuth, OIDC, and SAML apps.',
    description: 'Groups connect people to applications through one compact authentication and authorization layer.',
    accent: '#ff7043',
    role: 'Infrastructure',
    status: 'Building',
    href: 'https://klaud.me',
  },
];
