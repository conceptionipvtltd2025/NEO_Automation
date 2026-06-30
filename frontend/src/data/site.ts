export const site = {
  name: "Neo Automation",
  legalName: "Neo Automation Pvt. Ltd.",
  tagline: "Engineering Tomorrow's Industry",
  description:
    "Premium automation solutions, precision industrial tools and authorised distribution for the world's leading manufacturing brands.",
  phone: "+91 98987 97004",
  phoneDial: "+919898797004",
  email: "marketing@neoautomation.in",
  whatsapp: "919662501422",
  whatsappDisplay: "+91 96625 01422",
  hours: {
    days: "Monday to Saturday",
    time: "9:30 AM – 6:30 PM",
    short: "Mon–Sat · 9:30 AM – 6:30 PM",
  },
  address: {
    line1: "13, Jahnavi Industrial Estate, Opp. Madhav Avenue,",
    line2: "S.P. Ring Road, Odhav, Ahmedabad – 382415, Gujarat, India",
    city: "Ahmedabad",
    country: "India",
  },
  // Odhav, Ahmedabad — coordinates for the map
  map: {
    lat: 23.0314,
    lng: 72.673,
    query:
      "13 Jahnavi Industrial Estate, Opp Madhav Avenue, S.P. Ring Road, Odhav, Ahmedabad 382415",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/neo-automation-64a619147",
    instagram: "https://www.instagram.com/neoautomation13/",
    twitter: "https://x.com/AutomationNeo",
    facebook: "https://www.facebook.com/profile.php?id=100017663492207",
  },
  stats: [
    { value: 19, suffix: "+", label: "Years of Engineering" },
    { value: 9, suffix: "", label: "Global Brand Partners" },
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
  { label: "NSW", href: "/nsw" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
