import { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  X, 
  Check, 
  Plus, 
  Edit3, 
  Sparkles, 
  Image as ImageIcon,
  Loader2,
  Layers,
  FileCode,
  FolderPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { updateStoredArtwork, SOFTWARE_SUGGESTIONS } from "./creativeData";
import { parseArtFile } from "./fileParser";

export default function SecretAdminModal({ 
  isOpen, 
  mode = "edit", // "add" or "edit"
  artworkToEdit, 
  onClose, 
  onArtworkAdded, 
  onArtworkSaved 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [detectedFormat, setDetectedFormat] = useState(null);
  const [formatLabel, setFormatLabel] = useState("");
  const [fileMeta, setFileMeta] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Logos & Emblems");
  const [client, setClient] = useState("Freelance Commission");
  const [description, setDescription] = useState("");
  const [selectedTools, setSelectedTools] = useState(["Adobe Illustrator", "Photoshop"]);
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const isEditing = mode === "edit" && Boolean(artworkToEdit);

  // Sync state when modal opens or target artwork changes
  useEffect(() => {
    if (isEditing && artworkToEdit) {
      setPreviewImage(artworkToEdit.img || null);
      setTitle(artworkToEdit.title || "");
      setCategory(artworkToEdit.category || "Logos & Emblems");
      setClient(artworkToEdit.client || "Client Commission");
      setDescription(artworkToEdit.desc || "");
      setSelectedTools(
        Array.isArray(artworkToEdit.tools) && artworkToEdit.tools.length > 0
          ? artworkToEdit.tools
          : ["Adobe Illustrator", "Photoshop"]
      );
      // Determine format from existing image or category
      const fmt = artworkToEdit.format || (artworkToEdit.title?.toLowerCase().includes("emblem") ? "AI" : "PNG");
      setDetectedFormat(fmt);
      setFormatLabel(artworkToEdit.dimensions || "High Resolution Artwork");
      setFileMeta({
        name: artworkToEdit.title,
        size: "High Definition",
      });
    } else {
      // Add New Mode
      setPreviewImage(null);
      setDetectedFormat(null);
      setFormatLabel("");
      setFileMeta(null);
      setTitle("");
      setCategory("Logos & Emblems");
      setClient("Freelance Commission");
      setDescription("");
      setSelectedTools(["Adobe Illustrator", "Photoshop"]);
    }
    setTagInput("");
    setSuggestions([]);
  }, [isEditing, artworkToEdit, isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live autocomplete filtering
  useEffect(() => {
    if (!tagInput.trim()) {
      setSuggestions([]);
      return;
    }
    const q = tagInput.toLowerCase().trim();
    const matches = SOFTWARE_SUGGESTIONS.filter(
      (s) => s.toLowerCase().includes(q) && !selectedTools.includes(s)
    );
    setSuggestions(matches);
  }, [tagInput, selectedTools]);

  const addTool = (toolName) => {
    const clean = toolName.trim();
    if (clean && !selectedTools.includes(clean)) {
      setSelectedTools((prev) => [...prev, clean]);
    }
    setTagInput("");
    setSuggestions([]);
  };

  const removeTool = (toolName) => {
    setSelectedTools((prev) => prev.filter((t) => t !== toolName));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (suggestions.length > 0) {
        addTool(suggestions[0]);
      } else if (tagInput.trim()) {
        addTool(tagInput);
      }
    }
  };

  // Process any art file (AI, PSD, SVG, PNG, JPG, WEBP)
  const processArtFile = async (file) => {
    if (!file) return;

    setIsParsing(true);
    try {
      const parsed = await parseArtFile(file);
      setPreviewImage(parsed.previewUrl);
      setDetectedFormat(parsed.format);
      setFormatLabel(parsed.formatLabel);
      setFileMeta({
        name: parsed.fileName,
        size: parsed.fileSizeStr,
        dimensions: parsed.dimensions,
      });

      // Auto-set title if empty
      if (!title) {
        const cleanName = parsed.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      // Auto-add appropriate tool tag
      if (parsed.softwareTag && !selectedTools.includes(parsed.softwareTag)) {
        setSelectedTools((prev) => [parsed.softwareTag, ...prev]);
      }
    } catch (err) {
      console.error("Failed to parse art file:", err);
      alert("Error reading file. Please try another image or document.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processArtFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!previewImage) {
      alert("Please upload or drop an artwork file (AI, PSD, SVG, PNG, or JPG).");
      return;
    }

    setIsSaving(true);

    if (isEditing) {
      // MODE: EDIT EXISTING ARTWORK (Ctrl+12)
      const updatedArtwork = {
        ...artworkToEdit,
        title: title || artworkToEdit.title,
        category: category || artworkToEdit.category,
        categoryKey: category.toLowerCase().replace(/[^a-z]/g, ""),
        img: previewImage,
        format: detectedFormat || artworkToEdit.format || "PNG",
        tools: selectedTools.length ? selectedTools : artworkToEdit.tools,
        client: client || artworkToEdit.client,
        desc: description || artworkToEdit.desc,
      };

      updateStoredArtwork(updatedArtwork);
      setIsSaving(false);
      if (onArtworkSaved) {
        onArtworkSaved(updatedArtwork);
      }
      onClose();
    } else {
      // MODE: ADD NEW ARTWORK (Ctrl+11)
      const newArtwork = {
        id: `custom-${Date.now()}`,
        title: title || "New Creative Showcase Project",
        category: category || "Logos & Emblems",
        categoryKey: category.toLowerCase().replace(/[^a-z]/g, ""),
        img: previewImage,
        format: detectedFormat || "PNG",
        tools: selectedTools.length ? selectedTools : ["Adobe Illustrator", "Photoshop"],
        year: new Date().getFullYear().toString(),
        dimensions: fileMeta?.dimensions || "3840 × 2160 px",
        client: client || "Freelance Commission",
        accent: detectedFormat === "AI" ? "#ff9a00" : detectedFormat === "PSD" ? "#38bdf8" : "#c084fc",
        accentGlow: "rgba(192, 132, 252, 0.45)",
        solidBg: "#0c0418",
        bgGradient: "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(168, 85, 247, 0.38) 0%, transparent 75%)",
        desc: description || `Professional graphic artwork created with ${selectedTools.join(", ")}.`,
      };

      updateStoredArtwork(newArtwork);
      setIsSaving(false);
      if (onArtworkAdded) {
        onArtworkAdded(newArtwork);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="secret-admin-modal-backdrop" onClick={onClose}>
        <motion.div
          className="secret-admin-modal-dialog"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 240 }}
        >
          {/* Header */}
          <div className="secret-admin-header">
            <div className="secret-admin-badge">
              {isEditing ? (
                <>
                  <Edit3 size={15} style={{ color: "#38bdf8" }} />
                  <span>
                    Edit Artwork · {artworkToEdit?.indexStr || "01"} / {artworkToEdit?.category}
                  </span>
                </>
              ) : (
                <>
                  <FolderPlus size={16} style={{ color: "#4ade80" }} />
                  <span style={{ color: "#4ade80" }}>
                    Add New Project Artwork
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              className="secret-admin-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="secret-admin-form">
            {/* High-Resolution Artwork Stage / Dropzone */}
            {!previewImage ? (
              <div
                className={`secret-dropzone ${isDragging ? "active" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {isParsing ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 0" }}>
                    <Loader2 size={36} className="animate-spin" style={{ color: "#38bdf8" }} />
                    <p style={{ color: "#38bdf8", fontWeight: 700, margin: 0 }}>
                      Detecting format &amp; rendering high-res preview...
                    </p>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={40} className="secret-dropzone-icon" />
                    <h4 className="secret-dropzone-title">
                      Drop Illustrator (.ai), Photoshop (.psd), SVG, or PNG/JPG here
                    </h4>
                    <p className="secret-dropzone-sub">
                      Auto-detects AI, PSD, SVG, WebP, PNG &amp; JPG formats with live full quality rendering
                    </p>

                    <button
                      type="button"
                      className="secret-browse-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <ImageIcon size={14} />
                      <span>Browse Art File</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* High-Resolution Artwork Preview Box */
              <div 
                className="modal-artwork-stage"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <img 
                  src={previewImage} 
                  alt={title || "Artwork Preview"} 
                  className="modal-artwork-stage-img" 
                />

                {/* Detected Format Badge */}
                {detectedFormat && (
                  <span className={`modal-format-badge ${detectedFormat.toLowerCase()}`}>
                    <FileCode size={12} />
                    <span>{detectedFormat} · {formatLabel || "Live Artwork Asset"}</span>
                  </span>
                )}

                {/* Bottom Overlay Bar with File Info & Replace Button */}
                <div className="modal-stage-overlay-bar">
                  <div className="modal-stage-file-info">
                    <span className="modal-stage-filename">
                      {fileMeta?.name || title || "Artwork File"}
                    </span>
                    <span className="modal-stage-filesize">
                      {fileMeta?.size || "High-Res"} {fileMeta?.dimensions ? `· ${fileMeta.dimensions}` : ""}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="modal-stage-replace-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud size={13} />
                    <span>Replace / Choose File</span>
                  </button>
                </div>

                {isParsing && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    color: "#38bdf8",
                    fontWeight: 700,
                    zIndex: 10
                  }}>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Parsing Art Stream...</span>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".ai,.psd,.svg,.png,.jpg,.jpeg,.webp,.gif,.bmp,image/*,application/illustrator,application/postscript,image/vnd.adobe.photoshop"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processArtFile(e.target.files[0]);
                }
              }}
            />

            {/* Inputs Grid */}
            <div className="secret-inputs-grid">
              <div>
                <label className="secret-label">Artwork Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Monogram & Brand Guideline"
                  className="secret-input"
                />
              </div>

              <div>
                <label className="secret-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="secret-input"
                >
                  <option value="Logos & Emblems">Logos & Emblems</option>
                  <option value="Banners & Posters">Banners & Posters</option>
                  <option value="Packaging & Labels">Packaging & Labels</option>
                  <option value="Social Media Posts">Social Media Posts</option>
                  <option value="Brand Identity Systems">Brand Identity Systems</option>
                </select>
              </div>

              <div>
                <label className="secret-label">Client or Brand</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Freelance Client / Brand"
                  className="secret-input"
                />
              </div>
            </div>

            <div>
              <label className="secret-label">Description &amp; Concept</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the design thinking, typography, and concept..."
                className="secret-input"
                style={{ resize: "none" }}
              />
            </div>

            {/* Software Tools with Live Autocomplete */}
            <div>
              <label className="secret-label">
                Software Tools (Interactive YouTube-style Tags with Autocomplete)
              </label>

              {/* Tag Chips list */}
              <div className="secret-chips-wrap">
                {selectedTools.map((tool) => (
                  <span key={tool} className="secret-tag-chip">
                    <Layers size={11} />
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      className="secret-tag-remove"
                      aria-label={`Remove ${tool}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag Input with live dropdown */}
              <div style={{ position: "relative", marginTop: 8 }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Type tool name (e.g. Adobe Illustrator, Photoshop, Figma, InDesign)..."
                  className="secret-input"
                />

                {/* Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                  <div className="secret-autocomplete-dropdown">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="secret-autocomplete-item"
                        onClick={() => addTool(suggestion)}
                      >
                        <Sparkles size={13} style={{ color: "#c084fc" }} />
                        <span>{suggestion}</span>
                        <Plus size={13} style={{ marginLeft: "auto", opacity: 0.6 }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                disabled={isSaving || isParsing}
                className="secret-publish-btn"
                style={
                  !isEditing
                    ? { background: "#4ade80", color: "#052e16" }
                    : {}
                }
              >
                <Check size={16} />
                <span>
                  {isSaving
                    ? "Saving..."
                    : isEditing
                    ? "Update Artwork"
                    : "Publish Artwork"}
                </span>
              </button>

              <button
                type="button"
                className="secret-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
