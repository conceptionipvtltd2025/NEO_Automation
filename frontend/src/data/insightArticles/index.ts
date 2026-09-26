import type { InsightArticle } from "./types";
import { safetyFirst } from "./safety-first";
import { heatPumpPrecision } from "./heat-pump-precision";
import { windSmartBolting } from "./wind-smart-bolting";
import { defenceSmartAssembly } from "./defence-smart-assembly";
import { vibrationStandard } from "./vibration-standard";
import { handArmVibration } from "./hand-arm-vibration";
import { vibrationPocketGuide } from "./vibration-pocket-guide";
import { powerfulErgonomics } from "./powerful-ergonomics";
import { boltTensioningSafety } from "./bolt-tensioning-safety";
import { mechatronicSystem } from "./mechatronic-system";

export type { InsightArticle, InsightBlock } from "./types";

const all: InsightArticle[] = [
  safetyFirst,
  heatPumpPrecision,
  windSmartBolting,
  defenceSmartAssembly,
  vibrationStandard,
  handArmVibration,
  vibrationPocketGuide,
  powerfulErgonomics,
  boltTensioningSafety,
  mechatronicSystem,
];

export const insightArticles: Record<string, InsightArticle> = Object.fromEntries(
  all.map((a) => [a.id, a])
);
