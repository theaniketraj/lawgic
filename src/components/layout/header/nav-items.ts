export const navItems = [
  {
    type: 'link',
    href: '/',
    label: 'Home',
  },
  {
    type: 'link',
    label: 'Chat',
    href: '/chat',
  },
  {
    type: 'link',
    label: 'Docs',
    href: '/docs',
  },
  {
    type: 'link',
    label: 'About',
    href: '/about',
  },
  {
    type: 'link',
    label: 'Team',
    href: '/team',
  },
] satisfies NavItem[];

type NavItem = Record<string, string | unknown> &
  (
    | {
        type: 'link';
        href: string;
      }
    | {
        type: 'dropdown';
      }
  );
