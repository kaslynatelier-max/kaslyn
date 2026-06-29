import elenaImg from "@/assets/model-elena.jpg";
import siennaImg from "@/assets/model-sienna.jpg";
import anyaImg from "@/assets/model-anya.jpg";
import mayaImg from "@/assets/model-maya.jpg";
import noorImg from "@/assets/model-noor.jpg";
import leilaImg from "@/assets/model-leila.jpg";

export interface Model {
  slug: string;
  name: string;
  image: string;
  placement: string;
  city: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  hair: string;
  eyes: string;
  tags: string[];
  bio: string;
}

export const MODELS: Model[] = [
  {
    slug: "elena-v",
    name: "Elena V.",
    image: elenaImg,
    placement: "Vogue · Cartier · Bottega",
    city: "Milan / Paris",
    height: "178 cm",
    bust: "82",
    waist: "60",
    hips: "88",
    hair: "Black",
    eyes: "Hazel",
    tags: ["editorial", "runway", "high-fashion", "jewelry", "couture"],
    bio: "A defining face of the new Milan season — sculpted bone structure and an intensity built for couture campaigns.",
  },
  {
    slug: "sienna-r",
    name: "Sienna R.",
    image: siennaImg,
    placement: "Dior · Elle · Sabyasachi",
    city: "Mumbai / Paris",
    height: "180 cm",
    bust: "84",
    waist: "62",
    hips: "90",
    hair: "Dark Brown",
    eyes: "Brown",
    tags: ["editorial", "couture", "silk", "drape", "south-asian", "luxury"],
    bio: "Movement-led. Sienna's draped silhouettes have anchored three Paris couture weeks and a Sabyasachi global campaign.",
  },
  {
    slug: "anya-k",
    name: "Anya K.",
    image: anyaImg,
    placement: "Chanel · Gucci · Aesop",
    city: "London / New York",
    height: "177 cm",
    bust: "81",
    waist: "59",
    hips: "87",
    hair: "Auburn",
    eyes: "Green",
    tags: ["beauty", "soft", "ethereal", "fragrance", "skincare", "editorial"],
    bio: "A fragrance-campaign face. Soft features, warm cinematic presence — ideal for skincare and quiet luxury.",
  },
  {
    slug: "maya-d",
    name: "Maya D.",
    image: mayaImg,
    placement: "Valentino · Vogue India · Tod's",
    city: "Rome / Mumbai",
    height: "179 cm",
    bust: "83",
    waist: "61",
    hips: "89",
    hair: "Brown",
    eyes: "Brown",
    tags: ["runway", "architectural", "gown", "editorial", "minimal", "couture"],
    bio: "Architectural posture and a Roman calm. Maya carries gowns the way a column carries a ceiling.",
  },
  {
    slug: "noor-a",
    name: "Noor A.",
    image: noorImg,
    placement: "Saint Laurent · Prada · i-D",
    city: "Berlin / Paris",
    height: "181 cm",
    bust: "82",
    waist: "60",
    hips: "88",
    hair: "Black (cropped)",
    eyes: "Hazel",
    tags: ["androgynous", "edgy", "leather", "avant-garde", "streetwear", "runway"],
    bio: "Sharp, androgynous, magnetic. Noor's runway walk has closed two Paris Fashion Week shows.",
  },
  {
    slug: "leila-h",
    name: "Leila H.",
    image: leilaImg,
    placement: "Hermès · Estée Lauder · Vogue",
    city: "Dubai / Mumbai",
    height: "176 cm",
    bust: "81",
    waist: "60",
    hips: "87",
    hair: "Long Brown",
    eyes: "Green",
    tags: ["beauty", "warm", "romantic", "fragrance", "lifestyle", "commercial"],
    bio: "The warmth of golden hour, on demand. Leila is a defining presence for beauty and lifestyle storytelling.",
  },
];

export function getModel(slug: string): Model | undefined {
  return MODELS.find((m) => m.slug === slug);
}