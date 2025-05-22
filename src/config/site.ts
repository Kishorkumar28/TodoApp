export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "QuestLog",
  description: "Embark on epic quests to conquer your to-do list!",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Quests",
      href: "/quests",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Quests",
      href: "/quests",
      icon: "ListChecks",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: "User",
    },
  ],
  links: {
    // Add external links if any, e.g., GitHub
  },
};
