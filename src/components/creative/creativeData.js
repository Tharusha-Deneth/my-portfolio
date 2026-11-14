// Curated presets (3 cards), software autocomplete dictionary, IndexedDB cache, and permanent Firestore persistence
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../firebase";
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

// ================= INDEXEDDB CACHE (No 5MB Quota Limit) =================
const IDB_NAME = "tharusha_creative_portfolio_db";
const IDB_STORE = "creative_state";
const IDB_VERSION = 1;

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

export async function readCachedArtworks() {
  try {
    const database = await openIdb();
    return await new Promise((resolve) => {
      const tx = database.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const req = store.get("artworks_snapshot");
      req.onsuccess = () => {
        const record = req.result;
        if (record && Array.isArray(record.items)) {
          resolve(withNormalizedIndex(record.items));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function writeCachedArtworks(items) {
  try {
    const database = await openIdb();
    await new Promise((resolve) => {
      const tx = database.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put({
        key: "artworks_snapshot",
        items: items.map((item) => ({
          id: item.id,
          order: item.order ?? 1,
          indexStr: item.indexStr,
          title: item.title,
          category: item.category,
          categoryKey: item.categoryKey,
          img: item.img,
          format: item.format || "PNG",
          tools: item.tools || [],
          year: item.year || "2024",
          dimensions: item.dimensions || "",
          client: item.client || "",
          accent: item.accent || "#c084fc",
          accentGlow: item.accentGlow || "rgba(192, 132, 252, 0.45)",
          solidBg: item.solidBg || "#0c0418",
          bgGradient: item.bgGradient || "",
          desc: item.desc || "",
        })),
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // Non-fatal local cache failure
  }
}

function withNormalizedIndex(list) {
  return [...list]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((item, idx) => ({
      ...item,
      indexStr: String(idx + 1).padStart(2, "0"),
    }));
}

function sanitizeArtworkFields(artwork) {
  const safeId = String(artwork.id || `custom-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 128);
  const safeCategory = String(artwork.category || "Logos & Emblems").slice(0, 100);
  const safeCategoryKey = String(
    artwork.categoryKey || safeCategory.toLowerCase().replace(/[^a-z]/g, "") || "design"
  ).slice(0, 60);
  const safeTools = Array.isArray(artwork.tools) && artwork.tools.length > 0
    ? artwork.tools.slice(0, 12).map((t) => String(t).slice(0, 60))
    : ["Adobe Illustrator"];

  return {
    id: safeId,
    order: typeof artwork.order === "number" ? artwork.order : 1,
    title: String(artwork.title || "Untitled Artwork").slice(0, 200),
    category: safeCategory,
    categoryKey: safeCategoryKey,
    img: String(artwork.img || "").slice(0, 900000),
    format: String(artwork.format || "PNG").slice(0, 20),
    tools: safeTools,
    year: String(artwork.year || new Date().getFullYear().toString()).slice(0, 10),
    dimensions: String(artwork.dimensions || "High Resolution Artwork").slice(0, 100),
    client: String(artwork.client || "Freelance Commission").slice(0, 150),
    accent: String(artwork.accent || "#c084fc").slice(0, 40),
    accentGlow: String(artwork.accentGlow || "rgba(192, 132, 252, 0.45)").slice(0, 100),
    solidBg: String(artwork.solidBg || "#0c0418").slice(0, 40),
    bgGradient: String(
      artwork.bgGradient ||
        "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(168, 85, 247, 0.38) 0%, transparent 75%)"
    ).slice(0, 600),
    desc: String(artwork.desc || "").slice(0, 2000),
  };
}

/**
 * Subscribe to real-time Firestore artworks (with IndexedDB instant preload & 3-card default fallback)
 */
export function subscribeToArtworks(onArtworks) {
  let active = true;
  let metaLoaded = false;
  let isSeeded = false;
  let artworksLoaded = false;
  let latestDocs = [];

  // 1. Instant local cache load so UI renders immediately without waiting on network
  readCachedArtworks().then((cached) => {
    if (!active) return;
    if (cached) {
      onArtworks(cached);
    } else {
      onArtworks(PRESET_ARTWORKS);
    }
  });

  const reconcileAndEmit = async () => {
    if (!active || !metaLoaded || !artworksLoaded) return;
    try {
      if (isSeeded || latestDocs.length > 0) {
        const normalized = withNormalizedIndex(latestDocs);
        await writeCachedArtworks(normalized);
        if (active) onArtworks(normalized);
      } else {
        // Cloud is not seeded yet: preserve any existing local IndexedDB edits/additions/deletions!
        const cached = await readCachedArtworks();
        if (cached !== null) {
          if (active) onArtworks(cached);
        } else {
          await writeCachedArtworks(PRESET_ARTWORKS);
          if (active) onArtworks(PRESET_ARTWORKS);
        }
      }
    } catch (err) {
      console.error("Failed reconciling artworks state:", err);
    }
  };

  const unsubMeta = onSnapshot(
    doc(db, "creativeConfig", "meta"),
    (metaSnap) => {
      if (!active) return;
      metaLoaded = true;
      isSeeded = Boolean(metaSnap.exists() && metaSnap.data()?.seeded === true);
      reconcileAndEmit();
    },
    (error) => {
      console.warn("Firestore meta listener fallback to local IndexedDB:", error?.message || error);
    }
  );

  // 2. Real-time Firestore artworks listener
  const artworksPath = "artworks";
  const unsubArtworks = onSnapshot(
    collection(db, artworksPath),
    (snapshot) => {
      if (!active) return;
      artworksLoaded = true;
      latestDocs = snapshot.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      }));
      reconcileAndEmit();
    },
    (error) => {
      console.warn("Firestore artworks listener fallback to local IndexedDB:", error?.message || error);
    }
  );

  return () => {
    active = false;
    unsubMeta();
    unsubArtworks();
  };
}

async function resolvePersistentImgUrl(imgUrl) {
  if (!imgUrl || typeof imgUrl !== "string") return "";
  if (imgUrl.startsWith("data:")) {
    return optimizeDataUrl(imgUrl, 1600, 720000);
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
    return await optimizeDataUrl(dataUrl, 1600, 720000);
  } catch {
    return imgUrl;
  }
}

/**
 * Seed initial artworks into Firestore once when owner enables Cloud Sync
 */
async function ensureCloudSeeded(uid, seedSourceList = PRESET_ARTWORKS) {
  const metaRef = doc(db, "creativeConfig", "meta");
  let metaSnap;
  try {
    metaSnap = await getDoc(metaRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, "creativeConfig/meta");
  }

  if (metaSnap && metaSnap.exists() && metaSnap.data()?.seeded === true) {
    return;
  }

  const baseList = Array.isArray(seedSourceList) ? seedSourceList : PRESET_ARTWORKS;
  const resolvedPresets = await Promise.all(
    baseList.map(async (preset, idx) => ({
      ...preset,
      order: typeof preset.order === "number" ? preset.order : idx + 1,
      img: await resolvePersistentImgUrl(preset.img),
    }))
  );

  const batch = writeBatch(db);
  for (const preset of resolvedPresets) {
    const clean = sanitizeArtworkFields(preset);
    const presetRef = doc(db, "artworks", clean.id);
    batch.set(presetRef, {
      ...clean,
      ownerId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  batch.set(metaRef, {
    seeded: true,
    ownerId: uid,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, "artworks/seed");
  }
}

/**
 * Create or Update an artwork permanently in IndexedDB (instant) + Firestore (when signed in as owner)
 */
export async function saveArtworkPermanently(artwork, { isEditing, currentList = [], uid = null }) {
  const optimizedImg = await resolvePersistentImgUrl(artwork.img);

  const prepared = sanitizeArtworkFields({
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

  // 1. Always persist immediately to IndexedDB so reloads never lose changes
  const baseList = Array.isArray(currentList) ? currentList : [];
  const nextListRaw = isEditing
    ? baseList.some((a) => a.id === prepared.id)
      ? baseList.map((a) => (a.id === prepared.id ? { ...a, ...prepared } : a))
      : [prepared, ...baseList]
    : [prepared, ...baseList];

  const updatedLocal = withNormalizedIndex(nextListRaw);
  await writeCachedArtworks(updatedLocal);

  // 2. If signed in as verified owner, also sync to Firestore for cross-device visitors
  let syncedToCloud = false;
  if (uid) {
    await ensureCloudSeeded(uid, baseList);
    const docRef = doc(db, "artworks", prepared.id);

    if (isEditing) {
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists()) {
        const updatePayload = {
          order: prepared.order,
          title: prepared.title,
          category: prepared.category,
          categoryKey: prepared.categoryKey,
          img: prepared.img,
          format: prepared.format,
          tools: prepared.tools,
          year: prepared.year,
          dimensions: prepared.dimensions,
          client: prepared.client,
          accent: prepared.accent,
          accentGlow: prepared.accentGlow,
          solidBg: prepared.solidBg,
          bgGradient: prepared.bgGradient,
          desc: prepared.desc,
          updatedAt: serverTimestamp(),
        };
        try {
          await updateDoc(docRef, updatePayload);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `artworks/${prepared.id}`);
        }
      } else {
        try {
          await setDoc(docRef, {
            ...prepared,
            ownerId: uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `artworks/${prepared.id}`);
        }
      }
    } else {
      try {
        await setDoc(docRef, {
          ...prepared,
          ownerId: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `artworks/${prepared.id}`);
      }
    }
    syncedToCloud = true;
  }

  return { saved: prepared, list: updatedLocal, syncedToCloud };
}

/**
 * Permanently delete an artwork from IndexedDB (instant) + Firestore (when signed in as owner)
 */
export async function deleteArtworkPermanently(artworkId, { currentList = [], uid = null }) {
  const remaining = withNormalizedIndex(currentList.filter((a) => a.id !== artworkId));
  await writeCachedArtworks(remaining);

  if (uid) {
    await ensureCloudSeeded(uid, currentList);
    const docRef = doc(db, "artworks", artworkId);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `artworks/${artworkId}`);
    }
  }

  return remaining;
}
