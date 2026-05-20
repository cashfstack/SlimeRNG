import { motion } from "framer-motion";
import type { SlimeDefinition, RarityKey } from "../game/config";
import { rarityInfoMap } from "../game/config";

const ro: RarityKey[] = ["Common","Uncommon","Rare","Epic","Legendary","Mythic","Divine","Void","Celestial","Transcendent","Corrupted","Eternal","Secret","Omega","Developer"];
function rv(r: RarityKey) { return ro.indexOf(r); }

function sRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

function darken(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = Math.max(0, parseInt(h.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(h.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(h.substring(4, 6), 16) - amount);
  return `rgb(${r},${g},${b})`;
}

interface Props {
  slime: SlimeDefinition;
  size?: number;
  bouncing?: boolean;
  glowing?: boolean;
  className?: string;
  mutations?: string[];
}

export default function SlimeRenderer({ slime, size = 160, bouncing = false, glowing = false, className = "", mutations = [] }: Props) {
  const ri = rarityInfoMap[slime.rarity];
  const rank = rv(slime.rarity);
  const rng = sRng(slime.seed);

  // Mutation Flags
  const isBig = mutations.includes("big");
  const isHuge = mutations.includes("huge");
  const isRainbow = mutations.includes("rainbow");
  const isShiny = mutations.includes("shiny");
  const isLava = mutations.includes("lava");

  // Determine size scale based on Big / Huge
  let scale = 1;
  if (isHuge) scale = 1.35;
  else if (isBig) scale = 1.18;

  // Body shapes
  const bodyType = slime.seed % 6;
  const bodyPaths = [
    "M50 15 C72 15 85 30 85 50 C85 72 72 88 50 88 C28 88 15 72 15 50 C15 30 28 15 50 15Z",
    "M50 12 C70 12 82 28 84 48 C86 70 72 90 50 90 C28 90 14 70 16 48 C18 28 30 12 50 12Z",
    "M50 18 C75 18 88 32 88 52 C88 73 72 86 50 86 C28 86 12 73 12 52 C12 32 25 18 50 18Z",
    "M48 14 C70 14 86 30 84 52 C82 74 68 88 48 88 C26 88 14 74 16 52 C18 30 26 14 48 14Z",
    "M50 16 C73 16 86 32 84 54 C82 76 70 90 50 90 C30 90 18 76 16 54 C14 32 27 16 50 16Z",
    "M50 12 C72 14 88 34 86 52 C84 72 68 88 50 90 C32 88 16 72 14 52 C12 34 28 14 50 12Z",
  ];

  const eyeType = slime.seed % 5;
  const eyeY = 44 + (rng() * 6 - 3);
  const eyeSpread = 11 + rng() * 4;
  const eyeSize = 7 + (rank >= 6 ? 2 : 0) + rng() * 2;
  const pupilSize = eyeSize * (0.45 + rng() * 0.15);

  const mouthType = slime.seed % 5;
  const showBlush = slime.seed % 3 === 0;

  // Outline/Stroke styling (super thick outlines for cartoony look)
  const baseStrokeCol = darken(slime.primary, 85);
  const strokeCol = isLava ? "#450a0a" : baseStrokeCol;
  const strokeW = 4.2; // Even thicker for cartoon aesthetic

  // Spots
  const spotCount = 2 + Math.floor(rng() * 3);
  const spots = Array.from({ length: spotCount }).map(() => ({
    cx: 25 + rng() * 50,
    cy: 30 + rng() * 45,
    r: 4 + rng() * 8,
    opacity: 0.12 + rng() * 0.15,
  }));

  // Render glow and effects
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={bouncing ? {
        y: [0, -6, 0],
        scaleX: [scale, scale * 1.03, scale],
        scaleY: [scale, scale * 0.95, scale],
      } : { scaleX: scale, scaleY: scale }}
      transition={bouncing ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {/* Outer Glow */}
      {(glowing || rank >= 4 || isShiny || isLava) && (
        <div
          className="absolute inset-[-20%] rounded-full blur-2xl opacity-80"
          style={{
            background: isLava
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.45), transparent 70%)"
              : isRainbow
              ? "radial-gradient(circle, rgba(236, 72, 153, 0.35), rgba(59, 130, 246, 0.35), transparent 70%)"
              : `radial-gradient(circle, ${ri.color}${rank >= 8 || isShiny ? "70" : "40"}, transparent 65%)`,
          }}
        />
      )}

      {/* Rotating Conic Sparkle Ring */}
      {(rank >= 8 || isShiny || isRainbow) && (
        <motion.div
          className="absolute inset-[-10%] rounded-full opacity-60"
          style={{
            background: isRainbow
              ? "conic-gradient(from 0deg, #f43f5e, #fb923c, #fde047, #4ade80, #38bdf8, #a78bfa, #f43f5e)"
              : `conic-gradient(from 0deg, ${ri.color}60, transparent 20%, ${ri.color}60 40%, transparent 60%, ${ri.color}60 80%, transparent)`,
            mask: "radial-gradient(circle, transparent 46%, black 50%, black 54%, transparent 58%)",
            WebkitMask: "radial-gradient(circle, transparent 46%, black 50%, black 54%, transparent 58%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* SVG Container */}
      <svg
        viewBox="0 0 100 100"
        className="relative z-10"
        style={{
          width: size,
          height: size,
          filter: isRainbow ? "hue-rotate(0deg)" : undefined,
        }}
      >
        {isRainbow && (
          <animate
            attributeName="style"
            values="filter: hue-rotate(0deg);; filter: hue-rotate(360deg);"
            dur="6s"
            repeatCount="indefinite"
          />
        )}

        <defs>
          <radialGradient id={`bg-${slime.id}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={isLava ? "#ef4444" : slime.primary} />
            <stop offset="70%" stopColor={isLava ? "#b91c1c" : slime.secondary} />
            <stop offset="100%" stopColor={isLava ? "#450a0a" : slime.accent} />
          </radialGradient>
          <radialGradient id={`hi-${slime.id}`} cx="35%" cy="25%" r="45%">
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Drop shadow under the slime */}
        <ellipse cx="50" cy="93" rx="25" ry="4" fill="rgba(0,0,0,0.18)" />

        {/* Slime Body with thick stroke */}
        <path
          d={bodyPaths[bodyType]}
          fill={`url(#bg-${slime.id})`}
          stroke={strokeCol}
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />

        {/* Spots inside body */}
        {!isLava && spots.map((s, i) => (
          <circle key={`sp-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill={slime.accent} opacity={s.opacity} />
        ))}

        {/* Molten crack overlays if Lava mutation */}
        {isLava && (
          <g stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M30 45 L36 52 L32 58" />
            <path d="M68 40 L62 48 L65 54 L58 60" />
            <path d="M48 30 L52 36 L46 42" />
          </g>
        )}

        {/* Highlight shine overlay */}
        <path d={bodyPaths[bodyType]} fill={`url(#hi-${slime.id})`} />

        {/* Specular shiny light blobs */}
        <ellipse cx="38" cy="30" rx="12" ry="8" fill="white" opacity="0.3" />
        <ellipse cx="35" cy="28" rx="6" ry="4" fill="white" opacity="0.2" />

        {/* Theme Decor (Only if not Lava mutated) */}
        {!isLava && (
          <>
            {/* Fire/Magma Theme */}
            {(slime.theme === "Fire" || slime.theme === "Magma" || slime.theme === "Inferno" || slime.theme === "Molten") && (
              <g opacity="0.75">
                <path d="M72 25 L75 18 L70 22Z" fill="#fbbf24" stroke={strokeCol} strokeWidth="1.2" />
                <path d="M78 35 L82 28 L76 32Z" fill="#f97316" stroke={strokeCol} strokeWidth="1.2" />
                <path d="M25 20 L22 14 L28 18Z" fill="#fbbf24" stroke={strokeCol} strokeWidth="1.2" />
              </g>
            )}

            {/* Ice Theme */}
            {(slime.theme === "Ice" || slime.theme === "Ocean" || slime.theme === "Glacial") && (
              <g opacity="0.65">
                <polygon points="75,20 78,15 81,20 78,25" fill="#bfdbfe" stroke={strokeCol} strokeWidth="1" />
                <polygon points="22,18 25,12 28,18 25,23" fill="#dbeafe" stroke={strokeCol} strokeWidth="1" />
              </g>
            )}

            {/* Stars for cosmic/galaxy */}
            {(slime.theme === "Galaxy" || slime.theme === "Cosmic" || slime.theme === "Futuristic" || slime.theme === "Nebula" || slime.theme === "Stellar") && (
              <g opacity="0.8">
                {[{x:75,y:22},{x:22,y:16},{x:80,y:45}].map((s,i)=>(
                  <g key={`star-${i}`}>
                    <line x1={s.x-3} y1={s.y} x2={s.x+3} y2={s.y} stroke="#fde047" strokeWidth="1.5" />
                    <line x1={s.x} y1={s.y-3} x2={s.x} y2={s.y+3} stroke="#fde047" strokeWidth="1.5" />
                  </g>
                ))}
              </g>
            )}

            {/* Electric bolts */}
            {(slime.theme === "Electric" || slime.theme === "Cyberpunk" || slime.theme === "Plasma" || slime.theme === "Cyber") && (
              <g opacity="0.8">
                <path d="M74 20 L78 28 L74 26 L80 36" fill="none" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 22 L24 30 L20 28 L26 38" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}

            {/* Toxic/Radioactive bubbles */}
            {(slime.theme === "Toxic" || slime.theme === "Radioactive") && (
              <g opacity="0.65">
                <circle cx="76" cy="28" r="4" fill="none" stroke="#a3e635" strokeWidth="1.3" />
                <circle cx="22" cy="22" r="3" fill="none" stroke="#84cc16" strokeWidth="1.3" />
                <circle cx="80" cy="42" r="2.5" fill="none" stroke="#bef264" strokeWidth="1" />
              </g>
            )}

            {/* Shadow wisps */}
            {(slime.theme === "Shadow" || slime.theme === "Cursed" || slime.theme === "Spectre" || slime.theme === "Abyssal") && (
              <g opacity="0.55">
                <path d="M22 75 Q18 65 22 55" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                <path d="M78 72 Q82 62 78 52" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {/* Crystal facets */}
            {(slime.theme === "Crystal" || slime.theme === "Glitched" || slime.theme === "Prismatic") && (
              <g opacity="0.5">
                <polygon points="73,18 78,14 80,20 75,22" fill="none" stroke="#a78bfa" strokeWidth="1.2" />
                <polygon points="20,20 25,15 27,22 22,24" fill="none" stroke="#c4b5fd" strokeWidth="1.2" />
              </g>
            )}

            {/* Angelic halo */}
            {slime.theme === "Angelic" && (
              <ellipse cx="50" cy="14" rx="16" ry="4" fill="none" stroke="#fbbf24" strokeWidth="2.5" opacity="0.85" />
            )}

            {/* Steampunk gear */}
            {(slime.theme === "Steampunk" || slime.theme === "Ancient") && (
              <circle cx="76" cy="24" r="6" fill="none" stroke="#b45309" strokeWidth="1.5" opacity="0.65" />
            )}

            {/* Corrupted cracks */}
            {slime.theme === "Corrupted" && (
              <g opacity="0.6">
                <path d="M35 55 L30 65 L33 60 L28 70" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M65 50 L70 62 L67 57 L72 68" fill="none" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" />
              </g>
            )}

            {/* Void swirl */}
            {slime.theme === "Void" && (
              <g opacity="0.35">
                <circle cx="50" cy="52" r="18" fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 4" />
                <circle cx="50" cy="52" r="12" fill="none" stroke="#6d28d9" strokeWidth="0.8" strokeDasharray="2 3" />
              </g>
            )}
          </>
        )}

        {/* Eyes (Thick strokes around outline) */}
        <g>
          {eyeType === 0 && (
            <>
              <circle cx={50 - eyeSpread} cy={eyeY} r={eyeSize} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <circle cx={50 + eyeSpread} cy={eyeY} r={eyeSize} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <circle cx={50 - eyeSpread + 1} cy={eyeY + 0.5} r={pupilSize} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 + eyeSpread + 1} cy={eyeY + 0.5} r={pupilSize} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 - eyeSpread - 1.5} cy={eyeY - 2} r={pupilSize * 0.35} fill="white" />
              <circle cx={50 + eyeSpread - 1.5} cy={eyeY - 2} r={pupilSize * 0.35} fill="white" />
            </>
          )}
          {eyeType === 1 && (
            <>
              <circle cx={50 - eyeSpread} cy={eyeY} r={eyeSize * 1.15} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <circle cx={50 + eyeSpread} cy={eyeY} r={eyeSize * 1.15} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <circle cx={50 - eyeSpread} cy={eyeY + 1} r={pupilSize * 1.1} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 + eyeSpread} cy={eyeY + 1} r={pupilSize * 1.1} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 - eyeSpread - 2} cy={eyeY - 2.5} r={pupilSize * 0.4} fill="white" />
              <circle cx={50 + eyeSpread - 2} cy={eyeY - 2.5} r={pupilSize * 0.4} fill="white" />
              <circle cx={50 - eyeSpread + 1.5} cy={eyeY + 1} r={pupilSize * 0.2} fill="white" />
              <circle cx={50 + eyeSpread + 1.5} cy={eyeY + 1} r={pupilSize * 0.2} fill="white" />
            </>
          )}
          {eyeType === 2 && (
            <>
              <ellipse cx={50 - eyeSpread} cy={eyeY} rx={eyeSize * 0.85} ry={eyeSize * 1.2} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <ellipse cx={50 + eyeSpread} cy={eyeY} rx={eyeSize * 0.85} ry={eyeSize * 1.2} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <ellipse cx={50 - eyeSpread + 0.5} cy={eyeY + 1} rx={pupilSize * 0.85} ry={pupilSize * 1.1} fill={isLava ? "#fbbf24" : slime.eye} />
              <ellipse cx={50 + eyeSpread + 0.5} cy={eyeY + 1} rx={pupilSize * 0.85} ry={pupilSize * 1.1} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 - eyeSpread - 1} cy={eyeY - 2.5} r={pupilSize * 0.3} fill="white" />
              <circle cx={50 + eyeSpread - 1} cy={eyeY - 2.5} r={pupilSize * 0.3} fill="white" />
            </>
          )}
          {eyeType === 3 && (
            <>
              <ellipse cx={50 - eyeSpread} cy={eyeY} rx={eyeSize * 1.2} ry={eyeSize * 0.8} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <ellipse cx={50 + eyeSpread} cy={eyeY} rx={eyeSize * 1.2} ry={eyeSize * 0.8} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <circle cx={50 - eyeSpread + 1} cy={eyeY} r={pupilSize * 0.85} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 + eyeSpread + 1} cy={eyeY} r={pupilSize * 0.85} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 - eyeSpread - 1.5} cy={eyeY - 1.5} r={pupilSize * 0.3} fill="white" />
              <circle cx={50 + eyeSpread - 1.5} cy={eyeY - 1.5} r={pupilSize * 0.3} fill="white" />
            </>
          )}
          {eyeType === 4 && (
            <>
              <circle cx={50 - eyeSpread} cy={eyeY - 1} r={eyeSize * 1.3} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <circle cx={50 + eyeSpread} cy={eyeY - 1} r={eyeSize * 1.3} fill="white" stroke={strokeCol} strokeWidth="1.8" />
              <circle cx={50 - eyeSpread} cy={eyeY} r={pupilSize * 1.2} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 + eyeSpread} cy={eyeY} r={pupilSize * 1.2} fill={isLava ? "#fbbf24" : slime.eye} />
              <circle cx={50 - eyeSpread - 2.5} cy={eyeY - 3} r={pupilSize * 0.45} fill="white" />
              <circle cx={50 + eyeSpread - 2.5} cy={eyeY - 3} r={pupilSize * 0.45} fill="white" />
              <circle cx={50 - eyeSpread + 1} cy={eyeY + 1} r={pupilSize * 0.25} fill="white" />
              <circle cx={50 + eyeSpread + 1} cy={eyeY + 1} r={pupilSize * 0.25} fill="white" />
            </>
          )}
        </g>

        {/* Blush cheeks */}
        {showBlush && (
          <>
            <ellipse cx={50 - eyeSpread - 5} cy={eyeY + 9} rx="5" ry="3" fill="#f472b6" opacity="0.25" />
            <ellipse cx={50 + eyeSpread + 5} cy={eyeY + 9} rx="5" ry="3" fill="#f472b6" opacity="0.25" />
          </>
        )}

        {/* Mouth */}
        {mouthType === 0 && (
          <path d={`M${50 - 6} ${eyeY + 15} Q${50} ${eyeY + 20} ${50 + 6} ${eyeY + 15}`} fill="none" stroke={strokeCol} strokeWidth="1.8" strokeLinecap="round" />
        )}
        {mouthType === 1 && (
          <path d={`M${50 - 5} ${eyeY + 14} Q${50} ${eyeY + 19} ${50 + 5} ${eyeY + 14}`} fill="#f87171" fillOpacity="0.5" stroke={strokeCol} strokeWidth="1.5" strokeLinecap="round" />
        )}
        {mouthType === 2 && (
          <circle cx="50" cy={eyeY + 16} r="3.5" fill="#f87171" fillOpacity="0.4" stroke={strokeCol} strokeWidth="1.4" />
        )}
        {mouthType === 3 && (
          <path d={`M${50 - 4} ${eyeY + 15} L${50 + 4} ${eyeY + 15}`} fill="none" stroke={strokeCol} strokeWidth="1.6" strokeLinecap="round" />
        )}
        {mouthType === 4 && (
          <>
            <path d={`M${50 - 7} ${eyeY + 13} Q${50} ${eyeY + 21} ${50 + 7} ${eyeY + 13}`} fill="#f87171" fillOpacity="0.4" stroke={strokeCol} strokeWidth="1.5" strokeLinecap="round" />
            <path d={`M${50 - 3} ${eyeY + 16} Q${50} ${eyeY + 14} ${50 + 3} ${eyeY + 16}`} fill="white" fillOpacity="0.6" stroke="none" />
          </>
        )}

        {/* Sparkles / Shiny effects */}
        {(rank >= 3 || isShiny) && Array.from({ length: isShiny ? 5 : 2 + Math.floor(rank / 3) }).map((_, i) => {
          const px = 8 + sRng(slime.seed + i * 77)() * 84;
          const py = 5 + sRng(slime.seed + i * 33)() * 40;
          return (
            <path
              key={`sparkle-${i}`}
              d={`M${px} ${py - 3} L${px + 1} ${py - 1} L${px + 3} ${py} L${px + 1} ${py + 1} L${px} ${py + 3} L${px - 1} ${py + 1} L${px - 3} ${py} L${px - 1} ${py - 1} Z`}
              fill={isShiny ? "#fde047" : slime.particle}
              opacity="0.85"
            >
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="transform" type="scale" values="0.8;1.2;0.8" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            </path>
          );
        })}

        {/* Floating lava particles if Lava mutated */}
        {isLava && Array.from({ length: 4 }).map((_, i) => {
          const px = 10 + sRng(slime.seed + i * 45)() * 80;
          const py = 20 + sRng(slime.seed + i * 85)() * 60;
          return (
            <circle key={`lavap-${i}`} cx={px} cy={py} r="2" fill="#ea580c">
              <animate attributeName="opacity" values="0;0.9;0" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${py};${py - 12}`} dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>
    </motion.div>
  );
}
