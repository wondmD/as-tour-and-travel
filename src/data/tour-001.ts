import { tourImages as t } from "@/lib/images";

export interface Activity {
  title: string;
  description: string;
  icon: string;
}

export interface Video {
  title: string;
  thumbnail: string;
  url: string;
}

export interface Highlight {
  title: string;
  description: string;
}

export interface Schedule {
  arrival: string;
  activities: string[];
  departure: string;
  duration: string;
}

export interface Destination {
  id: string;
  day: number;
  name: string;
  region: string;
  address: string;
  coordinates: { lat: number; lng: number };
  mapPosition: { x: number; y: number };
  heroImage: string;
  thumbnail: string;
  introduction: string;
  history: string;
  whyIncluded: string;
  activities: Activity[];
  gallery: string[];
  videos: Video[];
  schedule: Schedule;
  highlights: Highlight[];
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  duration: string;
  destinationCount: number;
  departureDate: string;
  availableSeats: number;
  totalSeats: number;
  startingPrice: number;
  currency: string;
  groupSize: string;
  coverImage: string;
  summary: string;
  includedServices: string[];
  excludedServices: string[];
  destinations: Destination[];
}

export const tour001: Tour = {
  id: "001",
  slug: "tour-001",
  title: "10 Days Leisure Tour — Addis, Surroundings & Arba Minch",
  subtitle:
    "A relaxed ten-day journey through Addis Ababa, the highlands, crater lakes, and southern Ethiopia",
  status: "Upcoming",
  duration: "10 Days / 9 Nights",
  destinationCount: 10,
  departureDate: "March 15, 2026",
  availableSeats: 12,
  totalSeats: 20,
  startingPrice: 2890,
  currency: "USD",
  groupSize: "8–20 travelers",
  coverImage: t.cover,
  summary:
    "Discover Ethiopia at an unhurried pace — from Addis Ababa's museums and coffee culture to Entoto's mountain air, Bishoftu's crater lakes, the spectacular Wonchi highlands, and Arba Minch's Dorze villages, Lake Chamo wildlife, and Forty Springs. Comfortable hotels, expert guides, and flexible leisure time throughout.",
  includedServices: [
    "Accommodation based on shared room",
    "Early check-in on the first day",
    "All breakfasts and dinners",
    "Round-trip flights between Addis Ababa and Arba Minch (when using Ethiopian Airlines for international flights; $80 fare difference applies for other carriers)",
    "Local guides and Arabic-speaking escort guide",
    "Boat safari on Lake Chamo",
    "Scout services",
    "Dorze village cultural experience",
    "All entrance fees except optional activities",
    "Ground transfers by 2 coaster buses",
    "Bottled water while in vehicle",
    "Fuel, road tax, and driver allowance",
    "Guide flights and government tax",
  ],
  excludedServices: [
    "All lunches",
    "Single room supplement ($1,200 per person on request)",
    "Optional activities and their payments",
    "Tips and personal expenses",
    "Anything not listed in the included section",
  ],
  destinations: [
    {
      id: "addis-arrival",
      day: 1,
      name: "Addis Ababa — Capital Discovery",
      region: "Addis Ababa",
      address: "Addis Ababa Bole International Airport & city centre, Ethiopia",
      coordinates: { lat: 9.0192, lng: 38.7525 },
      mapPosition: { x: 42, y: 55 },
      heroImage: t.day1.cover,
      thumbnail: t.day1.cover,
      introduction:
        "Welcome to Ethiopia! Upon arrival at Addis Ababa Bole International Airport, your guide meets you and transfers you to the Skylight Hotel for check-in. After time to relax, enjoy an afternoon city tour introducing you to the capital's heritage and coffee culture.",
      history:
        "Addis Ababa — 'New Flower' in Amharic — was founded in 1886 and is Africa's diplomatic capital. The National Museum preserves Lucy, one of the world's most significant hominid fossils, while Unity Park within the National Palace grounds showcases Ethiopia's living heritage.",
      whyIncluded:
        "A gentle first day with airport transfer, hotel check-in, and curated city highlights sets the tone for a leisure-paced tour — combining archaeology, culture, and Ethiopia's world-famous coffee tradition.",
      activities: [
        {
          title: "National Museum of Ethiopia",
          description: "See the fossil remains of Lucy (Australopithecus afarensis).",
          icon: "museum",
        },
        {
          title: "Unity Park",
          description:
            "Explore gardens, museums, and cultural exhibits within the National Palace grounds with panoramic city views.",
          icon: "walk",
        },
        {
          title: "Tomoca Coffee",
          description:
            "Experience one of Addis Ababa's oldest and most iconic coffee houses.",
          icon: "coffee",
        },
      ],
      gallery: [...t.day1.gallery],
      videos: [],
      schedule: {
        arrival: "Arrival at Bole International Airport — meet & greet, transfer to hotel",
        activities: [
          "Afternoon — National Museum of Ethiopia (Lucy exhibit)",
          "Late afternoon — Unity Park at the National Palace",
          "End of day — Tomoca Coffee experience",
        ],
        departure: "Overnight at Skylight Hotel",
        duration: "Half-day city introduction after arrival",
      },
      highlights: [
        {
          title: "Lucy at the National Museum",
          description: "One of the world's most important archaeological discoveries.",
        },
        {
          title: "Unity Park",
          description: "Landscaped gardens and exhibits within historic palace grounds.",
        },
        {
          title: "Skylight Hotel",
          description: "Overnight at ethiopianskylighthotel.com",
        },
      ],
    },
    {
      id: "addis-museums-entoto",
      day: 2,
      name: "Museums & Entoto Highlands",
      region: "Addis Ababa → Entoto",
      address: "Entoto Natural Park, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0917, lng: 38.7467 },
      mapPosition: { x: 44, y: 48 },
      heroImage: t.day2.cover,
      thumbnail: t.day2.cover,
      introduction:
        "After a leisurely breakfast, explore two of Addis Ababa's finest museums before driving to the cool highlands of Entoto Natural Park. Check into your luxury safari-style tent surrounded by indigenous forest.",
      history:
        "The Ethnological Museum occupies Emperor Haile Selassie's former palace at Addis Ababa University. The Al Habesha Museum highlights centuries of Islam in Ethiopia and peaceful coexistence between faith communities. Entoto was the original site of the capital under Emperor Menelik II.",
      whyIncluded:
        "This day balances urban cultural depth with a serene highland escape — ideal for a leisure tour that never feels rushed.",
      activities: [
        {
          title: "Ethnological Museum",
          description:
            "Explore Ethiopia's diverse cultures and traditions in the former imperial palace.",
          icon: "museum",
        },
        {
          title: "Al Habesha Museum",
          description:
            "Interactive exhibits on the long history of Islam in Ethiopia.",
          icon: "culture",
        },
        {
          title: "Entoto Natural Park",
          description:
            "Check in to Kuriftu Entoto Luxury Tented Camp overlooking the capital.",
          icon: "hiking",
        },
      ],
      gallery: [...t.day2.gallery],
      videos: [],
      schedule: {
        arrival: "Morning — leisurely breakfast in Addis Ababa",
        activities: [
          "Morning — Ethnological Museum",
          "Midday — Al Habesha Museum",
          "Late afternoon — drive to Entoto Natural Park",
          "Evening — check-in at Kuriftu Entoto Luxury Tented Camp",
        ],
        departure: "Overnight at Kuriftu Entoto (kurifturesorts.com)",
        duration: "Full day — museums and highland transfer",
      },
      highlights: [
        {
          title: "Imperial Palace Museum",
          description: "Ethnological collections in Haile Selassie's former residence.",
        },
        {
          title: "Al Habesha Museum",
          description: "A modern perspective on Ethiopia's Islamic heritage.",
        },
        {
          title: "Luxury Tented Camp",
          description: "Safari-style comfort in Entoto's indigenous forest.",
        },
      ],
    },
    {
      id: "entoto-nature",
      day: 3,
      name: "Entoto Nature Day",
      region: "Entoto → Addis Ababa",
      address: "Entoto Natural Park, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0917, lng: 38.7467 },
      mapPosition: { x: 44, y: 48 },
      heroImage: t.day3.cover,
      thumbnail: t.day3.cover,
      introduction:
        "Wake to fresh mountain air and spend the morning at leisure within Entoto Natural Park. Choose from optional adventures or simply relax amid spectacular scenery before returning to Addis Ababa in the afternoon.",
      history:
        "Entoto Natural Park protects eucalyptus and indigenous forest on the highlands overlooking Addis Ababa, offering adventure activities and wellness experiences in a restored natural setting.",
      whyIncluded:
        "Built-in free time and optional activities make this a true leisure day — guests set their own pace before returning to the capital.",
      activities: [
        {
          title: "Ziplining & Rope Course",
          description: "Optional adventure activities within the park.",
          icon: "hiking",
        },
        {
          title: "Horse Riding & Mountain Biking",
          description: "Explore forest trails on horseback or by bike.",
          icon: "walk",
        },
        {
          title: "Spa & Nature Walks",
          description: "Wellness treatments (additional cost) or peaceful forest strolls.",
          icon: "spa",
        },
      ],
      gallery: [...t.day3.gallery],
      videos: [],
      schedule: {
        arrival: "Morning at leisure in Entoto Natural Park",
        activities: [
          "Optional — ziplining, archery, rope course, horse riding, or mountain biking",
          "Optional — spa and wellness (additional cost)",
          "Alternative — relax and enjoy the mountain scenery",
          "Afternoon — return to Addis Ababa",
        ],
        departure: "Overnight at Skylight Hotel",
        duration: "Leisure morning, afternoon return to Addis",
      },
      highlights: [
        {
          title: "Flexible Adventures",
          description: "Choose active options or a tranquil morning in nature.",
        },
        {
          title: "Mountain Scenery",
          description: "Panoramic views over Addis Ababa from the highlands.",
        },
        {
          title: "Return to Capital",
          description: "Afternoon transfer back to Skylight Hotel.",
        },
      ],
    },
    {
      id: "bishoftu-lakeside",
      day: 4,
      name: "Bishoftu — Lakeside Leisure",
      region: "Bishoftu (Debre Zeit)",
      address: "Lake Bishoftu, Bishoftu, Ethiopia",
      coordinates: { lat: 8.75, lng: 38.98 },
      mapPosition: { x: 48, y: 62 },
      heroImage: t.day4.cover,
      thumbnail: t.day4.cover,
      introduction:
        "After breakfast, drive approximately 45 km (about one hour) southeast to Bishoftu, famous for its chain of scenic crater lakes formed by ancient volcanic activity. Spend the day at leisure beside the lake.",
      history:
        "Bishoftu (Debre Zeit) sits in a volcanic caldera region where multiple crater lakes have drawn visitors for generations. The area is a popular weekend escape from Addis Ababa.",
      whyIncluded:
        "A classic leisure interlude — kayaking, cycling, birdwatching, or simply relaxing by the water before continuing the journey.",
      activities: [
        {
          title: "Kayaking & Cycling",
          description: "Optional lakeside activities on the crater lakes.",
          icon: "kayak",
        },
        {
          title: "Birdwatching & Nature Walks",
          description: "Spot waterbirds and enjoy peaceful lakeside trails.",
          icon: "bird",
        },
        {
          title: "Water Park (Seasonal)",
          description: "Families may enjoy the resort water park when open.",
          icon: "spa",
        },
      ],
      gallery: [...t.day4.gallery],
      videos: [],
      schedule: {
        arrival: "Morning — drive from Addis Ababa to Bishoftu (~1 hour)",
        activities: [
          "Day at leisure — kayaking, cycling, nature walks, or birdwatching",
          "Optional — resort water park (seasonal)",
          "Relaxation by the crater lakes",
        ],
        departure: "Overnight at Noora Africa Luxury Resort (nooraafrica.com)",
        duration: "Full leisure day at the lakes",
      },
      highlights: [
        {
          title: "Volcanic Crater Lakes",
          description: "Scenic lakes formed by ancient volcanic activity.",
        },
        {
          title: "Lakeside Relaxation",
          description: "Unhurried time to unwind at your chosen pace.",
        },
        {
          title: "Noora Africa Resort",
          description: "Luxury accommodation on the lakeshore.",
        },
      ],
    },
    {
      id: "bishoftu-addis",
      day: 5,
      name: "Bishoftu — Return to Addis",
      region: "Bishoftu → Addis Ababa",
      address: "Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0192, lng: 38.7525 },
      mapPosition: { x: 42, y: 55 },
      heroImage: t.day5.cover,
      thumbnail: t.day5.cover,
      introduction:
        "Enjoy a relaxed breakfast overlooking the lake before checking out and returning to Addis Ababa. The remainder of the day is free to explore independently — shopping, galleries, or dining at your leisure.",
      history:
        "Addis Ababa offers vibrant handicraft markets, contemporary art galleries, and a renowned restaurant scene reflecting Ethiopia's diverse cultures.",
      whyIncluded:
        "A free afternoon in the capital gives guests flexibility — perfect for a leisure tour with no fixed schedule every moment of the day.",
      activities: [
        {
          title: "Handicraft Shopping",
          description: "Browse traditional Ethiopian crafts and souvenirs.",
          icon: "culture",
        },
        {
          title: "Art Galleries",
          description: "Visit local galleries showcasing contemporary Ethiopian art.",
          icon: "palette",
        },
        {
          title: "Independent Dining",
          description: "Explore Addis Ababa's excellent restaurants and cafés.",
          icon: "utensils",
        },
      ],
      gallery: [...t.day5.gallery],
      videos: [],
      schedule: {
        arrival: "Morning — relaxed lakeside breakfast and checkout",
        activities: [
          "Mid-morning — return drive to Addis Ababa",
          "Afternoon & evening — free time at leisure",
          "Optional — shopping, galleries, or dining",
        ],
        departure: "Overnight at Skylight Hotel",
        duration: "Half-day transfer, free afternoon in Addis",
      },
      highlights: [
        {
          title: "Lakeside Breakfast",
          description: "A calm start before the return to the capital.",
        },
        {
          title: "Free Exploration",
          description: "Discover Addis Ababa at your own pace.",
        },
        {
          title: "Skylight Hotel",
          description: "Comfortable base in the city centre.",
        },
      ],
    },
    {
      id: "wonchi-crater",
      day: 6,
      name: "Wonchi Crater Lake",
      region: "Wonchi, Oromia",
      address: "Wonchi Crater Lake, Oromia Region, Ethiopia",
      coordinates: { lat: 8.7167, lng: 37.3167 },
      mapPosition: { x: 38, y: 58 },
      heroImage: t.day6.cover,
      thumbnail: t.day6.cover,
      introduction:
        "After breakfast, depart Addis Ababa for the scenic drive (~155 km west) to Wonchi Crater Lake — one of Ethiopia's most beautiful highland destinations, with an emerald lake, forested islands, waterfalls, and hot springs above 3,000 metres.",
      history:
        "Wonchi is a volcanic crater lake surrounded by highland forest and traditional communities. The monastery island and natural hot springs have drawn pilgrims and travellers for generations.",
      whyIncluded:
        "Wonchi offers a dramatic change of scenery — highland wilderness and optional adventures before a night at an eco-lodge overlooking the crater.",
      activities: [
        {
          title: "Guided Hiking",
          description: "Trails around the crater rim with spectacular views.",
          icon: "hiking",
        },
        {
          title: "Boat to Monastery Island",
          description: "Traditional boat ride to the island monastery.",
          icon: "boat",
        },
        {
          title: "Hot Springs & Birdwatching",
          description: "Visit natural hot springs or watch highland birdlife.",
          icon: "bird",
        },
      ],
      gallery: [...t.day6.gallery],
      videos: [],
      schedule: {
        arrival: "Morning — scenic drive from Addis Ababa to Wonchi",
        activities: [
          "Optional — horse riding to the lake",
          "Optional — guided hiking and boat ride to monastery island",
          "Optional — hot springs visit and birdwatching",
          "Evening — check-in at Wonchi Ija Eco Lodge",
        ],
        departure: "Overnight at Wonchi Ija Eco Lodge (wonchiijaecolodge.com)",
        duration: "Full day with scenic drive and optional activities",
      },
      highlights: [
        {
          title: "Emerald Crater Lake",
          description: "A stunning volcanic lake above 3,000 metres elevation.",
        },
        {
          title: "Monastery Island",
          description: "Traditional boat access to a forested island sanctuary.",
        },
        {
          title: "Eco Lodge",
          description: "Luxury lodge overlooking the crater.",
        },
      ],
    },
    {
      id: "wonchi-addis",
      day: 7,
      name: "Wonchi — Return to Addis",
      region: "Wonchi → Addis Ababa",
      address: "Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0192, lng: 38.7525 },
      mapPosition: { x: 42, y: 55 },
      heroImage: t.day7.cover,
      thumbnail: t.day7.cover,
      introduction:
        "After a leisurely morning and a final view of the spectacular crater, drive back to Addis Ababa for a free day at your leisure.",
      history:
        "Returning to Addis between highland and southern legs of the tour allows guests to rest, repack, and enjoy the capital before flying south.",
      whyIncluded:
        "A buffer day in Addis keeps the pace relaxed and prepares guests for the Arba Minch extension.",
      activities: [
        {
          title: "Leisure Morning at Wonchi",
          description: "Final views and optional short walks before departure.",
          icon: "camera",
        },
        {
          title: "Scenic Return Drive",
          description: "Comfortable transfer back to Addis Ababa.",
          icon: "walk",
        },
        {
          title: "Free Day in Addis",
          description: "Unstructured time to rest or explore the city.",
          icon: "coffee",
        },
      ],
      gallery: [...t.day7.gallery],
      videos: [],
      schedule: {
        arrival: "Leisurely morning at Wonchi Ija Eco Lodge",
        activities: [
          "Morning — final crater views and checkout",
          "Midday — drive back to Addis Ababa",
          "Afternoon & evening — free day at leisure",
        ],
        departure: "Overnight at Skylight Hotel",
        duration: "Morning at Wonchi, afternoon free in Addis",
      },
      highlights: [
        {
          title: "Crater Farewell",
          description: "One last look at Wonchi's magnificent scenery.",
        },
        {
          title: "Rest Day",
          description: "Free time in Addis before the southern leg.",
        },
        {
          title: "Skylight Hotel",
          description: "Overnight in the capital.",
        },
      ],
    },
    {
      id: "arba-minch-dorze",
      day: 8,
      name: "Arba Minch & Dorze Village",
      region: "Arba Minch, SNNPR",
      address: "Arba Minch, Southern Nations, Ethiopia",
      coordinates: { lat: 6.0333, lng: 37.55 },
      mapPosition: { x: 46, y: 78 },
      heroImage: t.day8.cover,
      thumbnail: t.day8.cover,
      introduction:
        "Fly from Addis Ababa to Arba Minch, gateway to southern Ethiopia's lakes and cultures. In the afternoon, visit a traditional Dorze village in the Gughe Highlands — renowned for bamboo houses, woven textiles, and vibrant music and dance.",
      history:
        "Arba Minch lies between Lake Abaya and Lake Chamo in the Rift Valley. The Dorze people are famous for their towering beehive-shaped bamboo dwellings and skilled weaving traditions.",
      whyIncluded:
        "Flying south saves travel time while the Dorze visit offers an authentic cultural highlight of the leisure tour.",
      activities: [
        {
          title: "Flight to Arba Minch",
          description: "Scenic flight from Addis Ababa to southern Ethiopia.",
          icon: "walk",
        },
        {
          title: "Dorze Village Visit",
          description:
            "Learn about traditional life, watch artisans, and enjoy music and dance.",
          icon: "culture",
        },
        {
          title: "Gughe Highlands",
          description: "Explore the lush highlands above Arba Minch.",
          icon: "hiking",
        },
      ],
      gallery: [...t.day8.gallery],
      videos: [],
      schedule: {
        arrival: "Morning — flight from Addis Ababa to Arba Minch",
        activities: [
          "Midday — transfer and hotel check-in at Haile Resort",
          "Afternoon — Dorze village in the Gughe Highlands",
          "Evening — traditional music and dance performance",
        ],
        departure: "Overnight at Haile Resort Arba Minch (hailehotelsandresorts.com)",
        duration: "Full day — flight and cultural excursion",
      },
      highlights: [
        {
          title: "Dorze Architecture",
          description: "Remarkable bamboo-and-thatch houses and weaving traditions.",
        },
        {
          title: "Rift Valley Gateway",
          description: "Arba Minch between two great lakes and highland forests.",
        },
        {
          title: "Haile Resort",
          description: "Comfortable lakeside resort with panoramic views.",
        },
      ],
    },
    {
      id: "arba-minch-chamo",
      day: 9,
      name: "Lake Chamo & Forty Springs",
      region: "Arba Minch",
      address: "Lake Chamo & Nech Sar, Arba Minch, Ethiopia",
      coordinates: { lat: 5.98, lng: 37.57 },
      mapPosition: { x: 46, y: 80 },
      heroImage: t.day9.cover,
      thumbnail: t.day9.cover,
      introduction:
        "After breakfast, cruise Lake Chamo on a boat safari — Nile crocodiles, hippos, and abundant birdlife — then visit the famous Forty Springs that gave Arba Minch its name.",
      history:
        "Lake Chamo is part of the Great Rift Valley lake system. The Forty Springs groundwater forest supports monkeys, birds, and the natural water sources that define the region.",
      whyIncluded:
        "Wildlife on the lake and a shaded forest walk balance culture with nature on this penultimate leisure day.",
      activities: [
        {
          title: "Lake Chamo Boat Safari",
          description:
            "Search for crocodiles, hippos, fish eagles, pelicans, and herons.",
          icon: "boat",
        },
        {
          title: "Forty Springs Walk",
          description:
            "Leisurely walk through groundwater forest — monkeys and birdlife.",
          icon: "bird",
        },
        {
          title: "Resort Leisure",
          description: "Relax at Haile Resort with panoramic landscape views.",
          icon: "spa",
        },
      ],
      gallery: [...t.day9.gallery],
      videos: [],
      schedule: {
        arrival: "Morning — breakfast at Haile Resort",
        activities: [
          "Morning — Lake Chamo boat safari",
          "Midday — visit Forty Springs groundwater forest",
          "Afternoon — free time at the resort",
        ],
        departure: "Overnight at Haile Resort Arba Minch",
        duration: "Full day — safari and nature walk",
      },
      highlights: [
        {
          title: "Nile Crocodiles & Hippos",
          description: "Close encounters from a safe boat on Lake Chamo.",
        },
        {
          title: "Forty Springs",
          description: "Shaded forest walk at the springs that name the city.",
        },
        {
          title: "Birdlife",
          description: "Fish eagles, pelicans, herons, and kingfishers.",
        },
      ],
    },
    {
      id: "departure",
      day: 10,
      name: "Departure Day",
      region: "Arba Minch → Addis Ababa",
      address: "Addis Ababa Bole International Airport, Ethiopia",
      coordinates: { lat: 9.0192, lng: 38.7525 },
      mapPosition: { x: 42, y: 55 },
      heroImage: t.day10.cover,
      thumbnail: t.day10.thumb,
      introduction:
        "Enjoy a leisurely breakfast and free time at the resort before your flight back to Addis Ababa. If time permits before your international departure, browse craft shops or enjoy a final Ethiopian coffee before transfer to Bole International Airport.",
      history:
        "Addis Ababa Bole International Airport is Ethiopia's main gateway, with growing connections across Africa, the Middle East, and beyond.",
      whyIncluded:
        "A calm final morning and structured airport transfer ensure a smooth end to your ten-day leisure journey.",
      activities: [
        {
          title: "Resort Leisure Morning",
          description: "Relaxed breakfast and free time before checkout.",
          icon: "coffee",
        },
        {
          title: "Flight to Addis Ababa",
          description: "Transfer to Arba Minch Airport for your domestic flight.",
          icon: "walk",
        },
        {
          title: "International Departure",
          description: "Optional shopping or coffee before airport transfer.",
          icon: "utensils",
        },
      ],
      gallery: [...t.day10.gallery],
      videos: [],
      schedule: {
        arrival: "Leisurely breakfast at Haile Resort",
        activities: [
          "Morning — free time at the resort",
          "Midday — transfer to Arba Minch Airport",
          "Afternoon — flight to Addis Ababa",
          "Optional — craft shops or final coffee if time permits",
        ],
        departure: "Transfer to Bole International Airport — overnight not included",
        duration: "Departure day — no overnight included",
      },
      highlights: [
        {
          title: "Relaxed Farewell",
          description: "Unhurried final morning at the resort.",
        },
        {
          title: "Domestic Flight",
          description: "Return flight from Arba Minch to Addis Ababa included.",
        },
        {
          title: "Airport Transfer",
          description: "Assistance to Bole International for onward travel.",
        },
      ],
    },
  ],
};
