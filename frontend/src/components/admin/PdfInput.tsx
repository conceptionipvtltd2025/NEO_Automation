import { useRef, useState } from "react";
import { FileText, UploadCloud, X, Link2, ArrowUp, ArrowDown } from "lucide-react";
import type { ProductDocument } from "@/data/products";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { formatBytes } from "@/lib/utils";

/** Turn "TensorSTR_datasheet_EN.pdf" into readable "TensorSTR datasheet EN". */
function labelFromFilename(name: string): string {
  return (
    name
      .replace(/\.pdf$/i, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Datasheet"
  );
}

/** Accept an http(s) URL or a site-relative path — anything the browser can open. */
function isValidPdfRef(value: string): boolean {
  const s = value.trim();
  if (!s) return false;
  if (s.startsWith("/")) return true;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Manage the list of PDF documents attached to one product.
 *
 * Files upload to the backend as binary multipart (same transport as the images
 * — the production WAF blocks base64 bodies), so the product record only ever
 * stores `{ label, url, size }`, never the file bytes. A document can also point
 * at an existing URL, e.g. a manufacturer-hosted datasheet.
 */
export function PdfInput({
  value,
  onChange,
}: {
  value: ProductDocument[];
  onChange: (docs: ProductDocument[]) => void;
}) {
  const [url, setUrl] = useState("");
  const [urlLabel, setUrlLabel] = useState("");
  const [urlErr, setUrlErr] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const [busy, setBusy] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  // ref so an in-flight upload always appends to the latest list
  const valueRef = useRef(value);
  valueRef.current = value;

  const addFiles = async (files: FileList | File[]) => {
    const pdfs = Array.from(files).filter(
      (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name)
    );
    if (!pdfs.length) {
      setUploadErr("Only PDF files can be attached to a product.");
      return;
    }
    setUploadErr("");
    try {
      // Sequential, so a failure stops the batch with a clear message while the
      // documents that already uploaded are kept. The list is accumulated
      // locally rather than read back from `value` between uploads, so it can't
      // depend on a re-render landing between two awaits.
      const next = [...valueRef.current];
      for (const f of pdfs) {
        setBusy(f.name);
        const { url: fileUrl, size } = await api.uploadDoc(f, f.name || "document.pdf");
        next.push({ label: labelFromFilename(f.name), url: fileUrl, size: size ?? f.size });
        onChange([...next]);
      }
    } catch (err) {
      // A 401 here means the admin JWT ran out, not that the file was bad.
      // Ending the session sends them to the login screen with the reason.
      if (err instanceof ApiError && err.status === 401) {
        setUploadErr("Your session expired — sign in again, then re-add the PDF.");
        useAuth.getState().expireSession();
      } else {
        setUploadErr(
          err instanceof Error && err.message
            ? `PDF upload failed: ${err.message}`
            : "PDF upload failed — check your connection and try again."
        );
      }
    } finally {
      setBusy("");
    }
  };

  const patch = (i: number, next: Partial<ProductDocument>) =>
    onChange(value.map((d, idx) => (idx === i ? { ...d, ...next } : d)));

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const addUrl = () => {
    const u = url.trim();
    if (!u) return;
    if (!isValidPdfRef(u)) {
      setUrlErr("Enter a valid PDF link (https://… or /path/file.pdf).");
      return;
    }
    setUrlErr("");
    onChange([
      ...value,
      {
        label: urlLabel.trim() || labelFromFilename(u.split("/").pop() || "Datasheet"),
        url: u,
      },
    ]);
    setUrl("");
    setUrlLabel("");
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((doc, i) => (
            <li
              key={`${doc.url}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2.5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neo-600/15 text-neo-400">
                <FileText className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <input
                  value={doc.label}
                  onChange={(e) => patch(i, { label: e.target.value })}
                  placeholder="Document title (shown to visitors)"
                  aria-label={`Title for document ${i + 1}`}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-sm text-white outline-none transition focus:border-neo-600/50"
                />
                <p className="mt-1 flex items-center gap-2 text-[13px] text-steel-500">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate transition hover:text-neo-400"
                    title={doc.url}
                  >
                    {doc.url}
                  </a>
                  {formatBytes(doc.size) && (
                    <span className="shrink-0 text-steel-600">· {formatBytes(doc.size)}</span>
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                  aria-label={`Move document ${i + 1} up`}
                  className="grid h-7 w-7 place-items-center rounded-lg text-steel-400 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  title="Move down"
                  aria-label={`Move document ${i + 1} down`}
                  className="grid h-7 w-7 place-items-center rounded-lg text-steel-400 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  title="Remove document"
                  aria-label={`Remove document ${i + 1}`}
                  className="grid h-7 w-7 place-items-center rounded-lg text-steel-400 transition hover:bg-red-600 hover:text-pure"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Upload / drop zone */}
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
            `Uploading ${busy}…`
          ) : (
            <>
              <span className="font-semibold text-white">Click to upload a PDF</span>, or drag &amp; drop
            </>
          )}
        </p>
        <p className="text-[12px] text-steel-500">
          Datasheets, manuals, certificates — PDF only, up to 25 MB each
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploadErr && <p className="text-xs text-red-400">{uploadErr}</p>}

      {/* Or link an already-hosted PDF */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={urlLabel}
          onChange={(e) => setUrlLabel(e.target.value)}
          placeholder="Title (optional)"
          className="admin-input sm:w-44"
        />
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
            // Commit a typed-but-not-"Add"ed link when the field loses focus
            // (e.g. the admin clicks Save directly) so it isn't silently lost.
            onBlur={addUrl}
            placeholder="…or paste a PDF link"
            className="admin-input pl-9"
          />
        </div>
        <button type="button" onClick={addUrl} className="btn-ghost shrink-0 text-[14.5px]">
          Add link
        </button>
      </div>
      {urlErr && <p className="text-xs text-red-400">{urlErr}</p>}
    </div>
  );
}
