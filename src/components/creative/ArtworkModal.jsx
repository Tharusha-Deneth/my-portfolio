import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Layers } from "lucide-react";
import CircularDownloadBtn from "./CircularDownloadBtn";

export default function ArtworkModal({ artwork, onClose, onDownload }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!artwork) return null;

  return (
    <AnimatePresence>
      <div 
        className="artwork-full-modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          className="artwork-full-modal-shell"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
        >
          {/* Top Floating Close Bar */}
          <div className="artwork-modal-header-bar">
            <div className="artwork-modal-pill-tag">
              <Sparkles size={12} />
              <span>{artwork.category}</span>
            </div>

            <button 
              type="button" 
              className="artwork-modal-close-round" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Full-Frame Visual Showcase */}
          <div className="artwork-modal-image-stage">
            <img 
              src={artwork.img} 
              alt={artwork.title} 
              className="artwork-modal-full-img" 
            />
          </div>

          {/* Blurred Frosted Glass Information Layer on Bottom */}
          <div className="artwork-modal-blurred-overlay">
            <div className="artwork-modal-text-content">
              <div className="artwork-modal-meta-row">
                <span className="artwork-modal-index">{artwork.indexStr || "01"}</span>
                <span className="artwork-modal-divider">/</span>
                <span className="artwork-modal-client">{artwork.client || "Client Work"}</span>
                <span aria-hidden="true">·</span>
                <span>{artwork.year || "2024"}</span>
                {artwork.dimensions && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="artwork-modal-dims">{artwork.dimensions}</span>
                  </>
                )}
              </div>

              <h2 className="artwork-modal-title">{artwork.title}</h2>
              <p className="artwork-modal-desc">{artwork.desc}</p>

              {/* Tools chips */}
              <div className="artwork-modal-tools-chips">
                {artwork.tools?.map((tool, idx) => (
                  <span key={idx} className="artwork-modal-tool-badge">
                    <Layers size={11} />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Circular Animated Download Button (No "Download" text word!) */}
            <div className="artwork-modal-action-zone">
              <div className="artwork-modal-download-box">
                <CircularDownloadBtn
                  artwork={artwork}
                  onDownload={onDownload}
                  size={56}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
