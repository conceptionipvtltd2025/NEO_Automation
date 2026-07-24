import {
  Wrench,
  Hammer,
  Droplets,
  Disc3,
  Wind,
  Fan,
  MonitorCog,
  Cog,
  MoveVertical,
  Pipette,
  Bot,
  Boxes,
  type LucideIcon,
} from "lucide-react";

/**
 * Lucide icons addressable by `Category.icon` (a plain string, so seed data and
 * the admin panel can name an icon without importing one) — the catalogue
 * counterpart of lib/industryIcons.ts.
 */
export const categoryIcons: Record<string, LucideIcon> = {
  Wrench,
  Hammer,
  Droplets,
  Disc3,
  Wind,
  Fan,
  MonitorCog,
  Cog,
  MoveVertical,
  Pipette,
  Bot,
  Boxes,
};

/** Resolve an icon name to a component, falling back to a neutral crate mark. */
export const categoryIcon = (name?: string): LucideIcon =>
  (name && categoryIcons[name]) || Boxes;
