export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Tours", href: "/#tours" },
  { label: "Destinations", href: "/#destinations" },
  { label: "About Ethiopia", href: "/#about-ethiopia" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
] as const;

export const TOUR_001_SLUG = "tour-001";

export const ORGANIZER_CONTACT = {
  name: "AS Tour & Travel",
  address: "Bole Road, Addis Ababa, Ethiopia",
  phone: "+251 11 123 4567",
  phoneHref: "tel:+251111234567",
  email: "hello@astourtravel.com",
  emailHref: "mailto:hello@astourtravel.com",
  hours: "Mon – Sat, 8:00 AM – 6:00 PM (EAT)",
} as const;
