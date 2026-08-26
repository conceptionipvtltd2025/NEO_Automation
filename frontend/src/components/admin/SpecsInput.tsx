import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, ClipboardPaste, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Spec = { label: string; value: string };

/**
 * Structured editor for a product's technical specifications.
 *
 * It replaces a free-text `Label: Value` textarea whose parser silently threw
 * away any line it could not split on a colon — so an admin could fill the box,
 * hit Save, and get an empty spec table back with nothing on screen explaining
 * why. Here every row is a real pair of fields, an incomplete row is called out
 * in place before Save rather than vanishing after it, and the paste box is a
 * deliberate import step rather than the only way to enter data.
 */

/** Split one pasted line into a label/value pair. Forgiving on the separator. */
function parseLine(line: string): Spec | null {
  const raw = line.trim();
  if (!raw) return null;
  // Tab first (spreadsheet paste), then ":", then " – / — / - ", then "=".
  const patterns: RegExp[] = [/\t+/, /:/, /\s+[–—]\s+/, /\s+-\s+/, /=/];
  for (const re of patterns) {
    const idx = raw.search(re);
    if (idx > 0) {
      const m = raw.match(re)!;
      return {
        label: raw.slice(0, idx).trim(),
        value: raw.slice(idx + m[0].length).trim(),
      };
    }
  }
  // No separator at all — keep the text as the label so it is visible and
  // fixable, instead of being dropped.
  return { label: raw, value: "" };
}

export function SpecsInput({
  value,
  onChange,
}: {
  value: Spec[];
  onChange: (next: Spec[]) => void;
}) {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const update = (i: number, patch: Partial<Spec>) =>
    onChange(value.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const add = () => onChange([...value, { label: "", value: "" }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const applyPaste = () => {
    const rows = pasteText
      .split("\n")
      .map(parseLine)
      .filter((s): s is Spec => !!s);
    if (rows.length) {
      // Append, dropping any blank placeholder rows already on screen.
      onChange([...value.filter((s) => s.label.trim() || s.value.trim()), ...rows]);
    }
    setPasteText("");
    setPasteOpen(false);
  };

  // A row is "incomplete" once the admin has started it but not finished it.
  // Entirely blank rows are just an empty slot, not a mistake.
  const incomplete = value.filter(
    (s) => (s.label.trim() && !s.value.trim()) || (!s.label.trim() && s.value.trim())
  ).length;

  return (
    <div className="space-y-2.5">
      {value.length > 0 && (
        <div className="hidden gap-2 px-1 text-[12px] font-medium uppercase tracking-wider text-steel-500 sm:grid sm:grid-cols-[1fr_1.3fr_auto]">
          <span>Label</span>
          <span>Value</span>
          <span className="w-[86px]" />
        </div>
      )}

      {value.map((s, i) => {
        const started = !!(s.label.trim() || s.value.trim());
        const rowIncomplete =
          started && (!s.label.trim() || !s.value.trim());
        return (
          <div
            key={i}
            className={cn(
              "grid gap-2 rounded-xl border p-2 transition sm:grid-cols-[1fr_1.3fr_auto] sm:items-center sm:border-transparent sm:bg-transparent sm:p-0",
              rowIncomplete
                ? "border-neo-600/40 bg-neo-600/[0.06] sm:border-transparent sm:bg-transparent"
                : "border-white/10 bg-white/[0.02]"
            )}
          >
            <input
              value={s.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Torque Range"
              aria-label={`Specification ${i + 1} label`}
              className={cn(
                "admin-input",
                rowIncomplete && !s.label.trim() && "border-neo-600/50"
              )}
            />
            <input
              value={s.value}
              onChange={(e) => update(i, { value: e.target.value })}
              placeholder="5 – 50 Nm"
              aria-label={`Specification ${i + 1} value`}
              className={cn(
                "admin-input",
                rowIncomplete && !s.value.trim() && "border-neo-600/50"
              )}
            />
            <div className="flex items-center gap-1 justify-self-end">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Move up"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                title="Move down"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                title="Remove specification"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-neo-600/50 hover:text-neo-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}

      {value.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/12 px-4 py-5 text-center text-sm text-steel-500">
          No specifications yet — add the rows that should appear in the
          product's Specifications table.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-steel-200 transition hover:border-neo-600/50 hover:text-white"
        >
          <Plus className="h-4 w-4" /> Add specification
        </button>
        <button
          type="button"
          onClick={() => setPasteOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-steel-400 transition hover:text-white"
        >
          {pasteOpen ? <X className="h-4 w-4" /> : <ClipboardPaste className="h-4 w-4" />}
          {pasteOpen ? "Close paste" : "Paste a list"}
        </button>
        {incomplete > 0 && (
          <span className="text-sm font-medium text-neo-400">
            {incomplete} row{incomplete > 1 ? "s" : ""} still {incomplete > 1 ? "need" : "needs"} both a
            label and a value — they won't be saved.
          </span>
        )}
      </div>

      {pasteOpen && (
        <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <textarea
            rows={4}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"Torque Range: 5 – 50 Nm\nWeight: 1.1 kg\nDrive\t1/2\""}
            className="admin-input resize-none"
          />
          <p className="text-[13px] text-steel-500">
            One per line. Split on a colon, tab, dash or equals — anything the
            parser can't split becomes a label you can finish by hand, so
            nothing you paste is thrown away.
          </p>
          <button
            type="button"
            onClick={applyPaste}
            disabled={!pasteText.trim()}
            className="btn-ghost text-sm disabled:pointer-events-none disabled:opacity-40"
          >
            Add {pasteText.trim() ? pasteText.trim().split("\n").length : 0} row
            {pasteText.trim().split("\n").length === 1 ? "" : "s"}
          </button>
        </div>
      )}
    </div>
  );
}
