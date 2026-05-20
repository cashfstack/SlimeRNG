export type RarityKey =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Mythic"
  | "Divine"
  | "Void"
  | "Celestial"
  | "Transcendent"
  | "Corrupted"
  | "Eternal"
  | "Secret"
  | "Omega"
  | "Developer";

export interface RarityInfo {
  key: RarityKey;
  odds: number;
  color: string;
  glow: string;
  bg: string;
  currencyValue: number;
  unlockRebirths: number;
}

export interface SlimeDefinition {
  id: string;
  name: string;
  rarity: RarityKey;
  theme: string;
  primary: string;
  secondary: string;
  accent: string;
  eye: string;
  particle: string;
  seed: number;
  tags: string[];
}

export const rarityOrder: RarityKey[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "Divine",
  "Void",
  "Celestial",
  "Transcendent",
  "Corrupted",
  "Eternal",
  "Secret",
  "Omega",
  "Developer",
];

export const rarityInfoMap: Record<RarityKey, RarityInfo> = {
  Common: {
    key: "Common",
    odds: 2,
    color: "#9ca3af",
    glow: "rgba(156,163,175,0.4)",
    bg: "linear-gradient(135deg,#374151,#4b5563)",
    currencyValue: 3,
    unlockRebirths: 0,
  },
  Uncommon: {
    key: "Uncommon",
    odds: 5,
    color: "#34d399",
    glow: "rgba(52,211,153,0.45)",
    bg: "linear-gradient(135deg,#065f46,#059669)",
    currencyValue: 7,
    unlockRebirths: 0,
  },
  Rare: {
    key: "Rare",
    odds: 15,
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.5)",
    bg: "linear-gradient(135deg,#0c4a6e,#0284c7)",
    currencyValue: 18,
    unlockRebirths: 0,
  },
  Epic: {
    key: "Epic",
    odds: 45,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.5)",
    bg: "linear-gradient(135deg,#4c1d95,#7c3aed)",
    currencyValue: 55,
    unlockRebirths: 0,
  },
  Legendary: {
    key: "Legendary",
    odds: 120,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.55)",
    bg: "linear-gradient(135deg,#78350f,#d97706)",
    currencyValue: 160,
    unlockRebirths: 0,
  },
  Mythic: {
    key: "Mythic",
    odds: 450,
    color: "#fb7185",
    glow: "rgba(251,113,133,0.55)",
    bg: "linear-gradient(135deg,#881337,#e11d48)",
    currencyValue: 600,
    unlockRebirths: 0,
  },
  Divine: {
    key: "Divine",
    odds: 1500,
    color: "#fef08a",
    glow: "rgba(254,240,138,0.6)",
    bg: "linear-gradient(135deg,#854d0e,#eab308,#fef08a)",
    currencyValue: 2100,
    unlockRebirths: 1,
  },
  Void: {
    key: "Void",
    odds: 6000,
    color: "#818cf8",
    glow: "rgba(129,140,248,0.6)",
    bg: "linear-gradient(135deg,#1e1b4b,#4338ca,#312e81)",
    currencyValue: 8800,
    unlockRebirths: 1,
  },
  Celestial: {
    key: "Celestial",
    odds: 18000,
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.65)",
    bg: "linear-gradient(135deg,#164e63,#06b6d4,#0891b2)",
    currencyValue: 32000,
    unlockRebirths: 1,
  },
  Transcendent: {
    key: "Transcendent",
    odds: 60000,
    color: "#e879f9",
    glow: "rgba(232,121,249,0.7)",
    bg: "linear-gradient(135deg,#701a75,#c026d3,#a855f7)",
    currencyValue: 120000,
    unlockRebirths: 2,
  },
  Corrupted: {
    key: "Corrupted",
    odds: 120000,
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.7)",
    bg: "linear-gradient(135deg,#450a0a,#dc2626,#b91c1c)",
    currencyValue: 350000,
    unlockRebirths: 2,
  },
  Eternal: {
    key: "Eternal",
    odds: 300000,
    color: "#2dd4bf",
    glow: "rgba(45,212,191,0.75)",
    bg: "linear-gradient(135deg,#134e4a,#14b8a6,#0d9488)",
    currencyValue: 1100000,
    unlockRebirths: 3,
  },
  Secret: {
    key: "Secret",
    odds: 1200000,
    color: "#f5f5f5",
    glow: "rgba(255,255,255,0.8)",
    bg: "linear-gradient(135deg,#18181b,#f5f5f5,#71717a)",
    currencyValue: 4000000,
    unlockRebirths: 4,
  },
  Omega: {
    key: "Omega",
    odds: 6000000,
    color: "#fde047",
    glow: "rgba(253,224,71,0.85)",
    bg: "linear-gradient(135deg,#422006,#fde047,#f59e0b)",
    currencyValue: 18000000,
    unlockRebirths: 5,
  },
  Developer: {
    key: "Developer",
    odds: 12000000,
    color: "#c4b5fd",
    glow: "rgba(196,181,253,0.9)",
    bg: "linear-gradient(135deg,#2e1065,#c4b5fd,#7c3aed,#fde047)",
    currencyValue: 50000000,
    unlockRebirths: 6,
  },
};

export const rarityList = rarityOrder.map((key) => rarityInfoMap[key]);

const themes = [
  "Fire", "Ice", "Void", "Galaxy", "Cyberpunk", "Magma", "Angelic", "Corrupted",
  "Radioactive", "Crystal", "Shadow", "Rainbow", "Ancient", "Toxic", "Neon",
  "Cursed", "Cosmic", "Ocean", "Electric", "Steampunk", "Glitched", "Dreamcore",
  "Futuristic", "Ethereal", "Stellar", "Abyssal", "Molten", "Prismatic", "Cyber",
  "Quantum", "Plasma", "Aero", "Inferno", "Glacial", "Nebula", "Spectre"
];

const rarityPrefixes: Record<RarityKey, string[]> = {
  Common: ["Bouncy", "Mellow", "Jelly", "Soft", "Gummy", "Wobbly", "Slimy", "Chewy"],
  Uncommon: ["Spry", "Misty", "Glint", "Fresh", "Zesty", "Vivid", "Sparky", "Plump"],
  Rare: ["Arc", "Blitz", "Shard", "Nova", "Frost", "Flare", "Volt", "Gale"],
  Epic: ["Prime", "Vibe", "Flux", "Pulse", "Sonic", "Hydro", "Pyro", "Zen"],
  Legendary: ["Elder", "Royal", "Alpha", "Solar", "Aero", "Grand", "Apex", "Nova"],
  Mythic: ["Oracle", "Eclipse", "Paragon", "Rune", "Sage", "Wraith", "Aura", "Mystic"],
  Divine: ["Halo", "Sanctum", "Seraph", "Lumen", "Astra", "Ether", "Deus", "Sol"],
  Void: ["Null", "Abyss", "Eventide", "Blackstar", "Zero", "Nox", "Styx", "Chaos"],
  Celestial: ["Starlit", "Comet", "Nebula", "Astral", "Orion", "Helios", "Luna", "Cosmo"],
  Transcendent: ["Zenith", "Infinite", "Hyperion", "Fractal", "Apex", "Limitless", "Omni", "Vector"],
  Corrupted: ["Rift", "Broken", "Mutant", "Hex", "Vile", "Venom", "Rust", "Glitched"],
  Eternal: ["Chrono", "Relic", "Ever", "Aeon", "Infinity", "Ageless", "Timeless", "Undying"],
  Secret: ["Cipher", "Mirage", "Obsidian", "Lattice", "Phantasm", "Ghost", "Enigma", "Shadow"],
  Omega: ["Omega", "Apex", "Final", "Singularity", "Ultimate", "Genesis", "Primeval", "Doomsday"],
  Developer: ["Debug", "Admin", "Core", "Source", "Console", "Kernel", "Root", "System"],
};

const suffixes = [
  "Blob", "Slime", "Core", "Melt", "Goo", "Drift", "Orb", "Wisp", "Entity", "Pulse",
  "Puddle", "Droplet", "Bubble", "Splat", "Jelly", "Chunk", "Cube", "Spore", "Sprite", "Echo"
];

const palettes = [
  ["#f97316", "#facc15", "#fb7185", "#fef9c3", "#fb7185"],
  ["#60a5fa", "#93c5fd", "#67e8f9", "#dbeafe", "#e0f2fe"],
  ["#7c3aed", "#0f172a", "#a855f7", "#d8b4fe", "#c4b5fd"],
  ["#0ea5e9", "#2563eb", "#9333ea", "#dbeafe", "#f0abfc"],
  ["#14b8a6", "#2dd4bf", "#06b6d4", "#ccfbf1", "#99f6e4"],
  ["#f43f5e", "#ef4444", "#f97316", "#fee2e2", "#fecaca"],
  ["#f59e0b", "#fcd34d", "#fef3c7", "#fef9c3", "#fde68a"],
  ["#22c55e", "#4ade80", "#84cc16", "#dcfce7", "#bbf7d0"],
  ["#eab308", "#e879f9", "#38bdf8", "#fef9c3", "#fdf4ff"],
  ["#475569", "#94a3b8", "#cbd5e1", "#f8fafc", "#e2e8f0"],
  ["#8b5cf6", "#ec4899", "#22d3ee", "#ddd6fe", "#fce7f3"],
  ["#10b981", "#84cc16", "#bef264", "#d9f99d", "#ecfccb"],
  ["#ec4899", "#f43f5e", "#fb7185", "#ffe4e6", "#fecaca"],
  ["#a855f7", "#6366f1", "#818cf8", "#e0e7ff", "#c7d2fe"],
  ["#f59e0b", "#d97706", "#b45309", "#fef3c7", "#fde68a"]
];

// Exactly 140 unique slimes across all rarities
const rarityCounts: Record<RarityKey, number> = {
  Common: 22,
  Uncommon: 18,
  Rare: 16,
  Epic: 14,
  Legendary: 12,
  Mythic: 11,
  Divine: 10,
  Void: 8,
  Celestial: 7,
  Transcendent: 6,
  Corrupted: 5,
  Eternal: 4,
  Secret: 3,
  Omega: 2,
  Developer: 2,
};

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function paletteFor(seed: number) {
  return palettes[seed % palettes.length];
}

// Tag assignment based on rarity and seed
function assignTags(rarity: RarityKey, seed: number, theme: string): string[] {
  const tags: string[] = [];
  const rank = rarityOrder.indexOf(rarity);

  if (theme === "Rainbow" || theme === "Neon") tags.push("Rainbow");
  if (theme === "Fire" || theme === "Magma" || theme === "Inferno" || theme === "Molten") tags.push("Burning");
  if (theme === "Ice" || theme === "Ocean" || theme === "Glacial") tags.push("Frozen");
  if (theme === "Shadow" || theme === "Cursed" || theme === "Spectre") tags.push("Dark");
  if (theme === "Angelic" || theme === "Cosmic" || theme === "Stellar") tags.push("Radiant");
  if (theme === "Radioactive" || theme === "Toxic") tags.push("Hazardous");
  if (theme === "Crystal" || theme === "Dreamcore" || theme === "Prismatic") tags.push("Prismatic");
  if (theme === "Electric" || theme === "Cyberpunk" || theme === "Plasma") tags.push("Charged");
  if (theme === "Galaxy" || theme === "Futuristic" || theme === "Nebula") tags.push("Astral");
  if (theme === "Void" || theme === "Corrupted" || theme === "Abyssal") tags.push("Unstable");
  if (theme === "Glitched" || theme === "Quantum") tags.push("Glitched");
  if (theme === "Steampunk" || theme === "Ancient") tags.push("Relic");

  if (rank >= 4) tags.push("Glowing");
  if (rank >= 6) tags.push("Golden");
  if (rank >= 8) tags.push("Ethereal");
  if (rank >= 10) tags.push("Abyssal");
  if (rank >= 12) tags.push("Legendary Aura");
  if (rank >= 14) tags.push("Godlike");

  if (seed % 7 === 0 && rank >= 2) tags.push("Sparkling");
  if (seed % 11 === 0 && rank >= 3) tags.push("Enchanted");
  if (seed % 13 === 0 && rank >= 5) tags.push("Ancient");
  if (seed % 17 === 0) tags.push("Unique");

  return tags;
}

export function createSlimeCompendium(): SlimeDefinition[] {
  const compendium: SlimeDefinition[] = [];
  rarityOrder.forEach((rarity, rarityIndex) => {
    const count = rarityCounts[rarity];
    for (let i = 0; i < count; i += 1) {
      const theme = themes[(i + rarityIndex * 4) % themes.length];
      const prefix = rarityPrefixes[rarity][i % rarityPrefixes[rarity].length];
      const suffix = suffixes[(i + rarityIndex * 2) % suffixes.length];
      const name = `${prefix} ${theme} ${suffix}`;
      const id = `${rarity.toLowerCase()}-${theme.toLowerCase()}-${i}`;
      const seed = hashString(`${id}:${name}`);
      const [primary, secondary, accent, eye, particle] = paletteFor(seed + i);
      const tags = assignTags(rarity, seed, theme);
      compendium.push({
        id,
        name,
        rarity,
        theme,
        primary,
        secondary,
        accent,
        eye,
        particle,
        seed,
        tags,
      });
    }
  });
  return compendium;
}

export interface UpgradeDefinition {
  id:
    | "rollSpeed"
    | "luck"
    | "multiRoll"
    | "autoRoll"
    | "rareMultiplier"
    | "inventorySize"
    | "shinyChance"
    | "currencyBoost";
  label: string;
  icon: string;
  maxLevel: number;
  baseCost: number;
  growth: number;
  description: string;
}

export const upgrades: UpgradeDefinition[] = [
  {
    id: "rollSpeed",
    label: "Roll Speed",
    icon: "rollspeed",
    maxLevel: 25,
    baseCost: 60,
    growth: 1.35,
    description: "Faster reveal animations",
  },
  {
    id: "luck",
    label: "Fortune",
    icon: "luck",
    maxLevel: 30,
    baseCost: 80,
    growth: 1.4,
    description: "Better rarity weighting",
  },
  {
    id: "multiRoll",
    label: "Multi Roll",
    icon: "multi",
    maxLevel: 12,
    baseCost: 140,
    growth: 1.6,
    description: "+1 roll per tap every 3 lvls",
  },
  {
    id: "autoRoll",
    label: "Auto Roll",
    icon: "auto",
    maxLevel: 20,
    baseCost: 200,
    growth: 1.5,
    description: "Faster auto rolling",
  },
  {
    id: "rareMultiplier",
    label: "Rare Surge",
    icon: "rare",
    maxLevel: 18,
    baseCost: 300,
    growth: 1.55,
    description: "Mythic+ chance boost",
  },
  {
    id: "inventorySize",
    label: "Vault Size",
    icon: "vault",
    maxLevel: 15,
    baseCost: 90,
    growth: 1.45,
    description: "More inventory slots",
  },
  {
    id: "shinyChance",
    label: "Shiny Boost",
    icon: "shiny",
    maxLevel: 20,
    baseCost: 250,
    growth: 1.5,
    description: "Higher shiny chance",
  },
  {
    id: "currencyBoost",
    label: "Credits+",
    icon: "credits",
    maxLevel: 25,
    baseCost: 120,
    growth: 1.4,
    description: "More credits per roll",
  },
];

export const rebirthRequirementBase = 50000;

export const titles = [
  { id: "rookie", label: "Rookie Roller", req: 25 },
  { id: "collector", label: "Vault Curator", req: 250 },
  { id: "mythhunter", label: "Myth Hunter", req: 5 },
  { id: "voidwalker", label: "Voidwalker", req: 1 },
  { id: "reborn", label: "Reborn Architect", req: 3 },
  { id: "omega", label: "Omega Witness", req: 1 },
];

export const dailyRewardTable = [150, 300, 550, 850, 1200, 1800, 2800];
