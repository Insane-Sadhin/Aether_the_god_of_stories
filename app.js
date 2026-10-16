import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import htm from "htm";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";

const html = htm.bind(React.createElement);

const ease = [0.16, 1, 0.3, 1];
const fade = { initial:{ opacity:0, y:42 }, whileInView:{ opacity:1, y:0 }, viewport:{ once:true, margin:"-12%" }, transition:{ duration:.9, ease } };

const powers = [
  ["Sorcery", "Mastery of Asgardian magic: enchantment, energy projection, teleportation, astral projection, and protective wards.", 98, "✦"],
  ["Illusion", "Creates flawless sensory doubles, disguises, and environments—deceptions that can carry strategic substance.", 100, "◈"],
  ["Shapeshifting", "Assumes other bodies and forms across sex, species, and scale; identity is one of Loki’s most potent weapons.", 94, "◇"],
  ["Mindcraft", "Hypnosis, memory alteration, telepathy, and possession—used with finesse as often as force.", 89, "⌁"],
  ["Asgardian Physiology", "Superhuman strength, speed, durability, longevity, and resilience beyond mortal measure.", 82, "ϟ"],
  ["Genius & Guile", "A polymath tactician who turns language, law, prophecy, and expectation into instruments of victory.", 100, "♚"]
];

const costumes = [
  { era:"1962", title:"The Silver Age", sub:"JOURNEY INTO MYSTERY #85", color:"#e0bf59", desc:"Horned helm, scale mail, green leggings, and an operatic silhouette—the visual grammar of the classic trickster." },
  { era:"2010", title:"The Reborn Child", sub:"THOR #617", color:"#7cd59a", desc:"A younger Loki in practical Asgardian layers, carrying the burden of a predecessor’s crimes and a fragile chance to change." },
  { era:"2014", title:"Agent of Asgard", sub:"LOKI: AGENT OF ASGARD #1", color:"#54ef8d", desc:"A tailored black-and-green coat, sharp boots, and a broken-horn crown: espionage elegance for a god rewriting his own story." },
  { era:"2019", title:"King of Jotunheim", sub:"LOKI (2019) #1", color:"#79c9bf", desc:"Frost-blue regalia, fur, and royal gold mark Loki’s uneasy reign over the realm of his birth." },
  { era:"2023", title:"God of Stories", sub:"IMMORTAL THOR", color:"#b9ffcf", desc:"Myth made luminous: an archetypal silhouette shaped by narrative power, magic, and earned self-knowledge." }
];

const variants = [
  { name:"Lady Loki", tag:"THE BORROWED FORM", issue:"THOR #5 · 2008", tone:"#93f8ae", copy:"After Ragnarök, Loki returns in the body intended for Sif. The form becomes more than disguise: a challenge to every stable assumption about Loki’s identity." },
  { name:"Kid Loki", tag:"THE SECOND CHANCE", issue:"THOR #617 · 2010", tone:"#d7b959", copy:"Reborn without the full weight of his former self, the young trickster seeks redemption while Asgard—and his own shadow—expects betrayal." },
  { name:"Ikol", tag:"THE MAGPIE’S GHOST", issue:"JOURNEY INTO MYSTERY #622", tone:"#86d9c2", copy:"An echo of the old Loki preserved as a magpie. Mentor, tempter, contingency plan: proof that Loki’s most dangerous enemy is often Loki." },
  { name:"Agent Loki", tag:"THE STORYBREAKER", issue:"AGENT OF ASGARD #1 · 2014", tone:"#5df195", copy:"Missions for the All-Mother erase crimes from Asgard’s record—but each victory asks whether a reputation can be changed without changing the tale." },
  { name:"Sylvie", tag:"THE ENCHANTRESS", issue:"DARK REIGN: YOUNG AVENGERS #1", tone:"#e7cc72", copy:"A mortal transformed by Loki into a sorceress, Sylvie Lushton becomes an Enchantress in her own right—a living experiment in authored identity." },
  { name:"President Loki", tag:"VOTE LOKI", issue:"VOTE LOKI #1 · 2016", tone:"#77e993", copy:"Candidate, provocateur, mirror: Loki campaigns for the presidency by telling voters the one truth politics avoids—everyone knows they are being lied to." }
];

const stories = [
  { n:"01", year:"1962", title:"The Birth of a Trickster", source:"JOURNEY INTO MYSTERY #85", copy:"Stan Lee, Larry Lieber, and Jack Kirby introduce Marvel’s modern Loki: Thor’s adopted brother and an architect of impossible trouble.", colors:["#203e29","#0b120d"] },
  { n:"02", year:"2011–2013", title:"Journey Into Mystery", source:"ISSUES #622–645", copy:"Kieron Gillen’s Kid Loki epic turns reincarnation into tragedy, asking whether a child can outrun the story everyone else has written for him.", colors:["#5f5622","#0b130d"] },
  { n:"03", year:"2014–2015", title:"Agent of Asgard", source:"ISSUES #1–17", copy:"Al Ewing and Lee Garbett recast Loki as a secret agent battling his own narrative destiny—and transforming from God of Lies into God of Stories.", colors:["#135232","#060a07"] },
  { n:"04", year:"2016", title:"Vote Loki", source:"ISSUES #1–4", copy:"A razor-edged political satire in which Loki’s transparent dishonesty becomes a strangely persuasive campaign promise.", colors:["#263750","#0a0c0b"] },
  { n:"05", year:"2019", title:"The God Who Fell to Earth", source:"LOKI (2019) #1–5", copy:"Now King of Jotunheim, Loki confronts responsibility, Midgardian life, and the uncomfortable possibility that heroism must be practiced.", colors:["#17484c","#07100c"] },
  { n:"06", year:"2023–", title:"The Teller of Tales", source:"IMMORTAL THOR", copy:"Loki stands beside the fire as narrator, sibling, and keeper of stories—still dangerous, now wielding perspective itself as power.", colors:["#5b274f","#0d080b"] }
];

const timeline = [
  ["965 CE", "Found in Jotunheim", "An abandoned Frost Giant infant is taken by Odin and raised in Asgard as a prince."],
  ["2011", "Thor", "Loki discovers his heritage, seizes the throne, and falls from the broken Bifrost after Thor rejects his plan."],
  ["2012", "The Avengers", "Armed with the Scepter, Loki leads the Chitauri invasion of New York and is defeated by the Avengers."],
  ["2013", "The Dark World", "Imprisoned on Asgard, Loki joins Thor against Malekith, fakes his death, and secretly claims Odin’s throne."],
  ["2017", "Ragnarok", "Exposed and exiled, Loki helps save Asgard’s people and finally fights beside Thor rather than behind him."],
  ["2018", "Infinity War", "Loki confronts Thanos to protect Thor. His last gambit fails, but the choice completes a hard-won act of loyalty."],
  ["2012 → TVA", "The Variant Escapes", "A branched Loki steals the Tesseract, is arrested by the TVA, and learns the scale of the Sacred Timeline."],
  ["Beyond Time", "God of Stories", "Loki masters time-slipping, destroys the Temporal Loom, and sustains the branching multiverse from a throne at its heart."]
];

const relations = [
  ["Thor", "Brother / Rival", "A bond forged through love, envy, conflict, and repeated sacrifice."],
  ["Odin", "Adoptive Father", "Source of belonging and the wound of concealed identity."],
  ["Frigga", "Mother / Mentor", "The parent who teaches Loki magic and sees possibility beneath performance."],
  ["Sylvie", "Variant / Mirror", "A fellow fugitive whose fierce autonomy forces Loki beyond self-obsession."],
  ["Mobius", "Friend / Witness", "The analyst who studies Loki’s past and becomes proof that trust can be chosen."],
  ["Sigyn", "Wife (Comics)", "A complex mythic bond defined by loyalty, tragedy, and Asgardian history."]
];

const enemies = ["Thor (formerly)","The Avengers","Kang’s Variants","Mephisto","Surtur","Hela","Dormammu","Nightmare"];

function SectionTitle({ index, kicker, title, copy }) {
  return html`<${motion.div} ...${fade} className="grid lg:grid-cols-[110px_1fr_1fr] gap-5 lg:gap-10 items-end mb-14">
    <div className="display text-6xl text-[#d9b85b]/25">${index}</div>
    <div><div className="eyebrow mb-3">${kicker}</div><h2 className="display text-5xl md:text-7xl leading-[.9]">${title}</h2></div>
    ${copy && html`<p className="text-[#aebbb2] leading-relaxed max-w-xl lg:justify-self-end">${copy}</p>`}
  </${motion.div}>`;
}

function HornMark({ size=90, color="#d9b85b" }) {
  return html`<svg className="helmet-sigil" width=${size} height=${size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M31 62C16 48 15 24 26 7c-2 19 7 30 22 39" stroke=${color} strokeWidth="3" strokeLinecap="round"/>
    <path d="M69 62C84 48 85 24 74 7c2 19-7 30-22 39" stroke=${color} strokeWidth="3" strokeLinecap="round"/>
    <path d="M31 63c10-7 28-7 38 0l-4 25H35l-4-25Z" stroke=${color} strokeWidth="3"/>
    <path d="M39 61v18m22-18v18" stroke=${color} strokeWidth="2" opacity=".55"/>
  </svg>`;
}

function WorldTree() {
  const mount = useRef(null);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020604, .052);
    const camera = new THREE.PerspectiveCamera(44, el.clientWidth/el.clientHeight, .1, 100);
    camera.position.set(0, .4, 13.5);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:"high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    const bark = new THREE.MeshStandardMaterial({ color:0x112c1b, emissive:0x126b35, emissiveIntensity:1.25, roughness:.62, metalness:.2 });
    const energy = new THREE.MeshBasicMaterial({ color:0x73ff9c, transparent:true, opacity:.78 });
    const makeBranch = (pts, radius, mat=bark) => {
      const curve = new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)));
      const geo = new THREE.TubeGeometry(curve, 34, radius, 7, false);
      const mesh = new THREE.Mesh(geo, mat); group.add(mesh); return curve;
    };
    makeBranch([[0,-7,0],[-.5,-4.5,.2],[.35,-2.1,0],[0,1,0]], .68);
    const branches = [
      [[0,-5,0],[-2.2,-6,.2],[-4.8,-5.5,.8]],[[0,-5.2,0],[2.2,-6,-.3],[5,-5.4,.3]],
      [[0,-1,0],[-1.1,.5,.2],[-3.4,1.9,.2],[-5.8,2.6,.5]],[[0,-.7,0],[1.4,.9,0],[3.8,1.8,-.3],[6,2.1,.2]],
      [[-.2,.4,0],[-1.8,2.5,.2],[-2.5,4.8,0],[-4.3,6,.2]],[[.2,.5,0],[1.8,2.7,-.2],[2.6,5,.1],[4.4,6.2,-.3]],
      [[-.5,1.2,0],[-.2,3.6,.2],[-.8,6.7,0]],[[.6,1.3,0],[.4,4.1,-.2],[1.2,7,.2]],
      [[-2.7,2.1,0],[-3.7,4.2,.4],[-6.2,4.8,.1]],[[2.8,1.8,0],[4.2,3.8,-.4],[6.5,4.4,.2]]
    ];
    branches.forEach((b,i)=>{ const c=makeBranch(b,.34-i*.015); if(i%2===0) makeBranch(b.map((p,j)=>[p[0]+.05*Math.sin(j),p[1]+.03,p[2]+.38]),.035,energy); });
    const count = innerWidth < 700 ? 450 : 900;
    const pos = new Float32Array(count*3); const colors=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const r=2.2+Math.random()*6.6, a=Math.random()*Math.PI*2;
      pos[i*3]=Math.cos(a)*r; pos[i*3+1]=(Math.random()-.42)*14; pos[i*3+2]=Math.sin(a)*2.4-1;
      const gold=Math.random()>.78; colors[i*3]=gold?.94:.22; colors[i*3+1]=gold?.72:1; colors[i*3+2]=gold?.25:.45;
    }
    const pg=new THREE.BufferGeometry(); pg.setAttribute("position",new THREE.BufferAttribute(pos,3)); pg.setAttribute("color",new THREE.BufferAttribute(colors,3));
    const pm=new THREE.PointsMaterial({ size:.055, vertexColors:true, transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false });
    const particles=new THREE.Points(pg,pm); group.add(particles);
    const light=new THREE.PointLight(0x60ff99,40,20); light.position.set(0,1,4); scene.add(light);
    scene.add(new THREE.AmbientLight(0x335d42,1.6));
    let mx=0,my=0,frame;
    const pointer=e=>{ mx=(e.clientX/innerWidth-.5); my=(e.clientY/innerHeight-.5); };
    addEventListener("pointermove",pointer,{passive:true});
    const clock=new THREE.Clock();
    const loop=()=>{ const t=clock.getElapsedTime(); group.rotation.y += (mx*.18-group.rotation.y)*.018; group.rotation.x += (-my*.07-group.rotation.x)*.018; particles.rotation.y=t*.012; pm.opacity=.58+Math.sin(t*1.3)*.12; renderer.render(scene,camera); frame=requestAnimationFrame(loop); }; loop();
    const resize=()=>{ camera.aspect=el.clientWidth/el.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(el.clientWidth,el.clientHeight); };
    addEventListener("resize",resize);
    return()=>{ cancelAnimationFrame(frame); removeEventListener("resize",resize); removeEventListener("pointermove",pointer); renderer.dispose(); el.removeChild(renderer.domElement); };
  },[]);
  return html`<div id="world-tree" ref=${mount} aria-hidden="true"></div>`;
}

function Loader() {
  const [done,setDone]=useState(false);
  useEffect(()=>{ const id=setTimeout(()=>setDone(true),1200); return()=>clearTimeout(id); },[]);
  return html`<div className=${`loading-gate fixed inset-0 z-[100] grid place-items-center ${done?"done":""}`}>
    <div className="text-center"><${HornMark} size=${70}/><div className="eyebrow mt-5 pulse">The timeline is branching</div></div>
  </div>`;
}

function Nav() {
  const [open,setOpen]=useState(false);
  const links=[["Story","#origin"],["Powers","#powers"],["Variants","#variants"],["Comics","#comics"],["Timeline","#timeline"]];
  return html`<header className="fixed inset-x-0 top-0 z-50 nav-blur">
    <nav className="section-wrap h-20 flex items-center justify-between">
      <a href="#top" className="flex items-center gap-4" aria-label="Loki, back to top"><span className="loki-mark"><span>L</span></span><span className="display text-xl tracking-[.18em]">LOKI</span></a>
      <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[.18em]">${links.map(l=>html`<a className="nav-link" href=${l[1]}>${l[0]}</a>`)}</div>
      <button className="md:hidden display text-xl tracking-widest" onClick=${()=>setOpen(!open)} aria-label="Toggle navigation">${open?"CLOSE":"MENU"}</button>
    </nav>
    <${AnimatePresence}>${open&&html`<${motion.div} initial=${{height:0}} animate=${{height:"auto"}} exit=${{height:0}} className="md:hidden overflow-hidden bg-[#030806]/95"><div className="section-wrap py-7 flex flex-col gap-6">${links.map(l=>html`<a onClick=${()=>setOpen(false)} className="display text-4xl" href=${l[1]}>${l[0]}</a>`)}</div></${motion.div}>`}</${AnimatePresence}>
  </header>`;
}

function Hero() {
  const { scrollYProgress }=useScroll();
  const y=useTransform(scrollYProgress,[0,.25],[0,160]);
  const opacity=useTransform(scrollYProgress,[0,.17],[1,0]);
  return html`<section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#030806]">
    <${WorldTree}/><div className="absolute inset-0 hero-grid"></div><div className="absolute inset-0 vignette"></div>
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050907] to-transparent"></div>
    <${motion.div} style=${{y,opacity}} className="section-wrap relative z-10 pt-24 text-center">
      <${motion.div} initial=${{opacity:0,y:15}} animate=${{opacity:1,y:0}} transition=${{delay:.65,duration:.8}} className="eyebrow mb-4">Marvel’s master of mischief</${motion.div}>
      <h1 className="hero-title display text-[clamp(7rem,19vw,18rem)] leading-[.72] tracking-[-.015em] glow green-text">LOKI</h1>
      <div className="serif italic text-2xl md:text-4xl text-[#ebe5d6] mt-4">God of lies. Breaker of stories.</div>
      <p className="mt-5 mx-auto max-w-lg text-sm md:text-base text-[#9eaba2] leading-relaxed">From a stolen Asgardian childhood to the throne beyond time—explore the lives, legends, and glorious contradictions of Loki Laufeyson.</p>
      <a href="#origin" className="mt-9 inline-flex items-center gap-4 rounded-full border border-[#d9b85b]/40 px-7 py-3 text-[11px] font-semibold uppercase tracking-[.2em] hover:bg-[#d9b85b] hover:text-black transition-colors">Enter the chronicle <span>↓</span></a>
    </${motion.div}>
    <div className="absolute left-5 md:left-10 bottom-10 scroll-mark text-[9px] uppercase text-white/35">Scroll to unravel</div>
    <div className="absolute right-5 md:right-10 bottom-9 text-right mobile-hide"><div className="eyebrow">Earth-616</div><div className="text-[10px] text-white/35 mt-2">LOKI LAUFEYSON · ASGARD</div></div>
  </section>`;
}

function Origin() {
  return html`<section id="origin" className="relative py-28 md:py-40 comic-lines">
    <div className="section-wrap">
      <${SectionTitle} index="I" kicker="The stolen prince" title="Born of frost. Raised by gods." copy="Loki’s story is not a straight line from villain to hero. It is a spiral—each return revealing another self beneath the mask."/>
      <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6">
        <${motion.article} ...${fade} className="panel cut-corner min-h-[560px] p-7 md:p-12 flex flex-col justify-end border border-[#d9b85b]/25">
          <div className="panel-art" style=${{background:"radial-gradient(circle at 53% 35%,rgba(83,255,145,.32),transparent 12%),linear-gradient(142deg,#102d1a 0%,#07100a 42%,#304524 70%,#070a08 100%)"}}>
            <div className="absolute inset-[12%] border border-[#7af69f]/10 rotate-45"></div><div className="absolute left-1/2 top-[16%] -translate-x-1/2 opacity-80"><${HornMark} size=${230} color="#80f5a5"/></div>
          </div>
          <div className="eyebrow mb-3">Origin file // 001</div><h3 className="display text-5xl md:text-7xl">The Prince<br/>No One Knew</h3>
          <p className="mt-5 max-w-2xl text-[#b9c4bc] leading-relaxed">Born small for a Frost Giant, Loki was abandoned by Laufey after Asgard’s war with Jotunheim. Odin found the infant, transformed his appearance, and raised him beside Thor. Gifted, sensitive, and painfully aware that Asgard prized his brother’s strength, Loki learned to survive through intellect, magic, and performance. The revelation of his hidden heritage turned an old insecurity into a cosmic wound—but never the whole explanation for who he became.</p>
        </${motion.article}>
        <div className="grid gap-6">
          <${motion.div} ...${fade} className="glass gold-border rounded-sm p-7 md:p-9">
            <div className="eyebrow mb-6">Asgardian dossier</div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 text-sm">
              ${[["True name","Loki Laufeyson"],["First appearance","Venus #6 (1949)*"],["Modern debut","Journey into Mystery #85"],["Creators","Lee · Lieber · Kirby"],["Home realms","Asgard / Jotunheim"],["Known titles","God of Mischief · Stories"]].map(x=>html`<div><dt className="text-white/40 text-[10px] uppercase tracking-widest mb-2">${x[0]}</dt><dd className="text-[#eae5d8]">${x[1]}</dd></div>`)}
            </dl><p className="text-[10px] text-white/30 mt-7">*An earlier Marvel/Atlas-era Loki predates the modern Silver Age incarnation.</p>
          </${motion.div}>
          <${motion.div} ...${fade} className="border border-[#64ef94]/20 p-7 md:p-9 bg-[#07130d]">
            <div className="serif text-3xl md:text-4xl italic leading-tight">“The first and most important lie is the story we tell about ourselves.”</div>
            <div className="eyebrow mt-6">A god rewritten</div>
          </${motion.div}>
        </div>
      </div>
    </div>
  </section>`;
}

function Powers() {
  const [active,setActive]=useState(0);
  return html`<section id="powers" className="py-28 md:py-40 bg-[radial-gradient(circle_at_80%_30%,#123b23_0%,#050907_42%)]">
    <div className="section-wrap"><${SectionTitle} index="II" kicker="Arcane index" title="Power is a matter of perspective." copy="Loki rarely wins by being the strongest person in the room. He wins by changing what the room believes strength means."/>
      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-6 items-stretch">
        <${motion.div} ...${fade} className="relative min-h-[500px] glass p-8 overflow-hidden flex items-center justify-center">
          <div className="portal relative w-[310px] h-[310px] rounded-full"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"><div className="text-7xl green-text">${powers[active][3]}</div><div className="display text-4xl mt-4">${powers[active][0]}</div><p className="text-sm text-[#aab7ae] mt-3 max-w-xs">${powers[active][1]}</p></div>
          <div className="absolute top-5 left-5 eyebrow">Selected ability 0${active+1}</div>
        </${motion.div}>
        <div className="grid sm:grid-cols-2 gap-3">${powers.map((p,i)=>html`<${motion.button} ...${fade} onClick=${()=>setActive(i)} className=${`text-left p-6 border transition-colors ${active===i?"border-[#64f397]/70 bg-[#10291a]":"border-white/10 bg-white/[.02] hover:border-[#d9b85b]/40"}`}>
          <div className="flex justify-between items-start"><span className="display text-2xl">${p[0]}</span><span className="text-[#d9b85b]">${p[3]}</span></div>
          <div className="stat-line mt-6"><span className="text-[9px] uppercase tracking-widest text-white/35">Mastery</span><div className="stat-track"><${motion.div} initial=${{width:0}} whileInView=${{width:`${p[2]}%`}} viewport=${{once:true}} transition=${{duration:1,delay:i*.08}} className="stat-fill"></${motion.div}></div><span className="text-[10px] text-white/50">${p[2]}</span></div>
        </${motion.button}>`)}</div>
      </div>
    </div>
  </section>`;
}

function Costumes() {
  return html`<section className="py-28 md:py-40 overflow-hidden bg-[#070b08]">
    <div className="section-wrap"><${SectionTitle} index="III" kicker="The wardrobe of a god" title="Every silhouette tells a lie." copy="Loki’s costumes track his transformations—from Kirby grandeur to a self-authored, gender-fluid icon of modern Marvel."/>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">${costumes.map((c,i)=>html`<${motion.article} ...${fade} className="costume-card min-h-[430px] border border-white/10 bg-gradient-to-b from-[#142219] to-[#050806] p-5 flex flex-col">
        <div className="flex justify-between"><span className="eyebrow">${c.era}</span><span className="rune text-xl">ᛚᛟᚲᛁ</span></div>
        <div className="flex-1 grid place-items-center"><${HornMark} size=${130+i*4} color=${c.color}/></div>
        <div className="text-[9px] tracking-widest text-white/35">${c.sub}</div><h3 className="display text-3xl mt-2">${c.title}</h3><p className="text-xs leading-relaxed text-white/50 mt-3">${c.desc}</p>
      </${motion.article}>`)}</div>
    </div>
  </section>`;
}

function Variants() {
  const [active,setActive]=useState(0);
  const v=variants[active];
  return html`<section id="variants" className="py-28 md:py-40 relative bg-[linear-gradient(120deg,#050907,#0b1a11_48%,#050907)] overflow-hidden">
    <div className="absolute inset-0 opacity-20 rune text-[15vw] whitespace-nowrap rotate-[-8deg] translate-y-32">ᛚᛟᚲᛁ ᛚᛟᚲᛁ ᛚᛟᚲᛁ</div>
    <div className="section-wrap relative"><${SectionTitle} index="IV" kicker="Across the multiverse" title="One name. Infinite selves." copy="Variant is simply another word for possibility. Each Loki asks the same question: are we the role, the reputation, or the choice?"/>
      <div className="grid lg:grid-cols-[1.1fr_.9fr] border border-[#d9b85b]/25 min-h-[520px]">
        <div className="relative p-8 md:p-12 flex flex-col justify-end overflow-hidden">
          <${AnimatePresence} mode="wait"><${motion.div} key=${active} initial=${{opacity:0,scale:.94,rotate:-2}} animate=${{opacity:1,scale:1,rotate:0}} exit=${{opacity:0,scale:1.03}} transition=${{duration:.55,ease}} className="absolute inset-0">
            <div className="absolute inset-0" style=${{background:`radial-gradient(circle at 55% 43%,${v.tone}44,transparent 22%),linear-gradient(145deg,#0b2517,#040705 68%)`}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]"><${HornMark} size=${300} color=${v.tone}/></div>
            <div className="absolute inset-0 vignette"></div>
          </${motion.div}></${AnimatePresence}>
          <div className="relative"><div className="eyebrow">${v.tag}</div><${motion.h3} key=${v.name} initial=${{opacity:0,x:-24}} animate=${{opacity:1,x:0}} className="display text-7xl md:text-9xl mt-2">${v.name}</${motion.h3}><div className="text-xs text-white/45 tracking-widest">${v.issue}</div></div>
        </div>
        <div className="bg-[#050806]/90 p-7 md:p-10 flex flex-col justify-between">
          <${AnimatePresence} mode="wait"><${motion.p} key=${active} initial=${{opacity:0,y:12}} animate=${{opacity:1,y:0}} exit=${{opacity:0,y:-12}} className="serif text-2xl md:text-3xl leading-relaxed text-[#d9e4db]">${v.copy}</${motion.p}></${AnimatePresence}>
          <div className="mt-10 space-y-1">${variants.map((x,i)=>html`<button onClick=${()=>setActive(i)} className=${`w-full flex items-center gap-4 py-3 border-b text-left transition-colors ${i===active?"border-[#64f397] text-white":"border-white/10 text-white/35 hover:text-white"}`}><span className="display text-lg">0${i+1}</span><span className="text-xs uppercase tracking-[.16em]">${x.name}</span><span className="ml-auto">${i===active?"◆":"◇"}</span></button>`)}</div>
        </div>
      </div>
    </div>
  </section>`;
}

function Comics() {
  const [open,setOpen]=useState(null);
  return html`<section id="comics" className="py-28 md:py-40 comic-lines">
    <div className="section-wrap"><${SectionTitle} index="V" kicker="Essential reading" title="The panels that rewrote a god." copy="Six landmark chapters in Loki’s evolution—from operatic antagonist to the character who refuses the ending."/>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${stories.map((s,i)=>html`<${motion.button} ...${fade} onClick=${()=>setOpen(i)} className="panel min-h-[420px] border border-white/10 text-left p-7 flex flex-col justify-end group">
        <div className="panel-art" style=${{background:`radial-gradient(circle at ${25+i*11}% ${25+i*5}%,${s.colors[0]},transparent 29%),linear-gradient(135deg,${s.colors[0]},${s.colors[1]})`}}><div className="absolute inset-0 comic-lines"></div><div className="absolute top-12 right-8 display text-[10rem] text-white/[.035]">${s.n}</div><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"><${HornMark} size=${190} color="#b8ffc9"/></div></div>
        <div className="eyebrow">${s.year}</div><h3 className="display text-4xl mt-2">${s.title}</h3><div className="text-[10px] text-white/40 tracking-widest mt-3">${s.source}</div><div className="mt-5 text-xs uppercase tracking-widest text-[#72f49c] opacity-0 group-hover:opacity-100 transition-opacity">Open issue file →</div>
      </${motion.button}>`)}</div>
    </div>
    <${AnimatePresence}>${open!==null&&html`<div className="fixed inset-0 z-[90] flex justify-end"><${motion.button} aria-label="Close story detail" onClick=${()=>setOpen(null)} initial=${{opacity:0}} animate=${{opacity:1}} exit=${{opacity:0}} className="absolute inset-0 bg-black/75 backdrop-blur-sm"></${motion.button}><${motion.aside} initial=${{x:"100%"}} animate=${{x:0}} exit=${{x:"100%"}} transition=${{duration:.55,ease}} className="relative w-full max-w-xl h-full bg-[#07110b] drawer-shadow p-8 md:p-14 flex flex-col justify-between overflow-y-auto">
      <button onClick=${()=>setOpen(null)} className="self-end text-xs uppercase tracking-widest text-white/50">Close ×</button><div><div className="display text-[9rem] leading-none text-[#d9b85b]/15">${stories[open].n}</div><div className="eyebrow">${stories[open].source}</div><h3 className="display text-6xl mt-4">${stories[open].title}</h3><p className="serif text-2xl leading-relaxed text-[#cdd8d0] mt-8">${stories[open].copy}</p></div><div className="hairline"></div>
    </${motion.aside}></div>`}</${AnimatePresence}>
  </section>`;
}

function Timeline() {
  return html`<section id="timeline" className="py-28 md:py-40 bg-[radial-gradient(circle_at_50%_30%,#123721_0%,#050907_52%)]">
    <div className="section-wrap"><${SectionTitle} index="VI" kicker="Sacred timeline" title="The MCU, unbound." copy="A path from jealous prince to the living heart of the multiverse—told across films and two seasons of Loki."/>
      <div className="relative max-w-5xl mx-auto py-10"><div className="timeline-line absolute left-5 md:left-1/2 top-0 bottom-0 w-px"></div>
        ${timeline.map((t,i)=>html`<${motion.div} ...${fade} className=${`relative grid md:grid-cols-2 gap-8 md:gap-16 mb-16 ${i%2?"":""}`}>
          <div className=${`${i%2?"md:col-start-2":"md:text-right"} pl-16 md:pl-0`}><div className="eyebrow">${t[0]}</div><h3 className="display text-3xl md:text-4xl mt-2">${t[1]}</h3><p className="text-sm text-white/50 leading-relaxed mt-3 ${i%2?"":"md:ml-auto"} max-w-md">${t[2]}</p></div>
          <div className=${`timeline-node absolute left-[17px] md:left-1/2 top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-[#7dffa5]`}></div>
        </${motion.div}>`)}
      </div>
    </div>
  </section>`;
}

function Relationships() {
  const [active,setActive]=useState(0);
  return html`<section className="py-28 md:py-40 overflow-hidden">
    <div className="section-wrap"><${SectionTitle} index="VII" kicker="Constellations" title="Love, rivalry, and the mirrors between." copy="No Loki exists alone. Family, friends, and enemies repeatedly expose the person beneath the role."/>
      <div className="grid lg:grid-cols-[1fr_.8fr] gap-8 items-center">
        <div className="relative h-[600px] grid place-items-center">
          <div className="orbit absolute w-[540px] h-[540px]"></div><div className="orbit absolute w-[360px] h-[360px]"></div><div className="relative z-10 w-36 h-36 rounded-full bg-[#10291a] border border-[#76f69f]/50 grid place-items-center"><${HornMark} size=${90}/></div>
          ${relations.map((r,i)=>{const a=(i/relations.length)*Math.PI*2-Math.PI/2;const rad=innerWidth<768?185:270;return html`<button onClick=${()=>setActive(i)} className=${`relation-chip absolute z-20 w-24 h-24 rounded-full border text-center transition-all ${active===i?"bg-[#d9b85b] text-black border-[#f9e7a7] scale-110":"bg-[#0a1710] text-white border-white/15 hover:border-[#69f497]"}`} style=${{transform:`translate(${Math.cos(a)*rad}px,${Math.sin(a)*rad}px)`}}><span className="display text-lg">${r[0]}</span></button>`;})}
        </div>
        <${AnimatePresence} mode="wait"><${motion.div} key=${active} initial=${{opacity:0,y:20}} animate=${{opacity:1,y:0}} exit=${{opacity:0,y:-20}} className="glass p-8 md:p-11"><div className="eyebrow">${relations[active][1]}</div><h3 className="display text-6xl mt-3">${relations[active][0]}</h3><p className="serif text-2xl mt-5 text-white/65 leading-relaxed">${relations[active][2]}</p><div className="hairline my-8"></div><div className="eyebrow mb-4">Recurring adversaries</div><div className="flex flex-wrap gap-2">${enemies.map(e=>html`<span className="border border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-white/50">${e}</span>`)}</div></${motion.div}></${AnimatePresence}>
      </div>
    </div>
  </section>`;
}

function Evolution() {
  return html`<section className="py-32 md:py-48 relative overflow-hidden bg-[#07100b]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(81,241,137,.17),transparent_46%)]"></div>
    <div className="section-wrap relative text-center"><${motion.div} ...${fade}><div className="eyebrow">Character evolution</div><h2 className="display text-[clamp(4.5rem,13vw,11rem)] leading-[.8] mt-8">VILLAIN.<br/><span className="gold-text">VARIANT.</span><br/>VISIONARY.</h2><p className="serif text-2xl md:text-4xl italic max-w-3xl mx-auto mt-10 text-white/65">Loki’s greatest transformation is not from evil to good. It is from a character trapped by repetition into an author willing to choose what comes next.</p></${motion.div}>
      <div className="grid md:grid-cols-3 gap-4 mt-16 text-left">${[["01","The Lie","Identity is imposed: Frost Giant, usurper, villain."],["02","The Choice","Identity is performed, tested, and chosen again."],["03","The Story","Identity becomes a gift: room for every branch to live."]].map(x=>html`<${motion.div} ...${fade} className="border-t border-[#d9b85b]/35 pt-5"><div className="eyebrow">${x[0]}</div><div className="display text-3xl mt-4">${x[1]}</div><p className="text-sm text-white/45 mt-2">${x[2]}</p></${motion.div}>`)}</div>
    </div>
  </section>`;
}

function Footer() {
  return html`<footer className="relative py-20 overflow-hidden bg-[#020504] border-t border-white/5"><div className="section-wrap relative flex flex-col md:flex-row justify-between gap-10 items-end"><div><${HornMark} size=${54}/><div className="display text-4xl mt-5">LOKI</div><p className="text-xs text-white/35 mt-3 max-w-md leading-relaxed">An unofficial fan-made interactive tribute. Marvel, Loki, and associated characters are trademarks of Marvel Entertainment. Comic facts reflect the primary Earth-616 continuity unless noted.</p></div><div className="text-right"><a href="#top" className="eyebrow hover:text-[#72f49c]">Return to the roots ↑</a><div className="text-[10px] text-white/25 mt-5">A CHRONICLE FOR THOSE BURDENED WITH GLORIOUS PURPOSE</div></div></div></footer>`;
}

function App(){
  const {scrollYProgress}=useScroll(); const scaleX=useSpring(scrollYProgress,{stiffness:120,damping:28,restDelta:.001});
  return html`<main className="grain"><${Loader}/><${motion.div} className="progress fixed top-0 left-0 right-0 h-[2px] z-[70]" style=${{scaleX}}></${motion.div}><${Nav}/><${Hero}/><${Origin}/><${Powers}/><${Costumes}/><${Variants}/><${Comics}/><${Timeline}/><${Relationships}/><${Evolution}/><${Footer}/></main>`;
}

createRoot(document.getElementById("root")).render(html`<${App}/>`);
