/**
 * Site configuration
 */

export const siteConfig = {
    identity: {
        name: "Leon Joachim Buverud De Backer",
        // GitHub user ID for avatar: https://avatars.githubusercontent.com/u/{USER_ID}
        githubUserId: "226676348",
    },

    links: [
        {
            label: "GitHub (Work)",
            href: "https://github.com/leon-uio",
            icon: "github",
        },
        {
            label: "GitHub (Personal)",
            href: "https://github.com/leonjbdb",
            icon: "github",
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/leon-joachim-buverud-de-backer-760346b8/",
            icon: "linkedin",
        },
        {
            label: "UiO Profile",
            href: "https://people.uio.no/leon",
            icon: "uio",
        },
    ],

    contact: {
        email: "contact@de-backer.no",
    },

    footer: {
        copyright: `© ${new Date().getFullYear()} Leon Joachim Buverud De Backer`,
    },
} as const;

export type SiteConfig = typeof siteConfig;
export type LinkItem = (typeof siteConfig.links)[number];
