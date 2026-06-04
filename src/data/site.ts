export const site = {
  name: "Neo Automation",
  legalName: "Neo Automation Pvt. Ltd.",
  tagline: "Engineering Tomorrow's Industry",
  description:
    "Premium automation solutions, precision industrial tools and authorised distribution for the world's leading manufacturing brands.",
  phone: "+91 74051 71037",
  email: "info@neoautomation.com",
  whatsapp: "917405171037",
  address: {
    line1: "STC (Shivam Trade Center) 812, Ambli",
    line2: "SP Ring Road, Ahmedabad, 380058",
    city: "Ahmedabad",
    country: "India",
  },
  // Ahmedabad coordinates for the map
  map: {
    lat: 23.0225,
    lng: 72.5714,
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0!2d72.5714!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzIxLjAiTiA3MsKwMzQnMTcuMCJF!5e0!3m2!1sen!2sin!4v1700000000000",
  },
  social: {
    linkedin: "#",
    instagram: "#",
    youtube: "#",
    twitter: "#",
  },
  stats: [
    { value: 18, suffix: "+", label: "Years of Engineering" },
    { value: 6, suffix: "", label: "Global Brand Partners" },
    { value: 1200, suffix: "+", label: "Installations Delivered" },
    { value: 99.2, suffix: "%", label: "Uptime Reliability" },
  ],
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; desc?: string }[];
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/products",
  },
  { label: "Industries", href: "/industries" },
  { label: "SWF", href: "/swf" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
