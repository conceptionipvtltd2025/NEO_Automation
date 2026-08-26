import {
  BatteryCharging,
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
  Cpu,
  Flame,
  Tractor,
  WashingMachine,
  TrainFront,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * Lucide icons addressable by `Industry.icon` (a plain string, so seed data and
 * the admin panel can name an icon without importing one).
 *
 * Shared by the home showcase, the industries grid and the detail page — an
 * industry added here shows the right icon everywhere at once.
 */
export const industryIcons: Record<string, LucideIcon> = {
  BatteryCharging,
  Car,
  Plane,
  Server,
  Factory,
  CircuitBoard,
  Zap,
  Cpu,
  Flame,
  Tractor,
  WashingMachine,
  TrainFront,
  Truck,
};

/** Resolve an icon name to a component, falling back to a neutral factory mark. */
export const industryIcon = (name?: string): LucideIcon =>
  (name && industryIcons[name]) || Factory;
