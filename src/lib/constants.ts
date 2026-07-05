export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Tours", href: "/#tours" },
  { label: "Destinations", href: "/#destinations" },
  { label: "About Ethiopia", href: "/#about-ethiopia" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
] as const;

export const TOUR_001_SLUG = "tour-001";

export const AS_TOUR = {
  name: "AS Tour & Travel",
  shortName: "AS Tour",
} as const;

export const SISTER_COMPANY = {
  nameEn: "Sekina Company",
  nameAr: "شركة السكينة",
  officeEn: "Import Export · Business Office",
  officeAr: "مكتب للإستيراد و التصدير",
  logo: "/sekina-logo.png",
  relationship: "Sister company of AS Tour & Travel",
} as const;

export const JOINT_TOUR_ORGANIZERS = {
  label: "Jointly organized by",
  description:
    "This tour is jointly organized by AS Tour & Travel and Sekina Company, our sister import–export business office.",
  descriptionAr:
    "تنظم هذه الرحلة بالتعاون بين AS Tour & Travel وشركة السكينة للإستيراد والتصدير، شركتنا الشقيقة.",
} as const;

export const ORGANIZER_CONTACT = {
  name: `${AS_TOUR.name} & ${SISTER_COMPANY.nameEn}`,
  phone: "+966509357925",
  phoneHref: "tel:+966509357925",
  email: "Sekina.fedill@yahoo.com",
  emailHref: "mailto:Sekina.fedill@yahoo.com",
  hours: "Mon – Sat, 8:00 AM – 6:00 PM (EAT)",
} as const;
