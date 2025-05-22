export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "DevTrack",
  description: "Efficiently manage your software development tasks and projects.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Tasks",
      href: "/tasks",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: "ClipboardList", // Changed from ListChecks for better task representation
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
