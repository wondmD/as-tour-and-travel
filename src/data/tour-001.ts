import { ethiopiaImages as img, unsplash } from "@/lib/images";

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
  destinations: Destination[];
}

export const tour001: Tour = {
  id: "001",
  slug: "tour-001",
  title: "Tour 001 — The Grand Ethiopian Experience",
  subtitle: "A five-day journey through Ethiopia's cultural heartlands and natural wonders",
  status: "Upcoming",
  duration: "5 Days / 4 Nights",
  destinationCount: 5,
  departureDate: "March 15, 2026",
  availableSeats: 12,
  totalSeats: 20,
  startingPrice: 2890,
  currency: "USD",
  groupSize: "8–20 travelers",
  coverImage: img.tourCover,
  summary:
    "Embark on an unforgettable journey from the vibrant capital of Addis Ababa through ancient highlands, serene lakeside retreats, the dramatic Rift Valley, and the legendary walled city of Harar. This curated experience blends luxury accommodations, expert local guides, and authentic cultural immersion.",
  includedServices: [
    "Professional English-speaking guide throughout",
    "All ground transportation in comfortable 4x4 vehicles",
    "4-star and boutique hotel accommodations",
    "Daily breakfast and select traditional meals",
    "All entrance fees to museums and heritage sites",
    "Airport transfers and porterage",
    "Bottled water during travel days",
    "24/7 emergency support",
  ],
  destinations: [
    {
      id: "sheraton-addis",
      day: 1,
      name: "Sheraton Addis",
      region: "Addis Ababa",
      address: "Taitu Street, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0192, lng: 38.7525 },
      mapPosition: { x: 42, y: 55 },
      heroImage: img.addisAbaba.hero,
      thumbnail: img.addisAbaba.thumb,
      introduction:
        "Begin your Ethiopian adventure at the iconic Sheraton Addis, a landmark of elegance nestled in the heart of the capital. This world-class hotel serves as your gateway to one of Africa's most fascinating cities.",
      history:
        "Addis Ababa, meaning 'New Flower' in Amharic, was founded in 1886 by Emperor Menelik II. The Sheraton Addis, opened in 1998, stands as a symbol of Ethiopia's modern renaissance while honoring centuries of imperial heritage.",
      whyIncluded:
        "Starting at Sheraton Addis allows for a gentle acclimatization to Ethiopia's altitude (2,355m) while enjoying premium comfort. The hotel's central location provides easy access to the National Museum, Merkato market, and the city's vibrant culinary scene.",
      activities: [
        {
          title: "Welcome Ceremony",
          description:
            "Traditional coffee ceremony with freshly roasted Ethiopian beans and injera tasting.",
          icon: "coffee",
        },
        {
          title: "National Museum Visit",
          description:
            "See Lucy, the 3.2-million-year-old hominid fossil that redefined human history.",
          icon: "museum",
        },
        {
          title: "City Orientation",
          description:
            "Guided evening walk through Piazza district's Art Deco architecture.",
          icon: "walk",
        },
        {
          title: "Traditional Cuisine",
          description:
            "Welcome dinner featuring doro wat, kitfo, and tej honey wine.",
          icon: "utensils",
        },
      ],
      gallery: [
        img.addisAbaba.skyline,
        img.addisAbaba.street,
        img.addisAbaba.night,
        img.addisAbaba.coffee,
      ],
      videos: [
        {
          title: "Addis Ababa City Highlights",
          thumbnail: unsplash("1714041123574-6367e4f8f59d", 600),
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ],
      schedule: {
        arrival: "2:00 PM — Hotel check-in & welcome refreshments",
        activities: [
          "3:30 PM — Coffee ceremony and briefing",
          "5:00 PM — National Museum guided tour",
          "7:30 PM — Welcome dinner at hotel restaurant",
        ],
        departure: "Next morning after breakfast",
        duration: "Approx. 6 hours of activities",
      },
      highlights: [
        {
          title: "Lucy at the National Museum",
          description:
            "Stand face-to-face with the world's most famous early human ancestor.",
        },
        {
          title: "Ethiopian Coffee Culture",
          description:
            "Experience the birthplace of coffee through an authentic ceremony.",
        },
        {
          title: "Altitude Acclimatization",
          description:
            "Gentle first day designed for comfortable adjustment to highland elevation.",
        },
      ],
    },
    {
      id: "entoto",
      day: 2,
      name: "Entoto",
      region: "Addis Ababa Highlands",
      address: "Mount Entoto, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0917, lng: 38.7467 },
      mapPosition: { x: 44, y: 48 },
      heroImage: img.entoto.hero,
      thumbnail: img.entoto.thumb,
      introduction:
        "Ascend to the misty highlands of Mount Entoto, where eucalyptus forests meet panoramic views of the capital below. This sacred mountain was the original site of Addis Ababa and remains a spiritual sanctuary.",
      history:
        "Emperor Menelik II established his first palace on Entoto in the 1880s before moving the capital to its current location. The Entoto Maryam Church, built in 1877, still crowns the summit and draws pilgrims year-round.",
      whyIncluded:
        "Entoto offers a breathtaking transition from urban sophistication to Ethiopia's natural highland beauty. The mountain's eucalyptus groves, historic churches, and sweeping vistas provide the perfect introduction to Ethiopia's dramatic landscapes.",
      activities: [
        {
          title: "Highland Hiking",
          description:
            "Guided trek through eucalyptus forests to panoramic viewpoints at 3,200m.",
          icon: "hiking",
        },
        {
          title: "Entoto Maryam Church",
          description:
            "Visit the historic church where Emperor Menelik II once worshipped.",
          icon: "church",
        },
        {
          title: "Photography",
          description:
            "Capture stunning views of Addis Ababa sprawling across the valley below.",
          icon: "camera",
        },
        {
          title: "Local Craft Workshop",
          description:
            "Watch artisans create traditional Ethiopian crosses and textiles.",
          icon: "palette",
        },
      ],
      gallery: [
        img.entoto.highlands,
        img.entoto.mountains,
        img.entoto.viewpoint,
        img.simien,
      ],
      videos: [
        {
          title: "Entoto Mountain Experience",
          thumbnail: unsplash("1572888195250-3037a59d3578", 600),
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ],
      schedule: {
        arrival: "8:00 AM — Depart Sheraton Addis",
        activities: [
          "9:00 AM — Entoto Maryam Church visit",
          "10:30 AM — Highland forest hike",
          "12:30 PM — Picnic lunch with valley views",
          "2:00 PM — Artisan workshop visit",
          "4:00 PM — Return to hotel",
        ],
        departure: "4:30 PM — Return to Sheraton Addis",
        duration: "Full day excursion (8 hours)",
      },
      highlights: [
        {
          title: "Panoramic Capital Views",
          description:
            "Witness Addis Ababa from 3,200 meters — a photographer's dream.",
        },
        {
          title: "Imperial Heritage",
          description:
            "Walk in the footsteps of Emperor Menelik II at his original capital site.",
        },
        {
          title: "Eucalyptus Forest Trails",
          description:
            "Breathe the crisp highland air on serene forest paths.",
        },
      ],
    },
    {
      id: "kuriftu-resort",
      day: 3,
      name: "Kuriftu Resort",
      region: "Bishoftu (Debre Zeit)",
      address: "Lake Bishoftu, Bishoftu, Ethiopia",
      coordinates: { lat: 8.75, lng: 38.98 },
      mapPosition: { x: 48, y: 62 },
      heroImage: img.kuriftu.hero,
      thumbnail: img.kuriftu.thumb,
      introduction:
        "Escape to the tranquil shores of Lake Bishoftu at Kuriftu Resort, where crater lakes and lush gardens create an oasis of relaxation just an hour from the capital.",
      history:
        "The Bishoftu area is home to five crater lakes formed by ancient volcanic activity. Kuriftu Resort has transformed this natural wonder into Ethiopia's premier lakeside retreat, blending eco-luxury with local craftsmanship.",
      whyIncluded:
        "After the highland adventure, Kuriftu provides a restorative interlude. The resort's spa, lake activities, and serene environment offer the perfect balance between exploration and relaxation on your journey south.",
      activities: [
        {
          title: "Lake Kayaking",
          description:
            "Paddle across crystal-clear crater lake waters surrounded by volcanic cliffs.",
          icon: "kayak",
        },
        {
          title: "Spa & Wellness",
          description:
            "Rejuvenate with traditional Ethiopian spa treatments using local ingredients.",
          icon: "spa",
        },
        {
          title: "Bird Watching",
          description:
            "Spot endemic species including the African fish eagle and pelicans.",
          icon: "bird",
        },
        {
          title: "Sunset Dining",
          description:
            "Lakeside dinner featuring fresh tilapia and local organic produce.",
          icon: "utensils",
        },
      ],
      gallery: [
        img.kuriftu.lake,
        img.kuriftu.craterLake,
        img.kuriftu.cityLake,
        img.blueNile,
      ],
      videos: [
        {
          title: "Kuriftu Lakeside Retreat",
          thumbnail: unsplash("1680465808058-b738aeb01046", 600),
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ],
      schedule: {
        arrival: "9:00 AM — Check-in at Kuriftu Resort",
        activities: [
          "10:00 AM — Lake kayaking adventure",
          "12:00 PM — Lakeside lunch",
          "2:00 PM — Spa treatment (optional)",
          "4:00 PM — Nature walk around crater rim",
          "7:00 PM — Sunset dinner by the lake",
        ],
        departure: "Next morning after breakfast",
        duration: "Overnight stay with full day activities",
      },
      highlights: [
        {
          title: "Volcanic Crater Lakes",
          description:
            "Swim and kayak in ancient volcanic lakes of extraordinary clarity.",
        },
        {
          title: "Eco-Luxury Retreat",
          description:
            "Experience Ethiopia's finest lakeside accommodation in harmony with nature.",
        },
        {
          title: "Wellness Interlude",
          description:
            "Recharge body and spirit before the adventure continues south.",
        },
      ],
    },
    {
      id: "arba-minch",
      day: 4,
      name: "Arba Minch",
      region: "Southern Nations",
      address: "Arba Minch, SNNPR, Ethiopia",
      coordinates: { lat: 6.0333, lng: 37.55 },
      mapPosition: { x: 46, y: 78 },
      heroImage: img.arbaMinch.hero,
      thumbnail: img.arbaMinch.thumb,
      introduction:
        "Discover Arba Minch, the 'Forty Springs' city perched between two Rift Valley lakes and the gateway to some of Africa's most diverse ecosystems, including Nechisar National Park.",
      history:
        "Arba Minch has been inhabited for millennia, serving as a crossroads for diverse ethnic groups including the Gamo, Gofa, and Wolayta peoples. The nearby Konso Cultural Landscape is a UNESCO World Heritage Site celebrating terraced agriculture dating back 400 years.",
      whyIncluded:
        "Arba Minch showcases Ethiopia's incredible biodiversity — from crocodile-filled lakes to acacia woodlands teeming with wildlife. It's a dramatic shift from highland culture to the warm, lush landscapes of the Great Rift Valley.",
      activities: [
        {
          title: "Nechisar National Park",
          description:
            "Safari drive through savanna home to zebras, gazelles, and endemic birds.",
          icon: "wildlife",
        },
        {
          title: "Lake Chamo Boat Trip",
          description:
            "Cruise alongside giant Nile crocodiles and hippo pods in their natural habitat.",
          icon: "boat",
        },
        {
          title: "Dorze Village Visit",
          description:
            "Meet the Dorze people and see their remarkable woven bamboo houses.",
          icon: "culture",
        },
        {
          title: "Crocodile Market",
          description:
            "Witness the famous 'crocodile market' where reptiles bask on Lake Chamo's shores.",
          icon: "camera",
        },
      ],
      gallery: [
        img.arbaMinch.omoTribe,
        img.arbaMinch.village,
        img.arbaMinch.camels,
        img.arbaMinch.portrait,
      ],
      videos: [
        {
          title: "Arba Minch Wildlife Safari",
          thumbnail: unsplash("1530313292289-fa316f332666", 600),
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ],
      schedule: {
        arrival: "10:00 AM — Arrive via scenic flight from Addis Ababa",
        activities: [
          "11:00 AM — Nechisar National Park safari",
          "1:00 PM — Traditional lunch in the park",
          "3:00 PM — Lake Chamo crocodile boat cruise",
          "5:00 PM — Dorze village cultural visit",
          "7:30 PM — Dinner at lakeside lodge",
        ],
        departure: "Next morning after breakfast",
        duration: "Overnight stay with full day safari",
      },
      highlights: [
        {
          title: "Nile Crocodile Encounters",
          description:
            "See some of Africa's largest crocodiles basking on Lake Chamo's shores.",
        },
        {
          title: "Rift Valley Safari",
          description:
            "Spot zebras, antelopes, and over 300 bird species in Nechisar Park.",
        },
        {
          title: "Dorze Cultural Heritage",
          description:
            "Explore unique woven architecture and centuries-old weaving traditions.",
        },
      ],
    },
    {
      id: "harar",
      day: 5,
      name: "Harar",
      region: "Harari Region",
      address: "Harar Jugol, Harar, Ethiopia",
      coordinates: { lat: 9.3133, lng: 42.1167 },
      mapPosition: { x: 72, y: 52 },
      heroImage: img.harar.hero,
      thumbnail: img.harar.thumb,
      introduction:
        "Conclude your journey in the legendary walled city of Harar — Islam's fourth holiest city and a UNESCO World Heritage Site where ancient traditions thrive within vibrant painted walls.",
      history:
        "Harar Jugol has been a center of Islamic learning since the 10th century. Its 82 mosques, 102 shrines, and unique Harari architecture earned UNESCO recognition in 2006. The city was a major trade hub connecting Africa, Arabia, and Asia.",
      whyIncluded:
        "Harar provides a powerful finale to the tour — a completely different cultural world from the highlands and Rift Valley. The famous hyena feeding ritual, colorful markets, and labyrinthine alleys create an unforgettable closing chapter.",
      activities: [
        {
          title: "Jugol Old City Tour",
          description:
            "Walk the narrow alleys of the walled city with a local Harari guide.",
          icon: "walk",
        },
        {
          title: "Hyena Feeding Ceremony",
          description:
            "Witness the centuries-old tradition of feeding wild hyenas by hand.",
          icon: "wildlife",
        },
        {
          title: "Traditional Coffee Houses",
          description:
            "Visit historic coffee houses where Harari social life has flourished for generations.",
          icon: "coffee",
        },
        {
          title: "Arthur Rimbaud Museum",
          description:
            "Explore the home of the French poet who lived in Harar during the 1880s.",
          icon: "museum",
        },
      ],
      gallery: [
        img.harar.spiceMarket,
        img.harar.market,
        img.harar.alley,
        img.harar.street,
      ],
      videos: [
        {
          title: "Harar — City of Saints",
          thumbnail: unsplash("1572851569977-e18b9ea6edbe", 600),
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ],
      schedule: {
        arrival: "9:00 AM — Morning flight from Arba Minch",
        activities: [
          "10:30 AM — Jugol walled city walking tour",
          "12:30 PM — Traditional Harari lunch",
          "2:00 PM — Arthur Rimbaud Museum",
          "4:00 PM — Spice market exploration",
          "6:00 PM — Hyena feeding ceremony",
          "8:00 PM — Farewell dinner celebration",
        ],
        departure: "Tour concludes — optional extensions available",
        duration: "Full final day with farewell dinner",
      },
      highlights: [
        {
          title: "UNESCO World Heritage City",
          description:
            "Explore one of Africa's most intact historic Islamic cities.",
        },
        {
          title: "Hyena Feeding Ritual",
          description:
            "Experience a tradition found nowhere else on Earth.",
        },
        {
          title: "Farewell Celebration",
          description:
            "Close your journey with a festive dinner and cultural performances.",
        },
      ],
    },
  ],
};
