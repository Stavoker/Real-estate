export type PropertyType =
  | "House"
  | "Apartment"
  | "Villa"
  | "Penthouse"
  | "Commercial";

export type SortOption = "newest" | "price" | "popular";

export interface Agent {
  name: string;
  phone: string;
  email: string;
  photo: string;
  title: string;
}

export interface BuyerStory {
  name: string;
  photo: string;
  rating: 5;
  quote: string;
}

export interface Property {
  id: string;
  title: string;
  blurb: string;
  price: number;
  city: string;
  state: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  type: PropertyType;
  featured: boolean;
  premium: boolean;
  popular: boolean;
  newest: boolean;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  agent: Agent;
  buyer: BuyerStory;
  accent: string;
}

const img = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const portrait = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const HERO_IMAGE = img("photo-1600596542815-ffad4c1539a9", 2400);

export const EDITORIAL_IMAGES = {
  search: img("photo-1600210492486-724fe5c67fb0", 1600),
  expertise: img("photo-1486406146926-c627a92ad1ab", 1600),
  process: img("photo-1600566753190-17f0baa2a6c3", 1600),
};

const agents: Agent[] = [
  {
    name: "Elena Voss",
    title: "Principal Advisor",
    phone: "+1 (305) 555-0148",
    email: "elena@easyestate.com",
    photo: portrait("photo-1573496359142-b8d87734a5a2"),
  },
  {
    name: "Marcus Chen",
    title: "Private Client Lead",
    phone: "+1 (310) 555-0192",
    email: "marcus@easyestate.com",
    photo: portrait("photo-1560250097-0b93528c311a"),
  },
  {
    name: "Sofia Alvarez",
    title: "Villa Specialist",
    phone: "+1 (512) 555-0164",
    email: "sofia@easyestate.com",
    photo: portrait("photo-1580489944761-15a19d654956"),
  },
];

export const properties: Property[] = [
  {
    id: "modern-glass-villa",
    title: "Modern Glass Villa",
    blurb: "Panoramic waterfront residence with private outdoor living.",
    price: 2_400_000,
    city: "Miami",
    state: "Florida",
    beds: 4,
    baths: 3,
    sqft: 3800,
    yearBuilt: 2022,
    type: "Villa",
    featured: true,
    premium: true,
    popular: true,
    newest: true,
    image: img("photo-1613490493576-7fde63acd811"),
    gallery: [
      img("photo-1613490493576-7fde63acd811"),
      img("photo-1600566753086-00f18fb6b3ea"),
      img("photo-1600210492493-0946911123ea"),
      img("photo-1600607688969-a5bfcd646154"),
    ],
    description:
      "A cinematic waterfront residence framed in structural glass, where every room opens toward the Atlantic. Hand-troweled plaster, a sunken conversation court, and a linear pool compose a home that feels both private and infinite.",
    features: ["Pool", "Smart Home", "Garage", "Garden", "Security", "Fireplace"],
    agent: agents[0],
    buyer: {
      name: "The Callahan Family",
      photo: portrait("photo-1524504388940-b1c1722653e1"),
      rating: 5,
      quote:
        "EasyEstate found us our dream home within two weeks. The entire process felt effortless.",
    },
    accent: "#c4a574",
  },
  {
    id: "pacific-cliff-house",
    title: "Pacific Cliff House",
    blurb: "A cliffside retreat of cedar, limestone, and endless horizon.",
    price: 4_850_000,
    city: "Malibu",
    state: "California",
    beds: 5,
    baths: 5,
    sqft: 5200,
    yearBuilt: 2021,
    type: "House",
    featured: true,
    premium: true,
    popular: true,
    newest: false,
    image: img("photo-1600596542815-ffad4c1539a9"),
    gallery: [
      img("photo-1600596542815-ffad4c1539a9"),
      img("photo-1600573472592-401b489a3cdc"),
      img("photo-1600585153490-76fb20a32601"),
      img("photo-1600121848594-d8644e57abab"),
    ],
    description:
      "Set into the bluff with a quiet, almost monastic plan. Cedar, limestone, and bronze details meet a horizon that never repeats. Evenings here are slow, golden, and entirely your own.",
    features: ["Pool", "Smart Home", "Garage", "Garden", "Security", "Fireplace"],
    agent: agents[1],
    buyer: {
      name: "James & Priya Holt",
      photo: portrait("photo-1507003211169-0a1dd7228f2d"),
      rating: 5,
      quote:
        "They understood the house we wanted before we could describe it. Closing felt like a ceremony, not a transaction.",
    },
    accent: "#8a7a68",
  },
  {
    id: "austin-courtyard-villa",
    title: "Hill Country Courtyard",
    blurb: "Limestone pavilion organized around a still courtyard.",
    price: 1_950_000,
    city: "Austin",
    state: "Texas",
    beds: 4,
    baths: 4,
    sqft: 4100,
    yearBuilt: 2023,
    type: "Villa",
    featured: true,
    premium: true,
    popular: false,
    newest: true,
    image: img("photo-1600585154340-be6161a56a0c"),
    gallery: [
      img("photo-1600585154340-be6161a56a0c"),
      img("photo-1600566752355-35792bedcfea"),
      img("photo-1600210492486-724fe5c67fb0"),
      img("photo-1600047509782-20d39509f26d"),
    ],
    description:
      "A limestone pavilion organized around a still courtyard. Live oak canopy, a chef’s kitchen with a twelve-foot island, and night lighting designed like jewelry for architecture.",
    features: ["Pool", "Smart Home", "Garage", "Garden", "Security", "Fireplace"],
    agent: agents[2],
    buyer: {
      name: "Amelia Rhodes",
      photo: portrait("photo-1494790108377-be9c29b29330"),
      rating: 5,
      quote:
        "Private tours after hours. No pressure. Just an extraordinary home that already felt like ours.",
    },
    accent: "#b08968",
  },
  {
    id: "sunset-penthouse",
    title: "Sunset Strip Penthouse",
    blurb: "Sky residence with wraparound terraces and city light.",
    price: 3_200_000,
    city: "Los Angeles",
    state: "California",
    beds: 3,
    baths: 3,
    sqft: 2800,
    yearBuilt: 2020,
    type: "Penthouse",
    featured: true,
    premium: true,
    popular: true,
    newest: false,
    image: img("photo-1545324418-cc1a3fa10c00"),
    gallery: [
      img("photo-1545324418-cc1a3fa10c00"),
      img("photo-1600210491892-03d54c0aaf87"),
      img("photo-1600566753190-17f0baa2a6c3"),
      img("photo-1604014237800-1c9102c219da"),
    ],
    description:
      "A sky residence with wraparound terraces and a palatial primary suite. Floor-to-ceiling glass, a hidden wine room, and a city that performs for you every dusk.",
    features: ["Smart Home", "Garage", "Security", "Fireplace", "Garden", "Pool"],
    agent: agents[1],
    buyer: {
      name: "Noah Ellison",
      photo: portrait("photo-1472099645785-5658abf4ff4e"),
      rating: 5,
      quote:
        "I flew in for one weekend. By Sunday evening, the penthouse was mine. That is EasyEstate.",
    },
    accent: "#6e6258",
  },
  {
    id: "coral-gables-estate",
    title: "Coral Gables Estate",
    blurb: "An estate of rare scale, composed around still water.",
    price: 6_100_000,
    city: "Miami",
    state: "Florida",
    beds: 6,
    baths: 7,
    sqft: 7400,
    yearBuilt: 2019,
    type: "House",
    featured: true,
    premium: true,
    popular: false,
    newest: false,
    image: img("photo-1512917774080-9991f1c4c750"),
    gallery: [
      img("photo-1512917774080-9991f1c4c750"),
      img("photo-1600566753376-12c8ab7fb75b"),
      img("photo-1613977257363-707ba9348227"),
      img("photo-1600585152915-d208bec867a1"),
    ],
    description:
      "An estate of rare scale, composed as a sequence of pavilions around water. A staff wing, a gallery hall, and gardens that read like a private park.",
    features: ["Pool", "Smart Home", "Garage", "Garden", "Security", "Fireplace"],
    agent: agents[0],
    buyer: {
      name: "The Moreau Family",
      photo: portrait("photo-1534528741775-53994a69daeb"),
      rating: 5,
      quote:
        "They protected our privacy and still moved with extraordinary speed. We felt looked after at every step.",
    },
    accent: "#9a7b4f",
  },
  {
    id: "brickell-sky-loft",
    title: "Brickell Sky Loft",
    blurb: "Quiet luxury above Brickell with a bay-breeze terrace.",
    price: 1_280_000,
    city: "Miami",
    state: "Florida",
    beds: 2,
    baths: 2,
    sqft: 1650,
    yearBuilt: 2024,
    type: "Apartment",
    featured: false,
    premium: true,
    popular: true,
    newest: true,
    image: img("photo-1493809842364-78817add7ffb"),
    gallery: [
      img("photo-1493809842364-78817add7ffb"),
      img("photo-1600607687920-4e2a09cf159d"),
      img("photo-1600566753086-00f18fb6b3ea"),
      img("photo-1600210492486-724fe5c67fb0"),
    ],
    description:
      "A loft of quiet luxury above Brickell. Polished concrete, custom millwork, and a terrace that catches the bay breeze. Designed for those who want the city without the noise.",
    features: ["Smart Home", "Garage", "Security", "Pool", "Garden", "Fireplace"],
    agent: agents[2],
    buyer: {
      name: "Lena Park",
      photo: portrait("photo-1438761681033-6461ffad8d80"),
      rating: 5,
      quote:
        "The search felt curated, never overwhelming. I saw four homes. The fourth was home.",
    },
    accent: "#7d8a96",
  },
  {
    id: "ibiza-white-pavilion",
    title: "White Pavilion",
    blurb: "Limewashed walls, deep shadow, and a pool of light.",
    price: 3_750_000,
    city: "Los Angeles",
    state: "California",
    beds: 4,
    baths: 4,
    sqft: 3900,
    yearBuilt: 2022,
    type: "Villa",
    featured: true,
    premium: true,
    popular: true,
    newest: false,
    image: img("photo-1613977257363-707ba9348227"),
    gallery: [
      img("photo-1613977257363-707ba9348227"),
      img("photo-1600585154526-990dced4db0d"),
      img("photo-1600566753190-17f0baa2a6c3"),
      img("photo-1600573472592-401b489a3cdc"),
    ],
    description:
      "A Mediterranean-modern villa of limewashed walls and deep shadow. The pool is a sheet of light; the living hall is a single, generous volume for gathering.",
    features: ["Pool", "Smart Home", "Garage", "Garden", "Security", "Fireplace"],
    agent: agents[1],
    buyer: {
      name: "Daniel & Mila Costa",
      photo: portrait("photo-1500648767791-00dcc994a43e"),
      rating: 5,
      quote:
        "Every showing was private. Every detail was anticipated. We have never bought property like this.",
    },
    accent: "#c2b8a3",
  },
  {
    id: "oak-ridge-residence",
    title: "Oak Ridge Residence",
    blurb: "Generous rooms and a garden that feels older than the house.",
    price: 2_150_000,
    city: "Austin",
    state: "Texas",
    beds: 5,
    baths: 4,
    sqft: 4600,
    yearBuilt: 2018,
    type: "House",
    featured: false,
    premium: true,
    popular: false,
    newest: false,
    image: img("photo-1568602471122-7832951cc4c5"),
    gallery: [
      img("photo-1568602471122-7832951cc4c5"),
      img("photo-1600585154526-990dced4db0d"),
      img("photo-1580587771525-78b9dba3b914"),
      img("photo-1605276374104-dee2a0ed3cd6"),
    ],
    description:
      "A family residence of generous rooms and considered quiet. Indoor-outdoor living along a covered gallery, a study with a hearth, and a garden that feels older than the house.",
    features: ["Pool", "Garage", "Garden", "Fireplace", "Security", "Smart Home"],
    agent: agents[2],
    buyer: {
      name: "The Bennett Family",
      photo: portrait("photo-1544005313-94ddf0286df2"),
      rating: 5,
      quote:
        "They treated our first home search with the same care as a trophy listing. We felt like family.",
    },
    accent: "#8b7355",
  },
  {
    id: "palm-court-villa",
    title: "Palm Court Villa",
    blurb: "Tropical estate arranged around a palm court and pool.",
    price: 5_400_000,
    city: "Miami",
    state: "Florida",
    beds: 5,
    baths: 6,
    sqft: 6100,
    yearBuilt: 2023,
    type: "Villa",
    featured: true,
    premium: true,
    popular: true,
    newest: true,
    image: img("photo-1602343168117-bb8ffe3e2e9f"),
    gallery: [
      img("photo-1602343168117-bb8ffe3e2e9f"),
      img("photo-1600607688969-a5bfcd646154"),
      img("photo-1600566752355-35792bedcfea"),
      img("photo-1600566753376-12c8ab7fb75b"),
    ],
    description:
      "A tropical estate arranged around a palm court and a fifty-foot pool. Indoor living dissolves into loggias. The primary suite has its own garden and a bath like a spa pavilion.",
    features: ["Pool", "Smart Home", "Garage", "Garden", "Security", "Fireplace"],
    agent: agents[0],
    buyer: {
      name: "Isabelle Laurent",
      photo: portrait("photo-1531746020798-e6953c6e8e04"),
      rating: 5,
      quote:
        "I asked for discretion and beauty. They delivered both, and a home I did not know existed.",
    },
    accent: "#5c7a6e",
  },
  {
    id: "west-hollywood-loft",
    title: "WeHo Gallery Loft",
    blurb: "Industrial-quiet loft with gallery lighting in West Hollywood.",
    price: 1_620_000,
    city: "Los Angeles",
    state: "California",
    beds: 2,
    baths: 2,
    sqft: 1900,
    yearBuilt: 2021,
    type: "Apartment",
    featured: false,
    premium: false,
    popular: true,
    newest: false,
    image: img("photo-1448630360428-65456885c650"),
    gallery: [
      img("photo-1448630360428-65456885c650"),
      img("photo-1600607687939-ce8a6c25118c"),
      img("photo-1522708323590-d24dbb6b0267"),
      img("photo-1560448204-e02f11c3d0e2"),
    ],
    description:
      "An industrial-quiet loft with gallery lighting and a rooftop lounge. Perfect for collectors who want West Hollywood within a five-minute walk and silence at night.",
    features: ["Smart Home", "Garage", "Security", "Fireplace", "Garden", "Pool"],
    agent: agents[1],
    buyer: {
      name: "Owen Blake",
      photo: portrait("photo-1506794778202-cad84cf45f1d"),
      rating: 5,
      quote:
        "The loft was never listed publicly. EasyEstate opened a door I could not have found alone.",
    },
    accent: "#6a6a6a",
  },
  {
    id: "lakeshore-commercial",
    title: "Lakeshore Atelier",
    blurb: "Boutique commercial atelier on the lake edge.",
    price: 4_200_000,
    city: "Austin",
    state: "Texas",
    beds: 1,
    baths: 2,
    sqft: 8200,
    yearBuilt: 2020,
    type: "Commercial",
    featured: false,
    premium: true,
    popular: false,
    newest: true,
    image: img("photo-1486406146926-c627a92ad1ab"),
    gallery: [
      img("photo-1486406146926-c627a92ad1ab"),
      img("photo-1497366216548-37526070297c"),
      img("photo-1497366811353-6870744d04b2"),
      img("photo-1600566753376-12c8ab7fb75b"),
    ],
    description:
      "A boutique commercial atelier on the lake edge. Double-height reception, private suites, and a terrace for evening gatherings. Crafted for studios, funds, and houses of design.",
    features: ["Smart Home", "Garage", "Security", "Garden", "Fireplace", "Pool"],
    agent: agents[2],
    buyer: {
      name: "Atelier North",
      photo: portrait("photo-1519085360753-af0119f7cbe7"),
      rating: 5,
      quote:
        "They sourced a workplace that feels like a residence. Our clients notice the difference immediately.",
    },
    accent: "#4a5560",
  },
  {
    id: "bel-air-pavilion",
    title: "Bel Air Pavilion",
    blurb: "Contemporary pavilion estate with Los Angeles as a private landscape.",
    price: 8_900_000,
    city: "Los Angeles",
    state: "California",
    beds: 7,
    baths: 8,
    sqft: 9800,
    yearBuilt: 2024,
    type: "House",
    featured: true,
    premium: true,
    popular: true,
    newest: true,
    image: img("photo-1613977257592-4871e5fcd7c4"),
    gallery: [
      img("photo-1613977257592-4871e5fcd7c4"),
      img("photo-1600047509782-20d39509f26d"),
      img("photo-1600607688969-a5bfcd646154"),
      img("photo-1600573472592-401b489a3cdc"),
    ],
    description:
      "A contemporary pavilion estate above Bel Air. Sculptural stairs, a wellness wing, and a motor court that arrives like a film still. The view is Los Angeles as a private landscape.",
    features: ["Pool", "Smart Home", "Garage", "Garden", "Security", "Fireplace"],
    agent: agents[0],
    buyer: {
      name: "The Harringtons",
      photo: portrait("photo-1521119989659-a83eee488004"),
      rating: 5,
      quote:
        "From first conversation to keys, everything was composed. This is how luxury should feel.",
    },
    accent: "#a09078",
  },
];

export const featuredProperties = properties.filter((p) => p.featured);

export const streamImages = [
  ...properties.map((p) => ({ src: p.image, alt: p.title })),
  { src: img("photo-1600566753086-00f18fb6b3ea"), alt: "Sunlit luxury kitchen" },
  { src: img("photo-1600573472592-401b489a3cdc"), alt: "Primary suite interior" },
  { src: img("photo-1600607688969-a5bfcd646154"), alt: "Editorial living hall" },
  { src: img("photo-1600210492493-0946911123ea"), alt: "Pool pavilion dusk" },
];

export const faqs = [
  {
    q: "How does the buying process work?",
    a: "We begin with a private consultation to understand how you live, not only what you want to buy. From there we assemble a short, considered list, arrange after-hours tours, and manage negotiation through closing with a single dedicated advisor.",
  },
  {
    q: "Do you help first-time buyers?",
    a: "Yes. Many of our families are buying their first significant home. We translate the market, introduce trusted lenders and inspectors, and keep the process calm, private, and clear.",
  },
  {
    q: "Can I schedule private tours?",
    a: "Every tour is private. We arrange access outside peak hours, including evenings and weekends, so you can experience a residence the way it is meant to be lived in.",
  },
  {
    q: "What areas do you specialize in?",
    a: "We focus on Miami, Austin, and Los Angeles — waterfront villas, hillside estates, sky residences, and a small number of commercial ateliers for private clients.",
  },
  {
    q: "How long does closing usually take?",
    a: "Most of our transactions close within 21 to 45 days, depending on financing and inspection. Off-market purchases can move faster when both parties are prepared.",
  },
];
