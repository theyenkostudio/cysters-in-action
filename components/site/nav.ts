export const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/connect", label: "Connect" },
  { href: "/act", label: "Act" },
  { href: "/about", label: "About" },
  { href: "/donate", label: "Donate" },
] as const;

/** Shown in the full-screen mobile menu, with a one-line descriptor. */
export const menuLinks = [
  { href: "/learn", label: "Learn", note: "Information you can trust" },
  { href: "/connect", label: "Connect", note: "People who understand" },
  { href: "/act", label: "Act", note: "Push for better care" },
  { href: "/about", label: "About", note: "Why we exist" },
] as const;
