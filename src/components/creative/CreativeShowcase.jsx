import { useState, useEffect, useCallback, useMemo } from "react";
import "./creative.css";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  Waves 
} from "lucide-react";
import ArtworkModal from "./ArtworkModal";
import SecretAdminModal from "./SecretAdminModal";
import { getStoredArtworks } from "./creativeData";
import { useTheme } from "../../context/ThemeContext";

// Slide & 3D lift animation variants mirroring Portfolio.jsx
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 180 : -180,
    opacity: 0,
    scale: 0.94,
    rotateY: direction > 0 ? 5 : -5,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 170,
      mass: 0.9,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -180 : 180,
    opacity: 0,
    scale: 0.94,
    rotateY: direction > 0 ? -5 : 5,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function CreativeShowcase() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [artworks, setArtworks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Admin Modal state
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);
  const [adminModalMode, setAdminModalMode] = useState("edit"); // "add" or "edit"
  const [artworkToEdit, setArtworkToEdit] = useState(null);

  useEffect(() => {
    setArtworks(getStoredArtworks());
  }, []);

  const total = artworks.length;
  const activeArtwork = useMemo(() => {
    if (!total) return null;
    return artworks[currentIndex % total];
  }, [artworks, currentIndex, total]);

  const handleNext = useCallback(() => {
    if (!total) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (!total) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Open "Add New Artwork" mode (Ctrl + 11 / Ctrl + F11)
  const openAddModal = useCallback(() => {
    setArtworkToEdit(null);
    setAdminModalMode("add");
    setIsSecretAdminOpen((prev) => (adminModalMode === "add" && prev ? false : true));
  }, [adminModalMode]);

  // Open "Edit Current Artwork" mode (Ctrl + 12 / Ctrl + F12)
  const openEditModal = useCallback((artwork) => {
    const target = artwork || activeArtwork;
    setArtworkToEdit(target);
    setAdminModalMode("edit");
    setIsSecretAdminOpen((prev) => (adminModalMode === "edit" && prev ? false : true));
  }, [activeArtwork, adminModalMode]);

  // Keyboard navigation & Shortcuts for Ctrl+11 (Add) vs Ctrl+12 (Edit)
  const handleKeyDown = useCallback(
    (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // 1. ADD NEW ARTWORK: Ctrl + F11 OR Ctrl + 11 OR Ctrl + 1
      if (
        (isCtrlOrCmd && (e.key === "F11" || e.code === "F11")) ||
        (isCtrlOrCmd && e.key === "1") ||
        e.key === "F11"
      ) {
        e.preventDefault();
        openAddModal();
        return;
      }

      // 2. EDIT CURRENT ARTWORK: Ctrl + F12 OR Ctrl + 12 OR Ctrl + 2
      if (
        (isCtrlOrCmd && (e.key === "F12" || e.code === "F12")) ||
        (isCtrlOrCmd && e.key === "2") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        openEditModal();
        return;
      }

      // Slide Navigation
      if (e.key === "ArrowRight" && !isSecretAdminOpen && !selectedArtwork) {
        handleNext();
      } else if (e.key === "ArrowLeft" && !isSecretAdminOpen && !selectedArtwork) {
        handlePrev();
      }
    },
    [handleNext, handlePrev, isSecretAdminOpen, selectedArtwork, openAddModal, openEditModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 45;
    const swipeVelocity = 250;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      handlePrev();
    }
  };

  // When artwork is added via Ctrl+11
  const handleArtworkAdded = (newArtwork) => {
    setArtworks((prev) => [newArtwork, ...prev]);
    setCurrentIndex(0);
    setSelectedArtwork(newArtwork);
  };

  // When artwork is updated via Ctrl+12
  const handleArtworkSaved = (savedItem) => {
    setArtworks((prev) => {
      const idx = prev.findIndex((a) => a.id === savedItem.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = savedItem;
        return next;
      }
      return [savedItem, ...prev];
    });
  };

  const handleDownload = (artwork) => {
    if (!artwork || !artwork.img) return;
    try {
      const link = document.createElement("a");
      link.href = artwork.img;
      const cleanTitle = (artwork.title || "artwork").replace(/[^a-zA-Z0-9_-]/g, "_");
      link.download = `${cleanTitle}_Tharusha_Deneth.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(artwork.img, "_blank");
    }
  };

  if (!activeArtwork) return null;

  const currentBgColor = isLight ? "#f8fafc" : (activeArtwork.solidBg || "#0c0418");
  const currentBgGradient = isLight
    ? "radial-gradient(circle at 50% 25%, rgba(216, 180, 254, 0.22) 0%, transparent 65%)"
    : (activeArtwork.bgGradient || "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(168, 85, 247, 0.38) 0%, transparent 75%)");

  const progressFraction = (currentIndex + 1) / total;

  return (
    <section className="creative-portfolio-root font-geist" id="creative">
      {/* 1. START: Top Animated RGB Chromatic Glowing Divider Line */}
      <div className="rgb-glow-divider rgb-glow-top">
        <div className="rgb-glow-line" />
        <div className="rgb-glow-aura" />
      </div>

      <div 
        className="creative-stage-screen"
        style={{
          backgroundColor: currentBgColor,
        }}
      >
        {/* Dynamic Multi-Color Ambient Radial Glow */}
        <div 
          className="creative-ambient-bg" 
          style={{ background: currentBgGradient }} 
        />

        {/* Top Glowing Scroll Progress Track */}
        <div className="cTopProgressTrack">
          <div 
            className="cTopProgressBar" 
            style={{ 
              transform: `scaleX(${progressFraction})`,
              background: `linear-gradient(90deg, #c084fc, ${activeArtwork.accent || "#f43f5e"})`,
              boxShadow: `0 0 16px ${activeArtwork.accentGlow || "rgba(192, 132, 252, 0.6)"}`,
            }} 
          />
        </div>

        {/* Cinematic Vignette Edges */}
        <div className="c-edge-vignette c-edge-left" />
        <div className="c-edge-vignette c-edge-right" />

        {/* Top Status Bar with Dedicated Shortcut Actions */}
        <div className="cTopBar">
          <div className="cKickerPill">
            <span 
              className="pKickerDot" 
              style={{ 
                background: activeArtwork.accent || "#c084fc",
                boxShadow: `0 0 10px ${activeArtwork.accent || "#c084fc"}`
              }} 
            />
            <span>03 / GRAPHIC DESIGN SECTION</span>
          </div>
        </div>

        {/* Floating Cinema Arrow Buttons */}
        <button
          type="button"
          className="cNavArrowBtn prev"
          onClick={handlePrev}
          aria-label="Previous artwork"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          className="cNavArrowBtn next"
          onClick={handleNext}
          aria-label="Next artwork"
        >
          <ChevronRight size={22} />
        </button>

        {/* Main Artwork Stage Item - Exact 1:1 Layout of Portfolio.jsx */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeArtwork.id || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            className="cItem"
          >
            {/* 1. Left (Desktop) / Top (Mobile): Standalone Image Frame */}
            <div className="cImgWrapper">
              <div
                className="cImg"
                onClick={() => setSelectedArtwork(activeArtwork)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedArtwork(activeArtwork);
                  }
                }}
                aria-label={`Open full preview for ${activeArtwork.title}`}
                style={{
                  boxShadow: `0 28px 65px -12px rgba(0, 0, 0, 0.88), 0 0 34px ${activeArtwork.accentGlow || "rgba(192, 132, 252, 0.45)"}`,
                  borderColor: "rgba(255, 255, 255, 0.16)",
                }}
              >
                <img
                  src={activeArtwork.img}
                  alt={activeArtwork.title}
                  draggable={false}
                  loading="lazy"
                />

                {/* Dynamic Specular Sheen Light Sweep */}
                <motion.div
                  className="cImgShine"
                  initial={{ x: "-120%", opacity: 0 }}
                  animate={{ x: ["-120%", "240%"], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 1.1, delay: 0.1, ease: "easeInOut" }}
                />

                <div className="cImgGloss" />

                {/* Top-Right Format / Artwork Badge */}
                <div className="cImgBadge">
                  <span
                    className="cImgBadgeDot"
                    style={{
                      background: activeArtwork.accent || "#c084fc",
                      boxShadow: `0 0 8px ${activeArtwork.accent || "#c084fc"}`,
                    }}
                  />
                  <span>{activeArtwork.format ? `${activeArtwork.format} ARTWORK` : "ARTWORK"}</span>
                </div>

                {/* Hover Quick Preview Hint */}
                <div className="cImgHoverHint">
                  <Eye size={13} />
                  <span>Click for Full Preview</span>
                </div>
              </div>
            </div>

            {/* 2. Right (Desktop) / Underneath (Mobile): Standalone Details */}
            <div className="cText">
              {/* Category & Index Header */}
              <div className="cBadge" style={{ color: activeArtwork.accent || "#c084fc" }}>
                <span
                  className="cBadgeDot"
                  style={{
                    background: activeArtwork.accent || "#c084fc",
                    boxShadow: `0 0 10px ${activeArtwork.accent || "#c084fc"}`,
                  }}
                />
                <span className="cBadgeIndex">{activeArtwork.indexStr || String(currentIndex + 1).padStart(2, "0")}</span>
                <span className="cBadgeDivider">/</span>
                <span className="cBadgeCategory">{activeArtwork.category?.toUpperCase()}</span>
              </div>

              {/* Title */}
              <h1
                className="cTitle"
                onClick={() => setSelectedArtwork(activeArtwork)}
              >
                {activeArtwork.title}
              </h1>

              {/* Software / Tools Chips */}
              <div className="cTags">
                {activeArtwork.tools?.map((tool, idx) => (
                  <span key={idx} className="cTag">
                    <Sparkles
                      className="cTagIcon"
                      style={{ color: activeArtwork.accent || "#c084fc" }}
                    />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="cDesc">{activeArtwork.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Dots & Swipe Hint */}
        <div className="cBottomControls">
          <div className="cDotsRow">
            {artworks.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`cNavDot ${idx === currentIndex ? "active" : ""}`}
                style={
                  idx === currentIndex
                    ? {
                        background: activeArtwork.accent || "#ffffff",
                        boxShadow: `0 0 12px ${activeArtwork.accent || "#ffffff"}`,
                      }
                    : {}
                }
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to artwork ${idx + 1}`}
              />
            ))}
          </div>

          <div className="cGestureHint">
            <Waves size={13} style={{ color: activeArtwork.accent || "#c084fc" }} />
            <span>Drag or swipe left/right to explore artworks</span>
          </div>
        </div>
      </div>

      {/* 2. END: Bottom Animated RGB Chromatic Glowing Divider Line */}
      <div className="rgb-glow-divider rgb-glow-bottom">
        <div className="rgb-glow-line" />
        <div className="rgb-glow-aura" />
      </div>

      {/* Full-Frame Pop-up Modal (Public view with high-res & circular animated download button) */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onDownload={handleDownload}
        />
      )}

      {/* Dedicated Admin Modal: Add New (Ctrl+11) vs Edit Current (Ctrl+12) */}
      <SecretAdminModal
        isOpen={isSecretAdminOpen}
        mode={adminModalMode}
        artworkToEdit={artworkToEdit}
        onClose={() => {
          setIsSecretAdminOpen(false);
          setArtworkToEdit(null);
        }}
        onArtworkAdded={handleArtworkAdded}
        onArtworkSaved={handleArtworkSaved}
      />
    </section>
  );
}
