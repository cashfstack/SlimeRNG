import React from "react";
// All SVG icons used throughout the game — cartoon thick-stroke style

export function IconSpeed({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>);
}

export function IconLuck({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>);
}

export function IconMulti({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
}

export function IconAuto({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-6.2-8.6"/><path d="M21 3v5h-5"/></svg>);
}

export function IconRare({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 8-10 12L2 11z"/></svg>);
}

export function IconVault({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v-2M12 17v-2M9 12H7M17 12h-2"/></svg>);
}

export function IconShiny({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>);
}

export function IconCredits({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9.5a3 3 0 00-3-2.5H10.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H12a3 3 0 01-3-2.5"/><path d="M12 5v2M12 17v2"/></svg>);
}

export function IconRoll({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.2" fill={color}/><circle cx="15.5" cy="8.5" r="1.2" fill={color}/><circle cx="8.5" cy="15.5" r="1.2" fill={color}/><circle cx="15.5" cy="15.5" r="1.2" fill={color}/><circle cx="12" cy="12" r="1.2" fill={color}/></svg>);
}

export function IconInventory({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>);
}

export function IconStats({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>);
}

export function IconUpgrades({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>);
}

export function IconHeart({ size = 16, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>);
}

export function IconStar({ size = 16, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>);
}

export function IconCoin({ size = 16, color = "#fbbf24" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12"/><path d="M8 10h8M8 14h8"/></svg>);
}

export function IconGem({ size = 16, color = "#22d3ee" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 8-10 12L2 11z"/><path d="M2 11h20M8.5 3L12 11l-10 0M15.5 3L12 11l10 0"/></svg>);
}

export function IconRebirth({ size = 20, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 01-15 6.7L3 21v-5h5"/><path d="M3 12a9 9 0 0115-6.7L21 3v5h-5"/></svg>);
}

export function IconSearch({ size = 16, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>);
}

export function IconCalendar({ size = 16, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>);
}

export function IconTrophy({ size = 16, color = "currentColor" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M6 3h12v8a6 6 0 01-12 0z"/><path d="M12 17v4M8 21h8"/></svg>);
}

// Upgrade icon mapper
const upgradeIcons: Record<string, (props: { size?: number; color?: string }) => React.JSX.Element> = {
  rollSpeed: IconSpeed,
  luck: IconLuck,
  multiRoll: IconMulti,
  autoRoll: IconAuto,
  rareMultiplier: IconRare,
  inventorySize: IconVault,
  shinyChance: IconShiny,
  currencyBoost: IconCredits,
};

export function UpgradeIcon({ id, size = 20, color = "currentColor" }: { id: string; size?: number; color?: string }) {
  const Comp = upgradeIcons[id] ?? IconStar;
  return <Comp size={size} color={color} />;
}
