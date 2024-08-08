import type { Site, Page, Links, Socials } from "@types";

const FEATURES_CONFIG = {
  RSS: true,

  work: false,
  projects: false,

  search: true,

  themeSwitch: false,
  home_bio: true,
  home_projects: true,
  home_stack: true,
  home_posts: true,
} as const;

type Features = keyof typeof FEATURES_CONFIG;

export function isFeatureEnabled(feature: Features) {
  return FEATURES_CONFIG[feature];
}

// Global
export const SITE: Site = {
  TITLE: "Rafał Kornel",
  DESCRIPTION:
    "Welcome to my website! I am a software developer, specialising in frontend, backend, fullstack, AI, ML, web and others!",
  AUTHOR: "Rafał Kornel",
};

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
};

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
};

// Projects Page
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
};

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
};

// Links
export const LINKS: Links = [
  {
    TEXT: "Home",
    HREF: "/",
  },
  {
    TEXT: "Work",
    HREF: "/work",
    isDisabled: !isFeatureEnabled("work"),
  },
  {
    TEXT: "Blog",
    HREF: "/blog",
  },
  {
    TEXT: "Projects",
    HREF: "/projects",
    isDisabled: !isFeatureEnabled("projects"),
  },
].filter(({ isDisabled }) => !isDisabled);

// Socials
export const SOCIALS: Socials = [
  // {
  //   NAME: "Email",
  //   ICON: "email",
  //   TEXT: "markhorn.dev@gmail.com",
  //   HREF: "mailto:markhorn.dev@gmail.com",
  // },
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "rafalkornel",
    HREF: "https://github.com/RafalKornel",
  },
  {
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "rafalkornel",
    HREF: "https://www.linkedin.com/in/rafal-kornel/",
  },
  // {
  //   NAME: "Twitter",
  //   ICON: "twitter-x",
  //   TEXT: "markhorn_dev",
  //   HREF: "https://twitter.com/markhorn_dev",
  // },
];
