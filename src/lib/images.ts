/** Local stock photos — downloaded from Unsplash, served from /public/images/stock */

const stock = (filename: string) => `/images/stock/${filename}`;

/** Local tour photos — public/images/day1 … day9 */
export const tourImages = {
  cover: "/images/day1/day1-cover.webp",
  day1: {
    cover: "/images/day1/day1-cover.webp",
    gallery: [
      "/images/day1/national-museum.jpg",
      "/images/day1/unitypark-photo.jpg",
      "/images/day1/lucy.jpg",
      "/images/day1/addis-abeba-city.jpg",
    ],
  },
  day2: {
    cover: "/images/day2/day2-cover.jpg",
    gallery: [
      "/images/day2/Ethnological-Museum.jpg",
      "/images/day2/musuem.jpg",
      "/images/day2/entoto-park.jpg",
      "/images/day2/luxury-tented-camp-kiriftu.jpg",
    ],
  },
  day3: {
    cover: "/images/day3/day3-cover.jpg",
    gallery: [
      "/images/day3/ziplining.jpg",
      "/images/day3/rope-adventure.jpg",
      "/images/day3/horse-rifing.jpg",
      "/images/day3/mountain-biking.jpg",
    ],
  },
  day4: {
    cover: "/images/day4/day4-cover.jpg",
    gallery: [
      "/images/day4/lake.jpg",
      "/images/day4/bird-watching.jpg",
      "/images/day4/water-park.jpg",
      "/images/day4/noora-resort.jpg",
    ],
  },
  day5: {
    cover: "/images/day5/day5-cover.jpg",
    gallery: [
      "/images/day5/art-galery.jpg",
      "/images/day5/hand-made1.jpg",
      "/images/day5/hand-made2.jpg",
      "/images/day5/day5-cover.jpg",
    ],
  },
  day6: {
    cover: "/images/day6/day6-cover.jpg",
    gallery: [
      "/images/day6/hicking.jpg",
      "/images/day6/traditional-boat.jpg",
      "/images/day6/eja-eco-lofge.jpg",
      "/images/day6/day6-cover.jpg",
    ],
  },
  day7: {
    cover: "/images/day7/day7-cover.webp",
    gallery: [
      "/images/day7/landscape1.jpg",
      "/images/day7/landscae2.jpg",
      "/images/day7/landscape3.jpg",
      "/images/day7/skylight-hotel.jpg",
    ],
  },
  day8: {
    cover: "/images/day8/day8-cover.jpg",
    gallery: [
      "/images/day8/dorze-vilage.jpg",
      "/images/day8/Gughe-Highlands.jpg",
      "/images/day8/lake-abaya.jpg",
      "/images/day8/haile-resort.jpg",
    ],
  },
  day9: {
    cover: "/images/day9/hipo.jpg",
    gallery: [
      "/images/day9/corocodile.jpg",
      "/images/day9/fish-eagle.jpg",
      "/images/day9/white-pelicans.jpg",
      "/images/day9/Forty-Springs.jpg",
    ],
  },
  /** Day 10 — departure day, Arba Minch → Addis Ababa */
  day10: {
    cover: "/images/day10/day10-cover.jpeg",
    thumb: "/images/day10/day10-cover.jpeg",
    gallery: [
      "/images/day10/day10-cover.jpeg",
      "/images/day8/haile-resort.jpg",
      "/images/day7/skylight-hotel.jpg",
      "/images/day1/addis-abeba-city.jpg",
    ],
  },
} as const;

export const ethiopiaImages = {
  tourCover: stock("ethiopian-highlands.jpg"),
  landingHero: stock("ethiopian-highlands.jpg"),
  aboutEthiopia: stock("lalibela-pilgrims.jpg"),

  addisAbaba: {
    hero: stock("addis-ababa-hero.jpg"),
    thumb: stock("addis-ababa-hero.jpg"),
    skyline: stock("addis-skyline.jpg"),
    street: stock("addis-street.jpg"),
    night: stock("addis-night.jpg"),
    coffee: stock("coffee.jpg"),
    festival: stock("festival.jpg"),
  },

  entoto: {
    hero: stock("entoto-hero.jpg"),
    thumb: stock("entoto-hero.jpg"),
    highlands: stock("ethiopian-highlands.jpg"),
    mountains: stock("mountains.jpg"),
    viewpoint: stock("viewpoint.jpg"),
  },

  kuriftu: {
    hero: stock("kuriftu-hero.jpg"),
    thumb: stock("lake.jpg"),
    lake: stock("lake.jpg"),
    craterLake: stock("crater-lake.jpg"),
    cityLake: stock("city-lake.jpg"),
  },

  arbaMinch: {
    hero: stock("arba-minch-hero.jpg"),
    thumb: stock("village.jpg"),
    omoTribe: stock("arba-minch-hero.jpg"),
    village: stock("village.jpg"),
    camels: stock("camels.jpg"),
    portrait: stock("portrait.jpg"),
  },

  wonchi: {
    hero: stock("viewpoint.jpg"),
    thumb: stock("mountains.jpg"),
    crater: stock("lake.jpg"),
    highlands: stock("ethiopian-highlands.jpg"),
    forest: stock("entoto-hero.jpg"),
  },

  harar: {
    hero: stock("harar-hero.jpg"),
    thumb: stock("harar-alley.jpg"),
    spiceMarket: stock("harar-hero.jpg"),
    market: stock("harar-market.jpg"),
    alley: stock("harar-alley.jpg"),
    street: stock("harar-street.jpg"),
  },

  lalibela: stock("lalibela.jpg"),
  lalibelaPilgrims: stock("lalibela-pilgrims.jpg"),
  simien: stock("ethiopian-highlands.jpg"),
  omoValley: stock("arba-minch-hero.jpg"),
  danakil: stock("danakil.jpg"),
  blueNile: stock("blue-nile.jpg"),

  testimonials: {
    avatar1: stock("avatar-1.jpg"),
    avatar2: stock("avatar-2.jpg"),
    avatar3: stock("avatar-3.jpg"),
  },
} as const;

/** @deprecated Use ethiopiaImages instead */
export const images = ethiopiaImages;
