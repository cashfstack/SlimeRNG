import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createSlimeCompendium, dailyRewardTable, rarityInfoMap, rarityList,
  rebirthRequirementBase, titles, type RarityKey, type SlimeDefinition, upgrades,
} from "./game/config";
import { clearSave, loadSave, writeSave } from "./game/storage";
import SlimeRenderer from "./components/SlimeRenderer";
import {
  IconRoll, IconUpgrades, IconInventory, IconStats,
  IconCoin, IconGem, IconSearch, IconCalendar,
  IconTrophy, IconRebirth, IconHeart, IconStar, IconShiny, UpgradeIcon,
} from "./components/Icons";

type ULM = Record<(typeof upgrades)[number]["id"], number>;

interface InvEntry {
  slimeId: string;
  mutations: string[];
  count: number;
  shinyCount: number;
  favorite: boolean;
  equipped: boolean;
  isNew: boolean;
  firstObtained: number;
  lastObtained: number;
}

interface RollResult {
  slime: SlimeDefinition;
  rarity: RarityKey;
  mutations: string[];
  gained: number;
  combinedOdds: number;
}

interface Save {
  currency: number;
  gems: number;
  rebirths: number;
  totalRolls: number;
  totalRebirths: number;
  totalCurrencyEarned: number;
  playtimeSeconds: number;
  inventory: Record<string, InvEntry>;
  upgradeLevels: ULM;
  ownedSlimes: string[]; // List of base slime IDs owned
  autoRollEnabled: boolean;
  newestRarity: RarityKey;
  dailyStreak: number;
  lastDailyClaimDate: string;
  claimedQuestIds: string[];
  unlockedTitles: string[];
  selectedTitle: string;
  ownedGamepasses: string[];
  claimedPlaytimeRewards: number[];
  lastSeenAt: number;
}

const defUL: ULM = { rollSpeed:0,luck:0,multiRoll:0,autoRoll:0,rareMultiplier:0,inventorySize:0,shinyChance:0,currencyBoost:0 };
const initSave: Save = {
  currency:0,gems:100,rebirths:0,totalRolls:0,totalRebirths:0,totalCurrencyEarned:0,playtimeSeconds:0,
  inventory:{},upgradeLevels:defUL,ownedSlimes:[],autoRollEnabled:false,newestRarity:"Common",
  dailyStreak:0,lastDailyClaimDate:"",claimedQuestIds:[],unlockedTitles:["rookie"],selectedTitle:"rookie",
  ownedGamepasses:[],claimedPlaytimeRewards:[],lastSeenAt:Date.now()
};

const quests = [
  { id:"roll_100",label:"Roll 100 Times",reward:900,type:"rolls" as const,target:100 },
  { id:"collect_35",label:"Collect 35 Slimes",reward:1400,type:"collection" as const,target:35 },
  { id:"mythic_3",label:"Get Mythic+ x3",reward:2200,type:"high" as const,target:3 },
];
const passes = [
  { id:"double_income",name:"2x Credits",cost:120,desc:"Double all credits" },
  { id:"hyper_auto",name:"Hyper Auto",cost:150,desc:"35% faster auto" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const costFor = (b:number,g:number,l:number) => Math.floor(b * g ** l);
const rv = (r: RarityKey) => rarityList.findIndex((x) => x.key === r);
const fmtN = (n: number) => { if(n>=1e6) return (n/1e6).toFixed(1)+"M"; if(n>=1e3) return (n/1e3).toFixed(1)+"K"; return n.toLocaleString(); };

function playTone(r: RarityKey) {
  try {
    const A=window.AudioContext||(window as any).webkitAudioContext; if(!A)return;
    const c=new A(),o=c.createOscillator(),g=c.createGain(); const k=rv(r);
    o.type=k>8?"sawtooth":k>4?"square":"triangle"; o.frequency.value=280+k*40; g.gain.value=0.04+k*0.003;
    o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime+0.08+k*0.015);
  } catch{}
}
function playTick() {
  try {
    const A=window.AudioContext||(window as any).webkitAudioContext; if(!A)return;
    const c=new A(),o=c.createOscillator(),g=c.createGain(); o.type="sine";
    o.frequency.value=500+Math.random()*300; g.gain.value=0.015;
    o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime+0.025);
  } catch{}
}

const tagCols: Record<string,string> = {
  Rainbow:"from-red-400/25 via-yellow-400/25 to-blue-400/25 text-pink-200", Burning:"from-orange-400/20 to-red-400/20 text-orange-300",
  Frozen:"from-cyan-400/20 to-blue-400/20 text-cyan-200", Dark:"from-slate-500/25 to-gray-600/25 text-slate-300",
  Radiant:"from-amber-300/20 to-yellow-200/20 text-amber-200", Hazardous:"from-lime-400/20 to-green-400/20 text-lime-300",
  Prismatic:"from-violet-400/20 to-purple-300/20 text-violet-200", Charged:"from-yellow-300/20 to-amber-300/20 text-yellow-200",
  Astral:"from-indigo-400/20 to-blue-400/20 text-indigo-200", Unstable:"from-red-400/20 to-pink-400/20 text-red-300",
  Glitched:"from-emerald-400/20 to-teal-400/20 text-emerald-200", Relic:"from-amber-500/20 to-orange-500/20 text-amber-300",
  Glowing:"from-purple-400/20 to-fuchsia-400/20 text-purple-200", Golden:"from-yellow-400/25 to-amber-300/25 text-yellow-200",
  Ethereal:"from-sky-300/20 to-cyan-300/20 text-sky-200", Abyssal:"from-fuchsia-500/20 to-purple-600/20 text-fuchsia-300",
  "Legendary Aura":"from-amber-400/25 to-yellow-400/25 text-amber-100", Godlike:"from-white/15 to-gray-200/15 text-white",
  Sparkling:"from-pink-300/20 to-rose-300/20 text-pink-200", Enchanted:"from-violet-300/20 to-indigo-300/20 text-violet-200",
  Ancient:"from-stone-400/20 to-amber-500/20 text-stone-200", Unique:"from-teal-400/20 to-emerald-300/20 text-teal-200",
};
const confCols = ["#f43f5e","#8b5cf6","#22d3ee","#f59e0b","#34d399","#ec4899","#fde047","#a78bfa"];

export default function App() {
  const comp = useMemo(() => createSlimeCompendium(), []);
  const byId = useMemo(() => Object.fromEntries(comp.map(s=>[s.id,s])) as Record<string,SlimeDefinition>, [comp]);
  const pools = useMemo(() => {
    const m = new Map<RarityKey,SlimeDefinition[]>();
    rarityList.forEach(r=>m.set(r.key,[]));
    comp.forEach(s=>m.get(s.rarity)?.push(s));
    return m;
  }, [comp]);

  const [save, setSave] = useState<Save>(() => loadSave(initSave));
  const [tab, setTab] = useState<"roll"|"upgrades"|"inventory"|"index"|"stats">("roll");
  const [rolling, setRolling] = useState(false);
  const [phase, setPhase] = useState<"idle"|"spin"|"reveal">("idle");
  const [spins, setSpins] = useState<SlimeDefinition[]>([]);
  const [si, setSi] = useState(0);
  const [result, setResult] = useState<RollResult|null>(null);
  const [shake, setShake] = useState("");
  const [dist, setDist] = useState(false);
  const [conf, setConf] = useState(false);
  const [afk, setAfk] = useState(0);
  const [search, setSearch] = useState("");
  const [rf, setRf] = useState<RarityKey|"All">("All");
  const [sortBy, setSortBy] = useState<"rarity"|"date"|"count">("rarity");
  const [detail, setDetail] = useState<string|null>(null);
  const autoRef = useRef<number|null>(null);

  const title = titles.find(t=>t.id===save.selectedTitle)?.label ?? "Rookie Roller";
  const invCap = 80 + save.upgradeLevels.inventorySize*10 + save.rebirths*15;
  const pLuck = 1 + save.rebirths*0.08;
  const shiny1in = Math.max(80, 500-save.upgradeLevels.shinyChance*18);
  const rbReq = Math.floor(rebirthRequirementBase * (1+save.totalRebirths*0.7));
  const colPct = Math.floor((save.ownedSlimes.length/comp.length)*100);
  const hiCount = useMemo(()=>Object.values(save.inventory).reduce((s,e)=>{const sl=byId[e.slimeId]; return sl&&rv(sl.rarity)>=rv("Mythic")?s+e.count:s;},0),[save.inventory,byId]);
  const rarest = useMemo(()=>save.ownedSlimes.map(id=>byId[id]).filter(Boolean).sort((a,b)=>rv(b.rarity)-rv(a.rarity))[0]??null,[save.ownedSlimes,byId]);

  const invList = useMemo(() => {
    return Object.entries(save.inventory)
      .map(([key,e])=>{const sl=byId[e.slimeId]; return sl?{key,entry:e,slime:sl}:null;})
      .filter(Boolean)
      .filter(x=>`${x!.slime.name} ${x!.slime.theme}`.toLowerCase().includes(search.toLowerCase())&&(rf==="All"||x!.slime.rarity===rf))
      .sort((a,b)=>{
        if(sortBy==="rarity") return rv(b!.slime.rarity)-rv(a!.slime.rarity);
        if(sortBy==="count") return b!.entry.count-a!.entry.count;
        return b!.entry.lastObtained-a!.entry.lastObtained;
      }) as {key:string;entry:InvEntry;slime:SlimeDefinition}[];
  }, [save.inventory,search,rf,sortBy,byId]);

  const qStatus = useMemo(()=>quests.map(q=>{let p=0;if(q.type==="rolls")p=save.totalRolls;if(q.type==="collection")p=save.ownedSlimes.length;if(q.type==="high")p=hiCount;return{...q,progress:p,complete:p>=q.target,claimed:save.claimedQuestIds.includes(q.id)};}),[save.totalRolls,save.ownedSlimes.length,hiCount,save.claimedQuestIds]);

  // AFK check on mount
  useEffect(()=>{
    const n=Date.now(),o=Math.floor((n-(save.lastSeenAt??n))/1000);
    if(o>30){
      const g=Math.floor(o*(1+save.upgradeLevels.currencyBoost*0.06));
      setSave(p=>({...p,currency:p.currency+g,totalCurrencyEarned:p.totalCurrencyEarned+g,lastSeenAt:n}));
      setAfk(g);
    }
  // eslint-disable-next-line
  }, []);

  useEffect(()=>{const id=setInterval(()=>setSave(p=>({...p,playtimeSeconds:p.playtimeSeconds+1})),1000);return()=>clearInterval(id);},[]);
  useEffect(()=>{const id=setInterval(()=>writeSave({...save,lastSeenAt:Date.now()}),5000);return()=>clearInterval(id);}, [save]);

  // Passive income from equipped slime: 10% of rarity value every 10 seconds
  useEffect(()=>{
    const id=setInterval(()=>{
      setSave(prev=>{
        const equipped = Object.values(prev.inventory).find(e=>e.equipped);
        if(!equipped) return prev;
        const sl = byId[equipped.slimeId];
        if(!sl) return prev;
        const val = rarityInfoMap[sl.rarity].currencyValue;
        const passive = Math.max(1, Math.floor(val * 0.1));
        return {...prev, currency: prev.currency + passive, totalCurrencyEarned: prev.totalCurrencyEarned + passive};
      });
    }, 10000);
    return ()=>clearInterval(id);
  },[byId]);

  useEffect(()=>{
    const u=[...save.unlockedTitles];
    if(save.totalRolls>=250&&!u.includes("collector"))u.push("collector");
    if(hiCount>=5&&!u.includes("mythhunter"))u.push("mythhunter");
    if(rarest?.rarity==="Void"&&!u.includes("voidwalker"))u.push("voidwalker");
    if(save.totalRebirths>=3&&!u.includes("reborn"))u.push("reborn");
    if(rarest?.rarity==="Omega"&&!u.includes("omega"))u.push("omega");
    if(u.length!==save.unlockedTitles.length)setSave(p=>({...p,unlockedTitles:u}));
  },[save.totalRolls,save.totalRebirths,save.unlockedTitles,hiCount,rarest]);

  const getRarity = useCallback(():RarityKey=>{
    const lf=1+save.upgradeLevels.luck*0.05+(pLuck-1)+0.12;const rb=1+save.upgradeLevels.rareMultiplier*0.08;
    const ul=rarityList.filter(r=>save.rebirths>=r.unlockRebirths);
    const w=ul.map((r,i)=>({key:r.key,weight:(1/r.odds)*(1+(i/rarityList.length)*(lf-1))*(rv(r.key)>=rv("Mythic")?rb:1)}));
    const tot=w.reduce((s,x)=>s+x.weight,0);let ptr=Math.random()*tot;
    for(const x of w){ptr-=x.weight;if(ptr<=0)return x.key;}return"Common";
  },[save.upgradeLevels.luck,save.upgradeLevels.rareMultiplier,save.rebirths,pLuck]);

  const doRoll = useCallback(async()=>{
    if(rolling)return;
    setRolling(true);
    setPhase("spin");
    // Do not clear the previous result immediately so the visual remains on screen until the spin starts

    const rarity=getRarity();
    const pool=pools.get(rarity)??[];
    const slime=pool[Math.floor(Math.random()*pool.length)]??comp[0];
    const pm=save.ownedGamepasses.includes("double_income")?2:1;
    const gained=Math.floor(rarityInfoMap[rarity].currencyValue*(1+save.upgradeLevels.currencyBoost*0.11+0.2)*pm);

    // Roll mutations independently
    // Big: 1 in 11, Huge: 1 in 20, Rainbow: 1 in 30, Shiny: 1 in 50, Lava: 1 in 100
    const muts: string[] = [];
    let oddsMult = 1;

    if (Math.random() < 1/11) { muts.push("big"); oddsMult *= 11; }
    if (Math.random() < 1/20) { muts.push("huge"); oddsMult *= 20; }
    if (Math.random() < 1/30) { muts.push("rainbow"); oddsMult *= 30; }
    if (Math.random() < 1/50) { muts.push("shiny"); oddsMult *= 50; }
    if (Math.random() < 1/100) { muts.push("lava"); oddsMult *= 100; }

    const combinedOdds = rarityInfoMap[rarity].odds * oddsMult;

    const sLen=14+Math.floor(Math.random()*5);
    const bSpd=Math.max(40,90-save.upgradeLevels.rollSpeed*2);
    const seq:SlimeDefinition[]=[];
    for(let i=0;i<sLen;i++){
      const rr=rarityList[Math.floor(Math.random()*Math.min(rarityList.length,8+save.rebirths*2))];
      const rP=pools.get(rr.key)??[];
      seq.push(rP[Math.floor(Math.random()*rP.length)]??comp[0]);
    }
    seq.push(slime);
    setSpins(seq);

    for(let i=0;i<seq.length;i++){
      setSi(i);
      playTick();
      const pr=i/seq.length;
      await sleep(bSpd+pr*pr*pr*350);
    }

    // REVEAL
    setPhase("reveal");
    const rank=rv(rarity);
    if(rank>=4){setShake("screen-shake");setTimeout(()=>setShake(""),500);}
    if(rank>=8){setShake("screen-shake-intense");setTimeout(()=>setShake(""),700);}
    if(rank>=11){setDist(true);setTimeout(()=>setDist(false),600);}
    if(rank>=5){setConf(true);setTimeout(()=>setConf(false),2200);}
    playTone(rarity);

    const res:RollResult={slime,rarity,mutations:muts,gained,combinedOdds};
    setResult(res);

    setSave(prev=>{
      const now=Date.now(),inv={...prev.inventory};
      // Key is slimeId + sorted mutation list to group identical mutation variants together
      const mutHash = [...muts].sort().join("-");
      const invKey = mutHash ? `${slime.id}-${mutHash}` : slime.id;
      const ex=inv[invKey];

      if(!ex&&Object.keys(inv).length>=invCap) {
        return {
          ...prev,
          currency: prev.currency + Math.floor(gained * 0.6),
          totalCurrencyEarned: prev.totalCurrencyEarned + Math.floor(gained * 0.6),
          totalRolls: prev.totalRolls + 1,
          newestRarity: rank>rv(prev.newestRarity)?rarity:prev.newestRarity
        };
      }

      inv[invKey]={
        slimeId: slime.id,
        mutations: muts,
        count: (ex?.count??0)+1,
        shinyCount: (ex?.shinyCount??0)+(muts.includes("shiny")?1:0),
        favorite: ex?.favorite??false,
        equipped: ex?.equipped??false,
        isNew: true,
        firstObtained: ex?.firstObtained??now,
        lastObtained: now
      };

      return {
        ...prev,
        inventory: inv,
        ownedSlimes: prev.ownedSlimes.includes(slime.id) ? prev.ownedSlimes : [...prev.ownedSlimes, slime.id],
        currency: prev.currency + gained,
        totalCurrencyEarned: prev.totalCurrencyEarned + gained,
        totalRolls: prev.totalRolls + 1,
        newestRarity: rank>rv(prev.newestRarity)?rarity:prev.newestRarity
      };
    });

    // Make it stay on reveal, do not revert to idle!
    setRolling(false);
  }, [rolling, getRarity, pools, comp, shiny1in, save.ownedGamepasses, save.upgradeLevels.currencyBoost, save.upgradeLevels.rollSpeed, save.rebirths, invCap]);

  // Auto roll check
  useEffect(()=>{
    if(!save.autoRollEnabled||rolling)return;
    const pm=save.ownedGamepasses.includes("hyper_auto")?0.65:1;
    const iv=Math.max(500,(2600-save.upgradeLevels.autoRoll*90-save.rebirths*40)*pm);
    autoRef.current=window.setTimeout(()=>{void doRoll();},iv);
    return()=>{if(autoRef.current)clearTimeout(autoRef.current);};
  },[save.autoRollEnabled,save.upgradeLevels.autoRoll,save.rebirths,save.ownedGamepasses,rolling,doRoll]);

  const buyUpg=(id:(typeof upgrades)[number]["id"])=>{
    const u=upgrades.find(x=>x.id===id)!;
    const lv=save.upgradeLevels[id];
    if(lv>=u.maxLevel)return;
    const c=costFor(u.baseCost,u.growth,lv);
    if(save.currency<c)return;
    setSave(p=>({...p,currency:p.currency-c,upgradeLevels:{...p.upgradeLevels,[id]:p.upgradeLevels[id]+1}}));
  };

  const doRb=()=>{
    if(save.currency<rbReq)return;
    setSave(p=>({...p,rebirths:p.rebirths+1,totalRebirths:p.totalRebirths+1,currency:0,upgradeLevels:defUL,autoRollEnabled:false}));
    setShake("screen-shake-intense");
    setTimeout(()=>setShake(""),700);
  };

  const claimD=()=>{
    const t=new Date().toDateString();
    if(save.lastDailyClaimDate===t)return;
    const ns=save.lastDailyClaimDate===new Date(Date.now()-86400000).toDateString()?Math.min(6,save.dailyStreak+1):0;
    setSave(p=>({...p,dailyStreak:ns,lastDailyClaimDate:t,currency:p.currency+dailyRewardTable[ns],totalCurrencyEarned:p.totalCurrencyEarned+dailyRewardTable[ns]}));
  };

  const claimQ=(id:string,r:number)=>{
    if(save.claimedQuestIds.includes(id))return;
    setSave(p=>({...p,claimedQuestIds:[...p.claimedQuestIds,id],currency:p.currency+r,totalCurrencyEarned:p.totalCurrencyEarned+r}));
  };

  const togFav=(id:string)=>setSave(p=>{
    const e=p.inventory[id]; if(!e)return p;
    return{...p,inventory:{...p.inventory,[id]:{...e,favorite:!e.favorite,isNew:false}}};
  });

  const equip=(id:string)=>setSave(p=>{
    const inv:Save["inventory"]={};
    Object.entries(p.inventory).forEach(([k,v])=>{
      inv[k]={...v,equipped:k===id,isNew:k===id?false:v.isNew};
    });
    return{...p,inventory:inv};
  });

  const buyP=(id:string,c:number)=>{
    if(save.ownedGamepasses.includes(id)||save.gems<c)return;
    setSave(p=>({...p,gems:p.gems-c,ownedGamepasses:[...p.ownedGamepasses,id]}));
  };

  const cSpin=spins[si]??null;
  const dSlime=phase==="spin"?cSpin:(result?.slime??null);
  const dRar=dSlime?rarityInfoMap[dSlime.rarity]:null;

  // Compute equipped slime passive income for display
  const equippedEntry = useMemo(()=>Object.entries(save.inventory).find(([,e])=>e.equipped),[save.inventory]);
  const equippedSlime = equippedEntry ? byId[equippedEntry[1].slimeId] : null;
  const passiveIncome = equippedSlime ? Math.max(1, Math.floor(rarityInfoMap[equippedSlime.rarity].currencyValue * 0.1)) : 0;

  // Compute upgrade effect descriptions
  const upgradeEffect = (id: string, lv: number): string => {
    switch(id) {
      case "rollSpeed": { const ms = Math.max(40, 90 - lv * 2); return `${ms}ms base tick`; }
      case "luck": return `+${(lv * 5).toFixed(0)}% luck`;
      case "multiRoll": return `${1 + Math.floor(lv / 3)} rolls/tap`;
      case "autoRoll": { const ms = Math.max(500, 2600 - lv * 90); return `${(ms/1000).toFixed(1)}s interval`; }
      case "rareMultiplier": return `+${(lv * 8).toFixed(0)}% Mythic+`;
      case "inventorySize": return `${80 + lv * 10 + save.rebirths * 15} slots`;
      case "shinyChance": { const s = Math.max(80, 500 - lv * 18); return `1/${s} shiny`; }
      case "currencyBoost": return `+${(lv * 11).toFixed(0)}% credits`;
      default: return "";
    }
  };

  // Mutation labels mapping
  const mutationLabel = (m: string) => {
    switch (m) {
      case "big": return "Big";
      case "huge": return "Huge";
      case "rainbow": return "Rainbow";
      case "shiny": return "Shiny";
      case "lava": return "Lava";
      default: return m;
    }
  };

  return (
    <div className={`relative min-h-dvh text-white ${shake}`} style={{background:"linear-gradient(170deg,#1a103a,#0f0a25 50%,#150d30)"}}>
      <div className="bg-stars" />
      {dist && <div className="distortion-overlay" />}
      <AnimatePresence>{conf&&(<motion.div key="c" className="pointer-events-none fixed inset-0 z-50 overflow-hidden" initial={{opacity:1}} exit={{opacity:0}}>{Array.from({length:50}).map((_,i)=>(<div key={i} className="confetti-piece" style={{left:`${Math.random()*100}%`,top:`${-5-Math.random()*10}%`,backgroundColor:confCols[i%confCols.length],animationDelay:`${Math.random()*0.5}s`,animationDuration:`${1.5+Math.random()*0.8}s`,width:`${5+Math.random()*6}px`,height:`${5+Math.random()*6}px`,borderRadius:Math.random()>0.5?"50%":"3px"}}/>))}</motion.div>)}</AnimatePresence>

      {/* ─── Header ─── */}
      <header className="relative z-10 border-b-[3px] border-purple-500/20 bg-[rgba(26,16,58,0.9)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-purple-400/30 bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-purple-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="14" r="9" fill="rgba(255,255,255,0.9)" stroke="#7c3aed" strokeWidth="2"/><circle cx="9" cy="12" r="2" fill="#7c3aed"/><circle cx="15" cy="12" r="2" fill="#7c3aed"/><path d="M9 16Q12 18.5 15 16" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            </div>
            <div>
              <h1 className="text-base font-extrabold leading-tight tracking-tight md:text-lg" style={{textShadow:"0 2px 8px rgba(139,92,246,0.3)"}}>SLIME RNG</h1>
              <p className="text-[10px] font-bold leading-none text-purple-300/50">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="coin-badge"><IconCoin size={14} />{fmtN(save.currency)}{passiveIncome > 0 && <span className="ml-1 text-[9px] text-emerald-300/70">+{passiveIncome}/10s</span>}</div>
            <div className="gem-badge"><IconGem size={14} />{save.gems}</div>
          </div>
        </div>
      </header>

      {/* ─── Tabs ─── */}
      <nav className="relative z-10 border-b-[3px] border-purple-500/10 bg-[rgba(20,12,48,0.7)]">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
          {([["roll","Roll",IconRoll],["upgrades","Upgrades",IconUpgrades],["inventory","Inventory",IconInventory],["index","Index",IconTrophy],["stats","Stats",IconStats]] as const).map(([k,l,Ic])=>(
            <button key={k} onClick={()=>setTab(k as any)} className={`tab-btn ${tab===k?"active":""}`}><Ic size={15} />{l}</button>
          ))}
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-5">

        {/* ═══ ROLL ═══ */}
        {tab==="roll"&&(
          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="roll-stage flex flex-col items-center px-5 py-8 md:px-10 md:py-10">
              <div className="relative mb-3 flex h-[220px] w-[220px] items-center justify-center md:h-[260px] md:w-[260px]">
                {dRar&&<div className="absolute inset-0 rounded-full opacity-30 blur-3xl transition-all duration-300" style={{background:dRar.color}}/>}
                <AnimatePresence mode="wait">
                  {dSlime?(
                    <motion.div key={phase==="reveal"?`f-${dSlime.id}`:`s-${si}`}
                      initial={phase==="reveal"?{scale:0.2,opacity:0,rotate:-10}:{y:40,opacity:0}}
                      animate={phase==="reveal"?{scale:1,opacity:1,rotate:0}:{y:0,opacity:1}}
                      exit={phase==="spin"?{y:-40,opacity:0}:{opacity:0}}
                      transition={phase==="reveal"?{type:"spring",stiffness:280,damping:16}:{duration:0.06}}
                      className="flex flex-col items-center">
                      {phase==="reveal"&&<div className="reveal-flash pointer-events-none absolute -inset-12 rounded-full" style={{background:`radial-gradient(circle,${dRar?.glow??"transparent"},transparent 60%)`}}/>}
                      <SlimeRenderer
                        slime={dSlime}
                        size={phase==="reveal"?200:140}
                        bouncing={phase==="reveal"}
                        glowing={phase==="reveal"}
                        mutations={phase==="reveal" ? (result?.mutations ?? []) : []}
                      />
                    </motion.div>
                  ):(
                    <motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-dashed border-purple-400/20 text-5xl text-purple-300/15">?</div>
                      <p className="text-sm font-bold text-purple-200/25">Tap ROLL to discover!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Info */}
              <div className="mb-5 min-h-[110px] w-full max-w-sm">
                <AnimatePresence mode="wait">
                  {phase==="reveal" && result ? (
                    <motion.div key={`i-${result.slime.id}`} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.08}} className="flex flex-col items-center gap-2 text-center">
                      {result.mutations.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1">
                          {result.mutations.map(m => (
                            <span key={m} className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white shadow-md">
                              {mutationLabel(m)} Mutation
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="text-xl font-extrabold tracking-tight md:text-2xl" style={{textShadow:`0 2px 12px ${rarityInfoMap[result.rarity].glow}`}}>{result.slime.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border-2 border-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider" style={{background:rarityInfoMap[result.rarity].bg,color:"#fff",boxShadow:`0 0 18px ${rarityInfoMap[result.rarity].glow}`}}>{result.rarity}</span>
                      </div>
                      <p className="text-lg font-extrabold tabular-nums animate-pulse" style={{color:rarityInfoMap[result.rarity].color,textShadow:`0 0 10px ${rarityInfoMap[result.rarity].glow}`}}>
                        1 in {result.combinedOdds.toLocaleString()} Chance
                      </p>
                      <div className="flex flex-wrap justify-center gap-1">{result.slime.tags.map(t=><span key={t} className={`tag-pill bg-gradient-to-r ${tagCols[t]??"from-white/5 to-white/5 text-white/50"}`}>{t}</span>)}</div>
                      <p className="flex items-center gap-1 text-xs font-bold text-yellow-300/60"><IconCoin size={12} />+{result.gained.toLocaleString()}</p>
                    </motion.div>
                  ):phase==="spin"&&dSlime?(
                    <motion.div key={`sp-${si}`} initial={{opacity:0}} animate={{opacity:0.5}} exit={{opacity:0}} transition={{duration:0.04}} className="flex flex-col items-center gap-1 text-center">
                      <p className="text-sm font-bold text-white/35">{dSlime.name}</p>
                      <span className="text-xs font-extrabold" style={{color:rarityInfoMap[dSlime.rarity].color}}>{dSlime.rarity}</span>
                      <span className="text-[10px] font-bold text-white/20">1 in {rarityInfoMap[dSlime.rarity].odds.toLocaleString()}</span>
                    </motion.div>
                  ):result ? (
                    // When idle after a roll, keep displaying the previous reveal result
                    <motion.div key={`prev-${result.slime.id}`} className="flex flex-col items-center gap-2 text-center">
                      {result.mutations.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1">
                          {result.mutations.map(m => (
                            <span key={m} className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                              {mutationLabel(m)} Mutation
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">{result.slime.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border-2 border-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider" style={{background:rarityInfoMap[result.rarity].bg,color:"#fff"}}>{result.rarity}</span>
                      </div>
                      <p className="text-lg font-extrabold tabular-nums animate-pulse" style={{color:rarityInfoMap[result.rarity].color}}>
                        1 in {result.combinedOdds.toLocaleString()} Chance
                      </p>
                    </motion.div>
                  ) : (<div className="h-16"/>)}
                </AnimatePresence>
              </div>

              <button onClick={()=>void doRoll()} disabled={rolling} className="roll-btn w-full max-w-xs px-6 py-4 text-lg">
                {rolling?"ROLLING...":"ROLL!"}
              </button>
              <div className="mt-3 flex items-center gap-3 text-[11px]">
                <button onClick={()=>setSave(p=>({...p,autoRollEnabled:!p.autoRollEnabled}))} className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 font-bold transition ${save.autoRollEnabled?"border-purple-400/50 bg-purple-500/20 text-purple-200":"border-white/10 text-white/30 hover:border-purple-400/30"}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M21 12a9 9 0 11-6-8.5"/><path d="M21 3v5h-5"/></svg>
                  Auto {save.autoRollEnabled?"ON":"OFF"}
                </button>
                <span className="font-bold text-white/20"><IconShiny size={12} /> 1/{shiny1in}</span>
              </div>
              <p className="mt-2 text-[10px] font-bold text-white/15">Luck x{(pLuck+save.upgradeLevels.luck*0.05).toFixed(2)}</p>
            </div>

            {/* Right side: daily + quests + drop table */}
            <div className="space-y-4">
              <div className="panel p-4">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconCalendar size={14} color="#a78bfa" />Daily & Quests</h3>
                <button onClick={claimD} disabled={save.lastDailyClaimDate===new Date().toDateString()} className="mb-2 w-full rounded-xl border-2 border-amber-400/20 bg-amber-400/[0.06] p-3 text-left transition hover:bg-amber-400/[0.1] disabled:opacity-30">
                  <div className="text-sm font-extrabold text-amber-200/80">Daily Reward — Day {save.dailyStreak+1}/7</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white/30"><IconCoin size={11} />{dailyRewardTable[Math.min(6,save.dailyStreak)]}</div>
                </button>
                {qStatus.map(q=>(
                  <button key={q.id} onClick={()=>q.complete&&!q.claimed&&claimQ(q.id,q.reward)} disabled={!q.complete||q.claimed} className="mb-1.5 w-full rounded-xl border-2 border-white/[0.06] bg-white/[0.02] p-3 text-left disabled:opacity-25">
                    <div className="flex items-center justify-between"><span className="text-xs font-bold text-white/50"><IconTrophy size={12} color="#a78bfa" /> {q.label}</span><span className={`font-extrabold text-xs ${q.complete?"text-emerald-400":"text-white/20"}`}>{Math.min(q.target,q.progress)}/{q.target}</span></div>
                    <div className="progress-bar mt-1.5"><div className="progress-fill" style={{width:`${Math.min(100,(q.progress/q.target)*100)}%`}}/></div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-white/25">{q.claimed?"Claimed":<><IconCoin size={10} />{q.reward}</>}</div>
                  </button>
                ))}
              </div>
              <div className="panel p-4">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconStar size={14} color="#a78bfa" />Drop Table</h3>
                <div className="space-y-0.5">{rarityList.filter(r=>save.rebirths>=r.unlockRebirths).map(r=>(
                  <div key={r.key} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[11px] transition hover:bg-white/[0.03]">
                    <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full border-2" style={{backgroundColor:r.color,borderColor:r.color,boxShadow:`0 0 8px ${r.glow}`}}/><span className="font-bold" style={{color:r.color}}>{r.key}</span></div>
                    <span className="font-mono font-bold text-white/25">1 in {r.odds.toLocaleString()}</span>
                  </div>
                ))}{rarityList.filter(r=>save.rebirths<r.unlockRebirths).length>0&&<p className="pt-1 text-center text-[9px] font-bold text-white/15">+{rarityList.filter(r=>save.rebirths<r.unlockRebirths).length} locked</p>}</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ UPGRADES ═══ */}
        {tab==="upgrades"&&(
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconUpgrades size={15} color="#a78bfa" />Upgrades</h2>
              {upgrades.map(u=>{
                const lv=save.upgradeLevels[u.id],c=costFor(u.baseCost,u.growth,lv),mx=lv>=u.maxLevel;
                const eff = upgradeEffect(u.id, lv);
                return(
                  <button key={u.id} onClick={()=>buyUpg(u.id)} className="upgrade-card" disabled={mx||save.currency<c}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-purple-400/20 bg-purple-500/10">
                      <UpgradeIcon id={u.id} size={18} color="#c4b5fd" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold">{u.label}</span>
                        <span className="rounded-lg border-2 border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] font-bold text-white/35">Lv {lv}/{u.maxLevel}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-white/25">{u.description}</p>
                      {lv > 0 && <p className="text-[10px] font-extrabold text-emerald-400/70">Current: {eff}</p>}
                      <div className="progress-bar mt-1.5"><div className="progress-fill" style={{width:`${(lv/u.maxLevel)*100}%`}}/></div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-300/50">{mx?"MAX":<><IconCoin size={11} /> {fmtN(c)}</>}</span>
                        {!mx && lv < u.maxLevel && <span className="text-[10px] font-bold text-cyan-300/40">Next: {upgradeEffect(u.id, lv+1)}</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="space-y-4">
              <div className="panel p-5">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconRebirth size={15} color="#d946ef" />Rebirth</h3>
                <p className="mb-3 text-xs font-semibold text-white/25">Reset upgrades → permanent luck + new tiers</p>
                <div className="mb-3"><div className="mb-1 flex justify-between text-[11px] font-bold"><span className="text-white/30">Progress</span><span className="text-white/40">{fmtN(save.currency)} / {fmtN(rbReq)}</span></div><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,(save.currency/rbReq)*100)}%`,background:"linear-gradient(90deg,#d946ef,#a855f7)"}}/></div></div>
                <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] font-bold text-white/30"><div>Rebirths: <span className="text-white/60">{save.rebirths}</span></div><div>Luck: <span className="text-amber-300/80">+{((pLuck-1)*100).toFixed(0)}%</span></div></div>
                <button onClick={doRb} disabled={save.currency<rbReq} className="w-full rounded-2xl border-[3px] border-fuchsia-400/30 bg-gradient-to-r from-fuchsia-500/15 to-purple-500/15 px-4 py-3 text-sm font-extrabold tracking-wide transition hover:from-fuchsia-500/25 hover:to-purple-500/25 disabled:opacity-20" style={{boxShadow:"0 4px 0 rgba(162,28,175,0.3)"}}>Rebirth Now</button>
              </div>
              <div className="panel p-5">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconGem size={15} color="#22d3ee" />Premium</h3>
                {passes.map(p=>(
                  <button key={p.id} onClick={()=>buyP(p.id,p.cost)} disabled={save.ownedGamepasses.includes(p.id)||save.gems<p.cost} className="upgrade-card mb-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-cyan-400/20 bg-cyan-500/10"><IconGem size={18} color="#67e8f9" /></div>
                    <div className="min-w-0 flex-1"><div className="flex justify-between"><span className="text-sm font-extrabold">{p.name}</span><span className="text-[11px] font-bold text-cyan-300/50">{save.ownedGamepasses.includes(p.id)?"Owned":`${p.cost} gems`}</span></div><p className="text-[11px] font-semibold text-white/25">{p.desc}</p></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ INVENTORY ═══ */}
        {tab==="inventory"&&(
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="flex h-9 items-center gap-1.5 rounded-xl border-2 border-white/[0.08] bg-white/[0.03] px-3"><IconSearch size={13} color="rgba(255,255,255,0.25)" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-24 border-none bg-transparent text-xs font-bold outline-none placeholder:text-white/15 focus:border-violet-400/40" /></div>
              <select value={rf} onChange={e=>setRf(e.target.value as any)} className="h-9 rounded-xl border-2 border-white/[0.08] bg-white/[0.03] px-2 text-xs font-bold"><option value="All">All Rarities</option>{rarityList.map(r=><option key={r.key} value={r.key}>{r.key}</option>)}</select>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="h-9 rounded-xl border-2 border-white/[0.08] bg-white/[0.03] px-2 text-xs font-bold"><option value="rarity">Rarity</option><option value="date">Recent</option><option value="count">Count</option></select>
              <span className="ml-auto text-[10px] font-bold text-white/20">{Object.keys(save.inventory).length}/{invCap} — {colPct}%</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {invList.map(({key:invKey,slime,entry})=>{
                const ri=rarityInfoMap[slime.rarity];const open=detail===invKey;
                const isEquipped = entry.equipped;
                const slimeVal = rarityInfoMap[slime.rarity].currencyValue;
                const slimePassive = Math.max(1, Math.floor(slimeVal * 0.1));
                return(
                  <div key={invKey} className="inv-card" onClick={()=>setDetail(open?null:invKey)} style={{borderColor: isEquipped ? "#34d39950" : `${ri.color}25`}}>
                    <div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white/[0.02]" style={{background:`radial-gradient(circle,${ri.glow},rgba(20,10,50,0.3))`}}>
                      <SlimeRenderer slime={slime} size={72} bouncing glowing={rv(slime.rarity)>=4} mutations={entry.mutations} />
                      {entry.isNew&&<div className="absolute right-1.5 top-1.5 rounded-lg border-2 border-cyan-300/40 bg-cyan-400/80 px-1.5 py-0.5 text-[8px] font-extrabold text-black shadow">NEW</div>}
                      {entry.mutations.includes("shiny")&&<div className="absolute left-1.5 top-1.5 rounded-lg border-2 border-yellow-300/40 bg-yellow-400/80 px-1.5 py-0.5 text-[8px] font-extrabold text-black shadow">SHINY</div>}
                      {isEquipped&&<div className="absolute left-1.5 bottom-1.5 rounded-lg border-2 border-emerald-400/50 bg-emerald-500/80 px-1.5 py-0.5 text-[7px] font-extrabold text-white shadow">EQUIPPED</div>}
                      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 rounded-lg border-2 border-white/20 bg-black/60 px-2 py-0.5 text-[11px] font-extrabold backdrop-blur-sm">x{entry.count}</div>
                    </div>
                    <p className="truncate text-[11px] font-extrabold">{slime.name}</p>
                    {entry.mutations.length > 0 && (
                      <p className="truncate text-[9px] font-extrabold text-pink-300/85">
                        ({entry.mutations.map(mutationLabel).join(", ")})
                      </p>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-extrabold" style={{color:ri.color}}>{slime.rarity}</span>
                      <span className="text-[9px] font-bold text-white/15">1/{ri.odds.toLocaleString()}</span>
                    </div>
                    {isEquipped && <p className="text-[9px] font-bold text-emerald-400/60"><IconCoin size={9} /> +{slimePassive}/10s passive</p>}
                    {open&&(
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} className="mt-2 space-y-2 overflow-hidden">
                        <div className="flex flex-wrap gap-1">{slime.tags.map(t=><span key={t} className={`tag-pill bg-gradient-to-r ${tagCols[t]??"from-white/5 to-white/5 text-white/40"}`}>{t}</span>)}</div>
                        <p className="text-[9px] font-bold text-white/25">Value: {fmtN(slimeVal)} | Passive: +{slimePassive}/10s</p>
                        <div className="flex gap-1.5">
                          <button onClick={e=>{e.stopPropagation();togFav(invKey);}} className={`flex items-center gap-1 rounded-lg border-2 px-2 py-1 text-[9px] font-bold ${entry.favorite?"border-pink-400/40 text-pink-300":"border-white/10 text-white/20"}`}><IconHeart size={10} color={entry.favorite?"#f472b6":"currentColor"} />Fav</button>
                          <button onClick={e=>{e.stopPropagation();equip(invKey);}} className={`flex items-center gap-1 rounded-lg border-2 px-2 py-1 text-[9px] font-bold ${isEquipped?"border-emerald-400/40 text-emerald-300":"border-white/10 text-white/20"}`}><IconStar size={10} color={isEquipped?"#34d399":"currentColor"} />{isEquipped?"Equipped":"Equip"}</button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              {invList.length===0&&<div className="col-span-full py-16 text-center text-sm font-bold text-white/15">{search||rf!=="All"?"No matches":"Empty — go roll!"}</div>}
            </div>
          </div>
        )}

        {/* ═══ INDEX TAB ═══ */}
        {tab==="index"&&(
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="flex h-9 items-center gap-1.5 rounded-xl border-2 border-white/[0.08] bg-white/[0.03] px-3"><IconSearch size={13} color="rgba(255,255,255,0.25)" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Index..." className="w-32 border-none bg-transparent text-xs font-bold outline-none placeholder:text-white/15" /></div>
              <select value={rf} onChange={e=>setRf(e.target.value as any)} className="h-9 rounded-xl border-2 border-white/[0.08] bg-white/[0.03] px-2 text-xs font-bold"><option value="All">All Rarities</option>{rarityList.map(r=><option key={r.key} value={r.key}>{r.key}</option>)}</select>
              <span className="ml-auto text-[10px] font-bold text-white/20">{save.ownedSlimes.length}/{comp.length} Unlocked ({colPct}%)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {comp
                .filter(slime => `${slime.name} ${slime.theme}`.toLowerCase().includes(search.toLowerCase()) && (rf === "All" || slime.rarity === rf))
                .map((slime) => {
                  const unlocked = save.ownedSlimes.includes(slime.id);
                  const ri = rarityInfoMap[slime.rarity];
                  return (
                    <div key={slime.id} className="inv-card select-none" style={{ borderColor: unlocked ? `${ri.color}25` : "rgba(255,255,255,0.05)" }}>
                      <div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white/[0.01]" style={{ background: unlocked ? `radial-gradient(circle,${ri.glow},rgba(20,10,50,0.1))` : undefined }}>
                        <div style={{ filter: unlocked ? undefined : "brightness(0)" }}>
                          <SlimeRenderer slime={slime} size={72} bouncing={unlocked} glowing={unlocked && rv(slime.rarity) >= 4} />
                        </div>
                        {!unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-purple-300/30">?</div>
                        )}
                      </div>
                      <p className="truncate text-[11px] font-extrabold">{unlocked ? slime.name : "Locked Slime"}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-extrabold" style={{ color: unlocked ? ri.color : "rgba(255,255,255,0.25)" }}>{slime.rarity}</span>
                        <span className="text-[9px] font-bold text-white/15">1/{ri.odds.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ═══ STATS ═══ */}
        {tab==="stats"&&(
          <div className="grid gap-5 md:grid-cols-2">
            <div className="panel p-5">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconStats size={15} color="#a78bfa" />Statistics</h3>
              <div className="space-y-2.5">{([
                ["Total Rolls",save.totalRolls.toLocaleString()],["Rebirths",String(save.totalRebirths)],
                ["Playtime",`${Math.floor(save.playtimeSeconds/3600)}h ${Math.floor((save.playtimeSeconds%3600)/60)}m`],
                ["Collection",`${colPct}% (${save.ownedSlimes.length}/${comp.length})`],
                ["Rarest",rarest?`${rarest.name}`:"None"],["Luck",`x${(pLuck+save.upgradeLevels.luck*0.05).toFixed(2)}`],
                ["Credits Earned",fmtN(save.totalCurrencyEarned)],["High Pulls",String(hiCount)],
              ] as const).map(([l,v])=>(
                <div key={l} className="flex items-center justify-between border-b-2 border-white/[0.04] pb-2 text-xs"><span className="font-bold text-white/30">{l}</span><span className="font-extrabold text-white/70">{v}</span></div>
              ))}</div>
            </div>
            <div className="space-y-4">
              <div className="panel p-5">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconTrophy size={15} color="#fbbf24" />Titles</h3>
                <div className="space-y-1.5">{titles.map(t=>{const o=save.unlockedTitles.includes(t.id);return(
                  <button key={t.id} onClick={()=>o&&setSave(p=>({...p,selectedTitle:t.id}))} disabled={!o} className={`w-full rounded-xl border-2 px-3 py-2.5 text-left text-xs font-bold transition ${save.selectedTitle===t.id?"border-purple-400/40 bg-purple-500/15 text-purple-200":o?"border-white/[0.06] text-white/45 hover:border-purple-400/20":"border-white/[0.03] text-white/12"}`}>{t.label}{!o&&<span className="ml-2 text-[9px] text-white/10">Locked</span>}</button>
                );})}</div>
              </div>
              <div className="panel p-5">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300/50"><IconCalendar size={15} color="#a78bfa" />Playtime Rewards</h3>
                {[10,30,60,120].map((m,i)=>{const cl=save.claimedPlaytimeRewards.includes(m),rd=save.playtimeSeconds>=m*60,rw=450*(i+1);return(
                  <button key={m} onClick={()=>{if(rd&&!cl)setSave(p=>({...p,claimedPlaytimeRewards:[...p.claimedPlaytimeRewards,m],currency:p.currency+rw,totalCurrencyEarned:p.totalCurrencyEarned+rw}));}} disabled={!rd||cl} className="mb-1.5 w-full rounded-xl border-2 border-white/[0.06] bg-white/[0.02] p-2.5 text-left text-xs font-bold disabled:opacity-20">
                    <div className="flex justify-between"><span>{m}min</span><span className="flex items-center gap-1 text-emerald-300/50">{cl?"Claimed":<><IconCoin size={10} />+{rw}</>}</span></div>
                  </button>);
                })}
              </div>
              <div className="panel p-5">
                <button onClick={()=>{if(confirm("Delete all data?")){clearSave();window.location.reload();}}} className="w-full rounded-xl border-2 border-red-500/20 bg-red-500/[0.05] px-3 py-2.5 text-xs font-bold text-red-300/45 transition hover:bg-red-500/[0.1]">Reset All Data</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AFK toast */}
      <AnimatePresence>{afk>0&&(
        <motion.div initial={{opacity:0,y:40,scale:0.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:40}} className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border-[3px] border-purple-400/30 bg-[rgba(26,16,58,0.95)] px-5 py-4 backdrop-blur-xl">
          <div className="text-sm font-extrabold">Welcome back!</div>
          <div className="flex items-center gap-1 text-xs font-bold text-white/40">Earned <span className="text-purple-300">{afk.toLocaleString()}</span> credits</div>
          <button className="mt-2 text-xs font-extrabold text-purple-400" onClick={()=>setAfk(0)}>Dismiss</button>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
