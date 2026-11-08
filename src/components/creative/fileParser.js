import { readPsd, initializeCanvas } from "ag-psd";

// Initialize ag-psd in browser DOM if window is available
if (typeof window !== "undefined" && typeof document !== "undefined") {
  try {
    initializeCanvas((width, height) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    });
  } catch {
    // Canvas already initialized or server environment
  }
}

/**
 * Format bytes to readable string (e.g. "2.4 MB")
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Extract embedded XMP base64 thumbnail from AI / PSD files
 */
function extractXmpThumbnail(buffer) {
  try {
    const uint8 = new Uint8Array(buffer);
    // Scan as binary latin1 string
    const chunkLimit = Math.min(uint8.length, 1024 * 1024 * 4); // scan up to first 4MB for XMP packet
    const text = new TextDecoder("latin1").decode(uint8.subarray(0, chunkLimit));

    // Look for <xmpGImg:image>...base64...</xmpGImg:image>
    const xmpImgMatch = text.match(/<xmpGImg:image>([\s\S]*?)<\/xmpGImg:image>/i);
    if (xmpImgMatch && xmpImgMatch[1]) {
      const cleanBase64 = xmpImgMatch[1].replace(/[\r\n\t\s]+/g, "");
      if (cleanBase64.length > 50) {
        return `data:image/jpeg;base64,${cleanBase64}`;
      }
    }

    // Look for <photoshop:Thumbnail>...base64...</photoshop:Thumbnail>
    const photoThumbMatch = text.match(/<photoshop:Thumbnail>([\s\S]*?)<\/photoshop:Thumbnail>/i);
    if (photoThumbMatch && photoThumbMatch[1]) {
      const cleanBase64 = photoThumbMatch[1].replace(/[\r\n\t\s]+/g, "");
      if (cleanBase64.length > 50) {
        return `data:image/jpeg;base64,${cleanBase64}`;
      }
    }

    // Look for raw embedded JPEG marker in PDF/AI stream: \xFF\xD8\xFF\xE0 ... \xFF\xD9
    const startIdx = text.indexOf("\xFF\xD8\xFF");
    if (startIdx !== -1) {
      const endIdx = text.indexOf("\xFF\xD9", startIdx + 4);
      if (endIdx !== -1 && endIdx - startIdx > 200) {
        const jpegBytes = uint8.slice(startIdx, endIdx + 2);
        const blob = new Blob([jpegBytes], { type: "image/jpeg" });
        return URL.createObjectURL(blob);
      }
    }
  } catch (err) {
    console.warn("XMP thumbnail extraction error:", err);
  }
  return null;
}

/**
 * Generate a stylized high-res vector card preview when no composite pixel image exists
 */
function createFallbackGraphicCard(fileName, formatType, fileSizeStr, colorTheme = "#ff9a00") {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Dark gradient background
  const bg = ctx.createLinearGradient(0, 0, 1600, 1000);
  bg.addColorStop(0, "#100c1e");
  bg.addColorStop(0.5, "#18132b");
  bg.addColorStop(1, "#0a0714");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1600, 1000);

  // Subtle grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < 1600; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1000);
    ctx.stroke();
  }
  for (let y = 0; y < 1000; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1600, y);
    ctx.stroke();
  }

  // Glowing center badge
  const centerGlow = ctx.createRadialGradient(800, 480, 50, 800, 480, 400);
  centerGlow.addColorStop(0, colorTheme === "#ff9a00" ? "rgba(255, 154, 0, 0.25)" : "rgba(56, 189, 248, 0.25)");
  centerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(400, 100, 800, 800);

  // Rounded icon frame
  const iconX = 680;
  const iconY = 320;
  const iconSize = 240;
  ctx.fillStyle = "rgba(20, 15, 35, 0.85)";
  ctx.strokeStyle = colorTheme;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(iconX, iconY, iconSize, iconSize, 36);
  ctx.fill();
  ctx.stroke();

  // Format Letter in badge (e.g. Ai or Ps)
  ctx.fillStyle = colorTheme;
  ctx.font = "bold 96px Geist, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(formatType === "AI" ? "Ai" : formatType === "PSD" ? "Ps" : formatType, 800, 440);

  // File Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px Geist, sans-serif";
  ctx.fillText(fileName, 800, 640);

  // Format metadata
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 28px Geist, sans-serif";
  const subtitle = formatType === "AI" 
    ? `Adobe Illustrator Vector Artwork · ${fileSizeStr}` 
    : formatType === "PSD" 
    ? `Photoshop Master Document · ${fileSizeStr}` 
    : `Design Artwork File · ${fileSizeStr}`;
  ctx.fillText(subtitle, 800, 710);

  // Status pill
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(620, 760, 360, 54, 27);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 20px Geist, sans-serif";
  ctx.fillText("✓ DESIGN ASSET READY", 800, 794);

  return canvas.toDataURL("image/png");
}

/**
 * Universal Art File Parser
 * Detects AI, PSD, SVG, PNG, JPG, WEBP, GIF and produces high-quality live preview
 */
export async function parseArtFile(file) {
  if (!file) throw new Error("No file provided");

  const fileName = file.name || "artwork";
  const fileExt = fileName.split(".").pop().toLowerCase();
  const fileSizeStr = formatBytes(file.size);

  // 1. Scalable Vector Graphics (SVG)
  if (fileExt === "svg" || file.type === "image/svg+xml") {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          format: "SVG",
          formatLabel: "Scalable Vector Graphics (.svg)",
          previewUrl: e.target.result,
          fileName,
          fileSizeStr,
          softwareTag: "Adobe Illustrator",
          accentColor: "#f59e0b",
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // 2. Standard Web Rasters (PNG, JPG, JPEG, WEBP, GIF, BMP)
  if (
    ["png", "jpg", "jpeg", "webp", "gif", "bmp"].includes(fileExt) ||
    file.type.startsWith("image/")
  ) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let detected = fileExt.toUpperCase();
        if (detected === "JPEG") detected = "JPG";
        resolve({
          format: detected,
          formatLabel: `${detected} High-Res Graphic (.${fileExt})`,
          previewUrl: e.target.result,
          fileName,
          fileSizeStr,
          softwareTag: detected === "PNG" ? "Photoshop" : "Adobe Photoshop",
          accentColor: detected === "PNG" ? "#38bdf8" : "#c084fc",
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // 3. Photoshop Document (.psd)
  if (fileExt === "psd" || file.type.includes("photoshop") || file.type.includes("psd")) {
    const arrayBuffer = await file.arrayBuffer();

    // Strategy A: Render composite via ag-psd
    try {
      const psd = readPsd(arrayBuffer, { skipLayerImageData: false });
      if (psd && psd.canvas) {
        const previewUrl = psd.canvas.toDataURL("image/png");
        return {
          format: "PSD",
          formatLabel: "Adobe Photoshop Master Document (.psd)",
          previewUrl,
          fileName,
          fileSizeStr,
          dimensions: `${psd.width} × ${psd.height} px`,
          softwareTag: "Adobe Photoshop",
          accentColor: "#38bdf8",
        };
      }
    } catch (err) {
      console.warn("ag-psd full render attempt failed, trying XMP extraction:", err);
    }

    // Strategy B: Embedded XMP thumbnail
    const xmpPreview = extractXmpThumbnail(arrayBuffer);
    if (xmpPreview) {
      return {
        format: "PSD",
        formatLabel: "Adobe Photoshop Document (.psd)",
        previewUrl: xmpPreview,
        fileName,
        fileSizeStr,
        softwareTag: "Adobe Photoshop",
        accentColor: "#38bdf8",
      };
    }

    // Strategy C: High-fidelity Vector Fallback Card
    return {
      format: "PSD",
      formatLabel: "Adobe Photoshop Document (.psd)",
      previewUrl: createFallbackGraphicCard(fileName, "PSD", fileSizeStr, "#38bdf8"),
      fileName,
      fileSizeStr,
      softwareTag: "Adobe Photoshop",
      accentColor: "#38bdf8",
    };
  }

  // 4. Adobe Illustrator (.ai)
  if (fileExt === "ai" || file.type.includes("illustrator") || file.type.includes("postscript")) {
    const arrayBuffer = await file.arrayBuffer();

    // Strategy A: Embedded XMP composite preview (standard in Illustrator)
    const xmpPreview = extractXmpThumbnail(arrayBuffer);
    if (xmpPreview) {
      return {
        format: "AI",
        formatLabel: "Adobe Illustrator Vector Artwork (.ai)",
        previewUrl: xmpPreview,
        fileName,
        fileSizeStr,
        softwareTag: "Adobe Illustrator",
        accentColor: "#ff9a00",
      };
    }

    // Strategy B: If file is PDF-compatible, read as PDF page or fallback
    return {
      format: "AI",
      formatLabel: "Adobe Illustrator Vector Artwork (.ai)",
      previewUrl: createFallbackGraphicCard(fileName, "AI", fileSizeStr, "#ff9a00"),
      fileName,
      fileSizeStr,
      softwareTag: "Adobe Illustrator",
      accentColor: "#ff9a00",
    };
  }

  // 5. Fallback for any other file type
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        format: fileExt.toUpperCase(),
        formatLabel: `${fileExt.toUpperCase()} Artwork File`,
        previewUrl: e.target.result,
        fileName,
        fileSizeStr,
        softwareTag: "Graphic Design",
        accentColor: "#c084fc",
      });
    };
    reader.onerror = () => {
      resolve({
        format: fileExt.toUpperCase(),
        formatLabel: `${fileExt.toUpperCase()} Artwork File`,
        previewUrl: createFallbackGraphicCard(fileName, fileExt.toUpperCase(), fileSizeStr, "#c084fc"),
        fileName,
        fileSizeStr,
        softwareTag: "Graphic Design",
        accentColor: "#c084fc",
      });
    };
    reader.readAsDataURL(file);
  });
}
