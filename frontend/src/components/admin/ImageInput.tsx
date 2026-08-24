import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Star, Link2, Trash2 } from "lucide-react";
import { safeImg, onImgError, isValidImageRef } from "@/lib/image";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

/**
 * Reads an image File, downscales it to `maxDim` on its longest edge, and returns
 * a compressed JPEG Blob. The Blob is uploaded to the backend as multipart binary
 * (see api.upload) which saves it as a real image file — the product then stores a
 * short file URL, not the image bytes.
 */
async function compressToBlob(file: File, maxDim = 1200, quality = 0.8): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
  return await new Promise<Blob>((resolve) => {
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
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = dataUrl;
  });
}

export function ImageInput({
  value,
  onChange,
  max,
  paste = true,
}: {
  value: string[];
  onChange: (imgs: string[]) => void;
  /** Cap the number of images. `max={1}` = single-image mode (new replaces old). */
  max?: number;
  /**
   * Listen for Ctrl+V anywhere in the form. The listener is GLOBAL, so only one
   * ImageInput per form may have it — with several mounted (the brand editor
   * renders one per product line) a single paste would fan out to every one of
   * them, uploading the same file repeatedly. Pass `paste={false}` on the
   * secondary inputs.
   */
  paste?: boolean;
}) {
  const commit = (next: string[]) => onChange(max ? next.slice(-max) : next);
  const [url, setUrl] = useState("");
  const [urlErr, setUrlErr] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // ref so the global paste handler always appends to the latest list
  const valueRef = useRef(value);
  valueRef.current = value;

  const addFiles = async (files: FileList | File[]) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) return;
    setBusy(true);
    setUploadErr("");
    try {
      // Compress in the browser, then upload each as a real binary file. The
      // backend saves it and returns a short URL, which is what we store. We
      // upload sequentially so one failure can stop the batch with a clear msg.
      const urls: string[] = [];
      for (const f of imgs) {
        const blob = await compressToBlob(f);
        const { url: fileUrl } = await api.upload(blob, f.name || "image.jpg");
        urls.push(fileUrl);
      }
      commit([...valueRef.current, ...urls]);
    } catch (err) {
      // 401 = the admin session expired mid-edit, not a bad image.
      if (err instanceof ApiError && err.status === 401) {
        setUploadErr("Your session expired — sign in again, then re-add the image.");
        useAuth.getState().expireSession();
      } else {
        setUploadErr(
          err instanceof Error && err.message
            ? `Image upload failed: ${err.message}`
            : "Image upload failed — check your connection and try again."
        );
      }
    } finally {
      setBusy(false);
    }
  };

  // Paste an image anywhere in the form (Ctrl+V). Ignores plain-text pastes so
  // it never interferes with typing into the other fields.
  useEffect(() => {
    if (!paste) return;
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
  }, [paste]);

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
    if (!isValidImageRef(u)) {
      setUrlErr("Enter a valid image URL (https://…, /path, or data:image).");
      return;
    }
    setUrlErr("");
    commit([...value, u]);
    setUrl("");
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {value.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-ink-800"
              >
                <img src={safeImg(src)} onError={onImgError} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
                {i === 0 && value.length > 1 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-neo-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-pure">
                    Cover
                  </span>
                )}

                {/* ALWAYS visible, not hover-only: the remove control used to
                    live inside the hover overlay, which made it invisible until
                    you happened to hover and unreachable on a touch screen. */}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  title="Remove image"
                  aria-label={`Remove image ${i + 1}`}
                  className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg bg-ink-950/80 text-pure ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-red-600 hover:ring-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {i !== 0 && (
                  <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-ink-950/85 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => makeCover(i)}
                      title="Set as cover"
                      className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-[10px] font-medium text-pure transition hover:bg-white/25"
                    >
                      <Star className="h-3 w-3" /> Cover
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onChange([])}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-steel-400 transition hover:text-neo-400"
          >
            <Trash2 className="h-3 w-3" />
            {value.length > 1 ? `Remove all ${value.length} images` : "Remove image"}
          </button>
        </>
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

      {uploadErr && <p className="text-xs text-red-400">{uploadErr}</p>}

      {/* Or add by URL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (urlErr) setUrlErr("");
            }}
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
      {urlErr && <p className="text-xs text-red-400">{urlErr}</p>}
    </div>
  );
}
