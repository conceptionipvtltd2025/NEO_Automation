import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Star, Link2 } from "lucide-react";

/**
 * Reads an image File and returns a compressed JPEG data URL, downscaled to
 * `maxDim` on its longest edge. Keeps uploaded/pasted images small enough to
 * persist in localStorage (the catalog has no backend yet).
 */
async function fileToDataURL(file: File, maxDim = 1200, quality = 0.8): Promise<string> {
  const original = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
  return await new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const longest = Math.max(width, height);
      if (longest > maxDim) {
        const s = maxDim / longest;
        width = Math.round(width * s);
        height = Math.round(height * s);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(original);
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(original);
      }
    };
    img.onerror = () => resolve(original);
    img.src = original;
  });
}

export function ImageInput({
  value,
  onChange,
  max,
}: {
  value: string[];
  onChange: (imgs: string[]) => void;
  /** Cap the number of images. `max={1}` = single-image mode (new replaces old). */
  max?: number;
}) {
  const commit = (next: string[]) => onChange(max ? next.slice(-max) : next);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // ref so the global paste handler always appends to the latest list
  const valueRef = useRef(value);
  valueRef.current = value;

  const addFiles = async (files: FileList | File[]) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(imgs.map((f) => fileToDataURL(f)));
      commit([...valueRef.current, ...urls]);
    } finally {
      setBusy(false);
    }
  };

  // Paste an image anywhere in the form (Ctrl+V). Ignores plain-text pastes so
  // it never interferes with typing into the other fields.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const it of items) {
        if (it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length) {
        e.preventDefault();
        addFiles(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const makeCover = (i: number) => {
    if (i === 0) return;
    const next = [...value];
    const [img] = next.splice(i, 1);
    next.unshift(img);
    onChange(next);
  };
  const addUrl = () => {
    const u = url.trim();
    if (!u) return;
    commit([...value, u]);
    setUrl("");
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-ink-800"
            >
              <img src={src} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && value.length > 1 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-neo-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-pure">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink-950/65 opacity-0 transition group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(i)}
                    title="Set as cover"
                    className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-white transition hover:bg-white/25"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  title="Remove image"
                  className="grid h-7 w-7 place-items-center rounded-lg bg-red-600/85 text-white transition hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / drop / paste zone */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-5 text-center outline-none transition hover:border-neo-600/40 hover:bg-white/[0.04] focus-visible:border-neo-600/60"
      >
        <UploadCloud className="h-5 w-5 text-steel-300" />
        <p className="text-xs text-steel-300">
          {busy ? (
            "Processing image…"
          ) : (
            <>
              <span className="font-semibold text-white">Click to upload</span>, drag &amp; drop, or paste (Ctrl+V)
            </>
          )}
        </p>
        <p className="text-[10px] text-steel-500">PNG, JPG or WebP — auto-resized for the web</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Or add by URL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            // Commit a typed-but-not-"Add"ed URL when the field loses focus
            // (e.g. the user clicks Save directly) so the URL isn't lost.
            onBlur={addUrl}
            placeholder="…or paste an image URL"
            className="admin-input pl-9"
          />
        </div>
        <button type="button" onClick={addUrl} className="btn-ghost shrink-0 text-[13px]">
          Add URL
        </button>
      </div>
    </div>
  );
}
