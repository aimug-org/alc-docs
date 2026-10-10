// Numbers on the home page. Update by hand when they move; each says when it was counted.
export const stats = {
  asOf: '2026-10-09',
  meetupMembers: 2264,
  youtubeViews: 34097,
};

export const links = {
  discord: 'https://discord.gg/JzWgadPFQd',
  youtube: 'https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig',
  linkedin: 'https://www.linkedin.com/company/austin-ai-middleware-users-group',
  x: 'https://x.com/AustinLangChain',
  meetup: 'https://www.meetup.com/austin-langchain-ai-group/',
  github: 'https://github.com/aimug-org',
  newsletter: 'https://buttondown.com/api/emails/embed-subscribe/aimug.org',
  officeHours: 'https://meet.google.com/fsm-nawg-cng',
};

// Where to follow AIMUG, in the order people usually want them. Header, footer, home and /community/ all read this.
export const channels = [
  { key: 'mail', label: 'Email', href: '/community/#newsletter', blurb: 'The lineup before each meetup, and the talks once they are up.' },
  { key: 'discord', label: 'Discord', href: links.discord, blurb: 'Chat with members, get help, share what you are building.' },
  { key: 'youtube', label: 'YouTube', href: links.youtube, blurb: 'Every talk, recorded.' },
  { key: 'meetup', label: 'Meetup', href: links.meetup, blurb: 'The group, the calendar and RSVPs.' },
  { key: 'x', label: 'X', href: links.x, blurb: 'Announcements as @AustinLangChain.' },
  { key: 'linkedin', label: 'LinkedIn', href: links.linkedin, blurb: 'Announcements and recaps.' },
] as const;

export const nav = [
  { label: 'Talks', href: '/talks/' },
  { label: 'Events', href: '/events/' },
  { label: 'Speakers', href: '/speakers/' },
  { label: 'Notes', href: '/docs/' },
  { label: 'Speak', href: '/speak/' },
  { label: 'Support', href: '/support/' },
];

export const venueThanks = 'Thanks to CGCS at Austin Community College for the room.';
