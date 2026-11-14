// Curated presets (3 cards), software autocomplete dictionary, and permanent IndexedDB storage
import { optimizeDataUrl } from "./fileParser";
import logoImg from "../../assets/images/creative_logo_modern_1794044017645.jpg";
import posterImg from "../../assets/images/creative_poster_cyberpunk_1794044018116.jpg";
import packagingImg from "../../assets/images/creative_packaging_luxury_1794044018323.jpg";

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

// Exactly 3 initial showcase artwork cards
export const PRESET_ARTWORKS = [
  {
    id: "preset-1",
    order: 1,
    indexStr: "01",
    title: "Aetherius - Luxury Emblem & Royal Monogram",
    category: "Logos & Emblems",
    categoryKey: "logos",
    img: logoImg,
    format: "AI",
    tools: ["Adobe Illustrator", "Photoshop", "Vector Mesh"],
    year: "2024",
    dimensions: "3840 x 2880 px (300 DPI)",
    client: "Aetherius Luxury Goods Ltd.",
    accent: "#c084fc",
    accentGlow: "rgba(192, 132, 252, 0.45)",
    solidBg: "#0c0418",
    bgGradient:
      "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(168, 85, 247, 0.38) 0%, rgba(126, 34, 206, 0.18) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(236, 72, 153, 0.25) 0%, transparent 65%)",
    desc: "A bespoke crown monogram emblem engineered with mathematical symmetry and silver foil embossing on premium matte black stock. Designed for luxury retail packaging and brand collateral.",
  },
  {
    id: "preset-2",
    order: 2,
    indexStr: "02",
    title: "Neon Pulse - Audiowave Festival Visual Identity",
    category: "Banners & Posters",
    categoryKey: "posters",
    img: posterImg,
    format: "PSD",
    tools: ["Photoshop", "Illustrator", "Cinema 4D"],
    year: "2024",
    dimensions: "2880 x 3840 px (Print Ready)",
    client: "Future Stage Los Angeles",
    accent: "#f43f5e",
    accentGlow: "rgba(244, 63, 94, 0.45)",
    solidBg: "#160212",
    bgGradient:
      "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(244, 63, 94, 0.4) 0%, rgba(190, 24, 93, 0.2) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(217, 70, 239, 0.25) 0%, transparent 65%)",
    desc: "High-voltage EDM festival headline poster featuring custom glowing typography, volumetric lighting effects, and an atmospheric crowd stage composition with balanced hierarchy.",
  },
  {
    id: "preset-3",
    order: 3,
    indexStr: "03",
    title: "Lunaria - Botanical Skincare Packaging & Label",
    category: "Packaging & Labels",
    categoryKey: "packaging",
    img: packagingImg,
    format: "PNG",
    tools: ["Adobe Dimension", "Illustrator", "Lightroom"],
    year: "2024",
    dimensions: "4000 x 3000 px (Ultra HD)",
    client: "Lunaria Organics",
    accent: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.45)",
    solidBg: "#02140d",
    bgGradient:
      "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(16, 185, 129, 0.38) 0%, rgba(5, 150, 105, 0.18) 45%, transparent 75%), radial-gradient(ellipse 55% 50% at 75% 42%, rgba(245, 158, 11, 0.25) 0%, transparent 65%)",
    desc: "Minimalist Scandinavian aesthetic packaging design for night repair serum, featuring refined serif typography, frosted glass bottle treatment, and earthy travertine pedestal staging.",
  },
];

// ================= INDEXEDDB PERSISTENCE ENGINE =================
const IDB_NAME = "tharusha_creative_portfolio_db";
const IDB_STORE = "creative_state";
const IDB_KEY = "artworks_snapshot";
const IDB_VERSION = 1;
const LS_FALLBACK_KEY = "tharusha_creative_artworks_idb_fallback";

function openIdb() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const database = req.result;
      if (!database.objectStoreNames.contains(IDB_STORE)) {
        database.createObjectStore(IDB_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function withNormalizedIndex(list) {
  return [...list]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((item, idx) => ({
      ...item,
      indexStr: String(idx + 1).padStart(2, "0"),
    }));
}

function serializeArtwork(item) {
  return {
    id: item.id,
    order: typeof item.order === "number" ? item.order : 1,
    indexStr: item.indexStr,
    title: item.title,
    category: item.category,
    categoryKey: item.categoryKey,
    img: item.img,
    format: item.format || "PNG",
    tools: Array.isArray(item.tools) ? item.tools : [],
    year: item.year || "2024",
    dimensions: item.dimensions || "",
    client: item.client || "",
    accent: item.accent || "#c084fc",
    accentGlow: item.accentGlow || "rgba(192, 132, 252, 0.45)",
    solidBg: item.solidBg || "#0c0418",
    bgGradient: item.bgGradient || "",
    desc: item.desc || "",
  };
}

async function readCachedArtworks() {
  try {
    const database = await openIdb();
    const record = await new Promise((resolve) => {
      const tx = database.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
    if (record && Array.isArray(record.items)) {
      return withNormalizedIndex(record.items);
    }
    return null;
  } catch {
    // Fallback to localStorage only if IndexedDB is blocked
    try {
      const raw = localStorage.getItem(LS_FALLBACK_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? withNormalizedIndex(parsed) : null;
    } catch {
      return null;
    }
  }
}

async function writeCachedArtworks(items) {
  const serialized = items.map(serializeArtwork);
  try {
    const database = await openIdb();
    await new Promise((resolve, reject) => {
      const tx = database.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put({
        key: IDB_KEY,
        items: serialized,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("IndexedDB write failed"));
    });
  } catch {
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(serialized));
  }
}

async function resolvePersistentImgUrl(imgUrl) {
  if (!imgUrl || typeof imgUrl !== "string") return "";
  if (imgUrl.startsWith("data:")) {
    return optimizeDataUrl(imgUrl, 2000, 1500000);
  }
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }
  try {
    const res = await fetch(imgUrl);
    if (!res.ok) return imgUrl;
    const blob = await res.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return await optimizeDataUrl(dataUrl, 2000, 1500000);
  } catch {
    return imgUrl;
  }
}

/**
 * Load persisted artworks from IndexedDB; seeds 3 presets only on first-ever visit
 */
export async function loadPersistedArtworks() {
  const cached = await readCachedArtworks();
  if (cached !== null) {
    return cached;
  }
  const initial = withNormalizedIndex(PRESET_ARTWORKS);
  await writeCachedArtworks(initial);
  return initial;
}

/**
 * Create or Update an artwork permanently in IndexedDB
 */
export async function saveArtworkPermanently(artwork, { isEditing, currentList = [] }) {
  const optimizedImg = await resolvePersistentImgUrl(artwork.img);

  const prepared = serializeArtwork({
    ...artwork,
    img: optimizedImg,
  });

  if (!isEditing) {
    const minOrder =
      currentList.length > 0
        ? Math.min(...currentList.map((a) => (typeof a.order === "number" ? a.order : 1)))
        : 1;
    prepared.order = minOrder - 1;
  }

  const baseList = Array.isArray(currentList) ? currentList : [];
  const nextListRaw = isEditing
    ? baseList.some((a) => a.id === prepared.id)
      ? baseList.map((a) => (a.id === prepared.id ? { ...a, ...prepared } : a))
      : [prepared, ...baseList]
    : [prepared, ...baseList];

  const updatedList = withNormalizedIndex(nextListRaw);
  await writeCachedArtworks(updatedList);
  return { saved: prepared, list: updatedList };
}

/**
 * Permanently delete an artwork from IndexedDB
 */
export async function deleteArtworkPermanently(artworkId, { currentList = [] }) {
  const remaining = withNormalizedIndex(currentList.filter((a) => a.id !== artworkId));
  await writeCachedArtworks(remaining);
  return remaining;
}
