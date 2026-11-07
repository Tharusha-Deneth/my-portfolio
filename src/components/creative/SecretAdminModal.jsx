import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Check, Plus, Edit3, ShieldCheck, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { updateStoredArtwork, SOFTWARE_SUGGESTIONS } from "./creativeData";

export default function SecretAdminModal({ isOpen, onClose, onArtworkSaved, artworkToEdit }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Logos & Emblems");
  const [client, setClient] = useState("Freelance Commission");
  const [description, setDescription] = useState("");
  const [selectedTools, setSelectedTools] = useState(["Adobe Illustrator", "Photoshop"]);
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state whenever artworkToEdit or isOpen changes
  useEffect(() => {
    if (artworkToEdit) {
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
    } else {
      setPreviewImage(null);
      setTitle("");
      setCategory("Logos & Emblems");
      setClient("Freelance Commission");
      setDescription("");
      setSelectedTools(["Adobe Illustrator", "Photoshop"]);
    }
    setTagInput("");
    setSuggestions([]);
  }, [artworkToEdit, isOpen]);

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

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!previewImage) {
      alert("Please drop or select an artwork image.");
      return;
    }

    setIsSaving(true);
    const itemToSave = {
      ...(artworkToEdit || {}),
      id: artworkToEdit ? artworkToEdit.id : `custom-${Date.now()}`,
      title: title || (artworkToEdit?.title || "Creative Artwork"),
      category: category || (artworkToEdit?.category || "Graphic Design"),
      categoryKey: category.toLowerCase().replace(/[^a-z]/g, ""),
      img: previewImage,
      tools: selectedTools.length ? selectedTools : ["Adobe Photoshop"],
      year: artworkToEdit?.year || new Date().getFullYear().toString(),
      dimensions: artworkToEdit?.dimensions || "High Resolution Artwork",
      client: client || "Client Commission",
      accent: artworkToEdit?.accent || "#c084fc",
      accentGlow: artworkToEdit?.accentGlow || "rgba(192, 132, 252, 0.45)",
      solidBg: artworkToEdit?.solidBg || "#0c0418",
      bgGradient:
        artworkToEdit?.bgGradient ||
        "radial-gradient(ellipse 65% 60% at 30% 50%, rgba(168, 85, 247, 0.38) 0%, transparent 75%)",
      desc: description || (artworkToEdit?.desc || ""),
    };

    updateStoredArtwork(itemToSave);
    setIsSaving(false);
    if (onArtworkSaved) {
      onArtworkSaved(itemToSave);
    }
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = Boolean(artworkToEdit);

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
              <Edit3 size={15} style={{ color: "#38bdf8" }} />
              <span>
                {isEditing
                  ? `Edit Artwork (${artworkToEdit.indexStr || "01"} / ${artworkToEdit.category})`
                  : "Add New Artwork"}
              </span>
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
            {/* Image Preview / Drag & Drop Zone */}
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
                <UploadCloud size={38} className="secret-dropzone-icon" />
                <h4 className="secret-dropzone-title">Drop your new high-res artwork here</h4>
                <p className="secret-dropzone-sub">Supports PNG, JPG, WebP and SVG formats</p>

                <button
                  type="button"
                  className="secret-browse-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <ImageIcon size={14} />
                  <span>Choose Photo File</span>
                </button>
              </div>
            ) : (
              /* Staging Thumb preview */
              <div className="secret-preview-strip">
                <img src={previewImage} alt="Staging Preview" className="secret-thumb-img" />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#10b981",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>{isEditing ? "Current Artwork Photo Loaded" : "Photo Loaded & Locked"}</span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#94a3b8" }}>
                    Click &ldquo;Replace Photo&rdquo; to drop a new image.
                  </p>
                </div>
                <button
                  type="button"
                  className="secret-change-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace Photo
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processFile(e.target.files[0]);
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
                  placeholder="Type tool name (e.g. Adobe Photoshop, Illustrator, Figma)..."
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
                disabled={isSaving}
                className="secret-publish-btn"
              >
                <Check size={16} />
                <span>
                  {isSaving
                    ? "Updating..."
                    : isEditing
                    ? "Update Artwork (අප්ඩේට් කරන්න)"
                    : "Publish to Showcase"}
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
