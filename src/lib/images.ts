/** Verified Unsplash images of Ethiopian tourist destinations */

export const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const ethiopiaImages = {
  tourCover: unsplash("1572888195250-3037a59d3578", 1920),
  landingHero: unsplash("1572888195250-3037a59d3578", 1920),
  aboutEthiopia: unsplash("1564101183558-eacfd7e02d4f", 1920),

  addisAbaba: {
    hero: unsplash("1771350369010-be9f01d71ba4", 1920),
    thumb: unsplash("1771350369010-be9f01d71ba4", 400),
    skyline: unsplash("1734865934450-719ef6f59a37"),
    street: unsplash("1626598442658-ea6a1a5943df"),
    night: unsplash("1647316703389-e114712500e5"),
    coffee: unsplash("1630861413071-a424a4d6d155"),
    festival: unsplash("1714041123574-6367e4f8f59d"),
  },

  entoto: {
    hero: unsplash("1564101151838-630e722d7b1f", 1920),
    thumb: unsplash("1564101151838-630e722d7b1f", 400),
    highlands: unsplash("1572888195250-3037a59d3578"),
    mountains: unsplash("1573403092240-26095e118918"),
    viewpoint: unsplash("1508914127305-fa5114b81b3f"),
  },

  kuriftu: {
    hero: unsplash("1680465807916-bdc537fcd4b0", 1920),
    thumb: unsplash("1662186946255-6f3c09ec666e", 400),
    lake: unsplash("1662186946255-6f3c09ec666e"),
    craterLake: unsplash("1680465808058-b738aeb01046"),
    cityLake: unsplash("1624314138470-5a2f24623f10"),
  },

  arbaMinch: {
    hero: unsplash("1530313292289-fa316f332666", 1920),
    thumb: unsplash("1658823235938-c424fa0875d6", 400),
    omoTribe: unsplash("1530313292289-fa316f332666"),
    village: unsplash("1658823235938-c424fa0875d6"),
    camels: unsplash("1573404353091-bd68e3010d73"),
    portrait: unsplash("1546286541-10c006fdc19e"),
  },

  harar: {
    hero: unsplash("1778079247396-9c0e01c83c8b", 1920),
    thumb: unsplash("1782283034357-47f4185af8f8", 400),
    spiceMarket: unsplash("1778079247396-9c0e01c83c8b"),
    market: unsplash("1572851569977-e18b9ea6edbe"),
    alley: unsplash("1782283034357-47f4185af8f8"),
    street: unsplash("1643450408449-91e5e0ab1fd1"),
  },

  lalibela: unsplash("1782283849015-df78517d4765"),
  lalibelaPilgrims: unsplash("1564101183558-eacfd7e02d4f"),
  simien: unsplash("1572888195250-3037a59d3578"),
  omoValley: unsplash("1530313292289-fa316f332666"),
  danakil: unsplash("1516535655127-9ce85b6617aa"),
  blueNile: unsplash("1668939581252-470c103ac7da"),
} as const;

/** @deprecated Use ethiopiaImages instead */
export const images = ethiopiaImages;
