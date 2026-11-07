// Curated presets, software autocomplete dictionary, and persistent storage
import logoImg from "../../assets/images/creative_logo_modern_1794044017645.jpg";
import posterImg from "../../assets/images/creative_poster_cyberpunk_1794044018116.jpg";
import packagingImg from "../../assets/images/creative_packaging_luxury_1794044018323.jpg";
import socialImg from "../../assets/images/creative_social_tech_1794044018755.jpg";
import brandImg from "../../assets/images/creative_brand_identity_1794044019144.jpg";

export const SOFTWARE_SUGGESTIONS = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
  "Adobe After Effects",
  "Adobe Premiere Pro",
  "Adobe Lightroom",
  "Adobe XD",
  "Adobe Dimension",
  "Figma",
  "Blender 3D",
  "Cinema 4D",
  "Canva Pro",
  "CorelDRAW",
  "Procreate",
  "Midjourney AI",
  "Vector Mesh",
];

export const PRESET_ARTWORKS = [
  {
    id: "preset-1",
    indexStr: "01",
    title: "Aetherius - Luxury Emblem & Royal Monogram",
    category: "Logos & Emblems",
    categoryKey: "logos",
    img: logoImg,
    tools: ["Adobe Illustrator", "Photoshop", "Vector Mesh"],
    year: "2024",
    dimensions: "3840 x 2880 px (300 DPI)",
    client: "Aetherius Luxury Goods Ltd.",
    accent: "#c084fc",
    accentGlow: "rgba(192, 132, 252, 0.45)",
    solidBg: "#0c0418",
    bgGradient: "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(168, 85, 247, 0.38) 0%, rgba(126, 34, 206, 0.18) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(236, 72, 153, 0.25) 0%, transparent 65%)",
    desc: "A bespoke crown monogram emblem engineered with mathematical symmetry and silver foil embossing on premium matte black stock. Designed for luxury retail packaging and brand collateral.",
  },
  {
    id: "preset-2",
    indexStr: "02",
    title: "Neon Pulse - Audiowave Festival Visual Identity",
    category: "Banners & Posters",
    categoryKey: "posters",
    img: posterImg,
    tools: ["Photoshop", "Illustrator", "Cinema 4D"],
    year: "2024",
    dimensions: "2880 x 3840 px (Print Ready)",
    client: "Future Stage Los Angeles",
    accent: "#f43f5e",
    accentGlow: "rgba(244, 63, 94, 0.45)",
    solidBg: "#160212",
    bgGradient: "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(244, 63, 94, 0.4) 0%, rgba(190, 24, 93, 0.2) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(217, 70, 239, 0.25) 0%, transparent 65%)",
    desc: "High-voltage EDM festival headline poster featuring custom glowing typography, volumetric lighting effects, and an atmospheric crowd stage composition with balanced hierarchy.",
  },
  {
    id: "preset-3",
    indexStr: "03",
    title: "Lunaria - Botanical Skincare Packaging & Label",
    category: "Packaging & Labels",
    categoryKey: "packaging",
    img: packagingImg,
    tools: ["Adobe Dimension", "Illustrator", "Lightroom"],
    year: "2024",
    dimensions: "4000 x 3000 px (Ultra HD)",
    client: "Lunaria Organics",
    accent: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.45)",
    solidBg: "#02140d",
    bgGradient: "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(16, 185, 129, 0.38) 0%, rgba(5, 150, 105, 0.18) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(245, 158, 11, 0.25) 0%, transparent 65%)",
    desc: "Minimalist Scandinavian aesthetic packaging design for night repair serum, featuring refined serif typography, frosted glass bottle treatment, and earthy travertine pedestal staging.",
  },
  {
    id: "preset-4",
    indexStr: "04",
    title: "Nexus Platform - AI Launch Campaign Carousel",
    category: "Social Media Posts",
    categoryKey: "social",
    img: socialImg,
    tools: ["Figma", "Blender 3D", "Photoshop"],
    year: "2024",
    dimensions: "3200 x 2400 px (Digital Display)",
    client: "Synergy AI Labs",
    accent: "#38bdf8",
    accentGlow: "rgba(56, 189, 248, 0.45)",
    solidBg: "#030a1c",
    bgGradient: "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(56, 189, 248, 0.4) 0%, rgba(29, 78, 216, 0.2) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(45, 212, 191, 0.25) 0%, transparent 65%)",
    desc: "A high-conversion tech launch post slide combining dark glassmorphism UI card layers with a hyper-detailed 3D geometric light sphere and crisp vector tech metadata.",
  },
  {
    id: "preset-5",
    indexStr: "05",
    title: "Aethelred - Comprehensive Brand Guidelines & Stationery",
    category: "Brand Identity Systems",
    categoryKey: "identity",
    img: brandImg,
    tools: ["InDesign", "Illustrator", "Photoshop"],
    year: "2024",
    dimensions: "3840 x 2880 px (Editorial Spread)",
    client: "Aethelred Architecture & Design",
    accent: "#e879f9",
    accentGlow: "rgba(232, 121, 249, 0.45)",
    solidBg: "#0e0318",
    bgGradient: "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(232, 121, 249, 0.4) 0%, rgba(126, 34, 206, 0.2) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(244, 114, 182, 0.25) 0%, transparent 65%)",
    desc: "A complete corporate brand stationery suite including embossed copper hot-stamp business cards, wax-sealed envelopes, linen notebooks, and brand color theory documentation.",
  },
];

const STORAGE_KEY = "tharusha_creative_artworks_v3";

export function getStoredArtworks() {
  if (typeof window === "undefined") return PRESET_ARTWORKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time: store PRESET_ARTWORKS so presets can be edited in-place
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_ARTWORKS));
      return PRESET_ARTWORKS;
    }
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored) || stored.length === 0) return PRESET_ARTWORKS;
    return stored.map((item, idx) => ({
      ...item,
      indexStr: String(idx + 1).padStart(2, "0"),
    }));
  } catch (err) {
    console.error("Failed to load artworks from localStorage:", err);
    return PRESET_ARTWORKS;
  }
}

export function updateStoredArtwork(updatedItem) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredArtworks();
    const index = current.findIndex((a) => a.id === updatedItem.id);
    let updatedList;
    if (index !== -1) {
      updatedList = [...current];
      updatedList[index] = {
        ...updatedList[index],
        ...updatedItem,
      };
    } else {
      updatedList = [updatedItem, ...current];
    }
    // Re-index
    const finalized = updatedList.map((item, idx) => ({
      ...item,
      indexStr: String(idx + 1).padStart(2, "0"),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalized));
    return finalized;
  } catch (err) {
    console.error("Failed to update artwork:", err);
  }
}

export function saveCustomArtwork(newArtwork) {
  return updateStoredArtwork(newArtwork);
}
