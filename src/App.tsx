import React, { useEffect, useMemo, useState } from "react";

type CmdItem = {
  label: string;
  href: string;
  hint?: string;
};

// -------------------------------- Inline Icons (no network deps)
function IconMonogram({ label, title }: { label: string; title: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" role="img" aria-label={title}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.14" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" fill="currentColor">{label}</text>
    </svg>
  );
}
const IconMail = () => <IconMonogram label="M" title="Email" />;
const IconLinkedIn = () => <IconMonogram label="in" title="LinkedIn" />;
const IconGitHub = () => <IconMonogram label="GH" title="GitHub" />;
const IconDiscord = () => <IconMonogram label="D" title="Discord" />;

// -------------------------------- Data (same as canvas)
const PROJECTS = [
  {
    slug: "medical-chatbot-llama2",
    title: "Medical Chatbot with Llama 2",
    oneLiner: "RAG-based triage assistant with safety guardrails.",
    timeframe: "2024",
    role: "ML Engineer",
    impact: [
      "Reduced triage response time by ~60%",
      "Improved factual grounding by +18%",
    ],
    problem: "Faster first-line guidance with minimized hallucinations.",
    approach: "RAG over curated corpus, answer attribution, evaluator harness & guardrails.",
    tech: ["Python","PyTorch","Llama 2","LangChain","Pinecone","FastAPI","Docker"],
    tags: ["ML","RAG","Healthcare"],
    repoUrl: "https://github.com/shindejayesh987",
    cover: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    metrics: [ { label: "Latency", value: "~850ms", hint: "median" }, { label: "Grounding", value: "+18%", hint: "vs baseline" } ],
  },
  {
    slug: "simple-microservice-example",
    title: "Simple Microservices Example",
    oneLiner: "API Gateway + React FE + QuoteService + MongoDB + NGINX (Dockerized)",
    timeframe: "2024",
    role: "Backend Engineer",
    impact: ["Deployed with Docker Compose and K8s-ready manifests","Improved cold-start by 30% via image slimming"],
    problem: "Educative microservice system with clear boundaries.",
    approach: "Contracts, health checks, structured logs, gateway routing.",
    tech: ["Java","Spring Boot","React","MongoDB","Docker","NGINX"],
    tags: ["Backend","DevOps"],
    repoUrl: "https://github.com/shindejayesh987/simple-microservice-example",
    cover: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "poetry-emotion-classifier",
    title: "Poetry Emotion Classifier (C-BiLSTM + Attention)",
    oneLiner: "0.88 F1 emotion classifier for English poetry.",
    timeframe: "2023",
    role: "ML Researcher",
    impact: ["Outperformed baseline by 25% accuracy","Cut training time by 30% via optimized pipeline"],
    problem: "Map poetic text to emotions reliably.",
    approach: "C-BiLSTM + attention, curated dataset, robust eval.",
    tech: ["Python","Keras","NLTK","NumPy","Pandas"],
    tags: ["NLP","DL"],
    repoUrl: "https://github.com/",
    cover: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "gemini-sql-retrieval",
    title: "Gemini SQL Query Retrieval App",
    oneLiner: "Natural language → SQL over SQLite with guardrails.",
    timeframe: "2024",
    role: "Full-Stack Engineer",
    impact: ["Reduced analyst query time by 70% in demo","Added safe-ops patterns and schema-aware prompts"],
    problem: "Speed up data retrieval for non-SQL users.",
    approach: "Prompt templates, schema introspection, few-shot, result viewers.",
    tech: ["TypeScript","Next.js","SQLite","Vercel"],
    tags: ["LLM","Tooling"],
    repoUrl: "https://github.com/",
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "banking-system-java",
    title: "Banking System (Java)",
    oneLiner: "Accounts, transfers, ranking, scheduled jobs, and merge histories.",
    timeframe: "2024",
    role: "Backend Engineer",
    impact: ["Modeled eventual consistency for scheduled transfers","Comprehensive tests for ledger + histories"],
    problem: "Robust core banking primitives for a demo app.",
    approach: "Domain modeling, queues, idempotency, transaction logs.",
    tech: ["Java","JUnit","Kafka (concept)","PostgreSQL"],
    tags: ["Backend","Distributed"],
    repoUrl: "https://github.com/",
    cover: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "cnn-image-accuracy",
    title: "CNN Image Classifier – Accuracy Boost",
    oneLiner: "Improved top-1 by tuning augments + loss schedule.",
    timeframe: "2024",
    role: "ML Engineer",
    impact: ["+4.2% top-1 vs baseline","30% faster training with mixed precision"],
    problem: "Squeeze more accuracy from mid-size CNN.",
    approach: "RandAugment, label smoothing, cosine decay, EMA.",
    tech: ["PyTorch","WandB","CUDA"],
    tags: ["CV","DL"],
    repoUrl: "https://github.com/",
    cover: "https://images.unsplash.com/photo-1542144612-1b54c6f7f2c8?q=80&w=1200&auto=format&fit=crop",
  },
];
const FEATURED = ["medical-chatbot-llama2","simple-microservice-example","gemini-sql-retrieval"];

const SKILL_GROUPS = [
  { title: "Languages", skills: ["TypeScript","JavaScript","Python","Java"] as const },
  { title: "Frontend", skills: ["React","Next.js","Vite"] as const },
  { title: "Backend", skills: ["Node.js","Express","Spring Boot","FastAPI"] as const },
  { title: "ML / AI", skills: ["PyTorch","TensorFlow","LangChain","scikit-learn","Llama 2"] as const },
  { title: "Databases", skills: ["PostgreSQL","MongoDB","SQLite"] as const },
  { title: "Cloud & DevOps", skills: ["AWS","GCP","Vercel","Docker","Kubernetes"] as const },
] as const;

type SkillGroup = (typeof SKILL_GROUPS)[number];
type SkillName = SkillGroup["skills"][number];

const SKILL_LOGO_FILES: Record<SkillName, string> = {
  "TypeScript": "typescript",
  "JavaScript": "javascript",
  "Python": "python",
  "Java": "java",
  "React": "react",
  "Next.js": "nextjs",
  "Vite": "vite",
  "Node.js": "nodejs",
  "Express": "express",
  "Spring Boot": "spring-boot",
  "FastAPI": "fastapi",
  "PyTorch": "pytorch",
  "TensorFlow": "tensorflow",
  "LangChain": "langchain",
  "scikit-learn": "scikit-learn",
  "Llama 2": "llama-2",
  "PostgreSQL": "postgresql",
  "MongoDB": "mongodb",
  "SQLite": "sqlite",
  "AWS": "aws",
  "GCP": "gcp",
  "Vercel": "vercel",
  "Docker": "docker",
  "Kubernetes": "kubernetes",
};

type ContactBrand = "gmail" | "linkedin" | "github" | "discord";

const CONTACT_LOGO_FILES: Record<ContactBrand, string> = {
  gmail: "gmail",
  linkedin: "linkedin",
  github: "github",
  discord: "discord",
};

const ORG_LOGO_FILES = {
  "csu-chico": "csu-chico",
  "infosys": "infosys",
  "pune-university": "pune-university",
} as const;

type OrgKey = keyof typeof ORG_LOGO_FILES;

const EXPERIENCE = [
  {
    range: "2024—2025",
    title: "Graduate Teaching Assistant",
    org: "CSU Chico",
    orgKey: "csu-chico" as const,
    summary: "Helped students with systems & ML topics; created lab material.",
  },
  {
    range: "2021—2023",
    title: "Software Engineer",
    org: "Infosys (Pune)",
    orgKey: "infosys" as const,
    summary: "Java/Spring services; CI/CD; collaborated across teams.",
  },
] as const;

const EDUCATION = [
  {
    degree: "M.S. Computer Science",
    school: "CSU Chico",
    orgKey: "csu-chico" as const,
    summary: "Graduate coursework in ML, distributed systems, and advanced software engineering.",
  },
  {
    degree: "B.E. Information Technology",
    school: "Savitribai Phule Pune University",
    orgKey: "pune-university" as const,
    summary: "Focused on data structures, networks, and full-stack project work.",
  },
] as const;

// Helpers
function filterByTag(projects: { tags: string[] }[], tag: string) {
  if (tag === "All") return projects;
  return projects.filter((p) => p.tags.includes(tag));
}

function ThemeToggle(
  { value, onChange }: { value: "light" | "dark" | "noir"; onChange: (t: "light" | "dark" | "noir") => void }
) {
  const next: "light" | "dark" | "noir" = value === "light" ? "dark" : value === "dark" ? "noir" : "light";
  return (
    <button className="btn" onClick={() => onChange(next)} title={`Theme: ${value}`}>Theme: {value}</button>
  );
}

function Section({ id, title, subtitle, children }: any) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="section-head">
          <h2>{title}</h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="btn-outline" title={text} onClick={async () => { try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200);} catch {} }}>
      {ok ? "Copied!" : label}
    </button>
  );
}

function ContactLogo({ brand, label }: { brand: ContactBrand; label: string }) {
  const file = CONTACT_LOGO_FILES[brand];
  if (!file) return <IconMonogram label={label.slice(0,2)} title={label} />;
  return <img className="contact-logo" src={`/contact/${file}.svg`} alt={`${label} logo`} />;
}

function OrgLogo({ org, label }: { org: OrgKey; label: string }) {
  const file = ORG_LOGO_FILES[org];
  if (!file) return <IconMonogram label={label.slice(0,2)} title={label} />;
  return <img className="org-logo" src={`/org/${file}.svg`} alt={`${label} logo`} />;
}

function SkillLogo({ name }: { name: SkillName }) {
  const file = SKILL_LOGO_FILES[name];
  if (file) {
    return <img className="skill-icon-img" src={`/skills/${file}.svg`} alt={`${name} logo`} />;
  }
  const letters = name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
  return (
    <div className="skill-icon-fallback" aria-label={`${name} logo`} role="img">
      <IconMonogram label={letters || "?"} title={name} />
    </div>
  );
}

function ProjectCard({ p }: { p: any }) {
  return (
    <a href={`#${p.slug}`} className="card linkcard">
      {p.cover && <img src={p.cover} alt="cover" className="cover" />}
      <div className="card-body">
        <div className="row-between">
          <h3 className="card-title">{p.title}</h3>
          <div className="muted xs">{p.timeframe}</div>
        </div>
        <p className="muted sm">{p.oneLiner}</p>
        <div className="tags">
          {p.tags.slice(0,4).map((t: string) => <Tag key={t}>{t}</Tag>)}
        </div>
        <div className="row gap">
          {p.repoUrl && <a className="link" href={p.repoUrl} target="_blank" rel="noreferrer">Repo</a>}
          {p.liveUrl && <a className="link" href={p.liveUrl} target="_blank" rel="noreferrer">Live</a>}
          {p.repoUrl && <CopyButton text={p.repoUrl} label="Copy repo" />}
        </div>
      </div>
    </a>
  );
}

function ProjectExplainer({ p }: { p: any }) {
  const [aud, setAud] = useState<"Recruiter" | "PM" | "Engineer" | "Student">("Recruiter");
  const text = React.useMemo(() => {
    const base = `Project: ${p.title}. Problem: ${p.problem}. Approach: ${p.approach}. Outcomes: ${p.impact.join("; ")}.`;
    if (aud === "PM") return base + ` Framed for PMs: clarified scope, risk-managed with guardrails; success tracked via ${p.metrics?.map((m: any)=>`${m.label}: ${m.value}`).join(", ") ?? "metrics"}.`;
    if (aud === "Engineer") return base + ` Eng view: separation of concerns, reliability, testability. Tech: ${p.tech.join(", ")}.`;
    if (aud === "Student") return base + ` Think: break down, measure, iterate.`;
    return base + ` Quick skim — role: ${p.role}, timeframe: ${p.timeframe ?? "n/a"}.`;
  }, [aud, p]);
  return (
    <div className="card">
      <div className="row-between">
        <div className="card-title sm">Project Explainer</div>
        <select value={aud} onChange={(e) => setAud(e.target.value as any)} className="select sm">
          <option>Recruiter</option>
          <option>PM</option>
          <option>Engineer</option>
          <option>Student</option>
        </select>
      </div>
      <p className="muted sm" style={{marginTop: 8}}>{text}</p>
    </div>
  );
}

function SkillsSection() {
  return (
    <Section id="skills" title="Skills" subtitle="Technologies and tools I use.">
      <div className="skills-panels">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title} className="card skill-group-card">
            <div className="card-title" style={{ marginBottom: 8 }}>{group.title}</div>
            <div className="skills-grid">
              {group.skills.map((skill) => (
                <div className="skill-chip" key={skill}>
                  <SkillLogo name={skill} />
                  <span className="xs muted" style={{ textTransform: "none" }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CommandMenu({ open, onClose, onGo, projects }: { open: boolean; onClose: () => void; onGo: (href: string) => void; projects: any[]; }) {
  const [q, setQ] = useState("");
  const filtered: CmdItem[]= useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base: CmdItem[] = [
      { label: "Home", href: "#home" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "About", href: "#about" },
      { label: "Education", href: "#education" },
      { label: "Experience", href: "#experience" },
      { label: "Contact", href: "#contact" },
      ...projects.map((p) => ({ label: `Project: ${p.title}`, href: `#${p.slug}`, hint: p.tags.join(", ") })),
    ];
    if (!needle) return base.slice(0, 10);
    return base.filter(o => o.label.toLowerCase().includes(needle) || o.hint?.toLowerCase().includes(needle)).slice(0, 12);
  }, [q, projects]);
  if (!open) return null;
  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-head">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Type to search… (projects, sections)" />
        </div>
        <ul className="palette-list">
          {filtered.map((o) => (
            <li key={o.href}>
              <button className="palette-item" onClick={()=>{ onGo(o.href); onClose(); }}>
                <span>{o.label}</span>
                {o.hint && <span className="muted xs">{o.hint}</span>}
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="muted sm" style={{padding: 12}}>No results.</li>}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"light"|"dark"|"noir">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const k = e.key.toLowerCase();
      if ((isMac && e.metaKey && k === "k") || (!isMac && e.ctrlKey && k === "k")) {
        e.preventDefault();
        setMenuOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const projectsFiltered = React.useMemo(() => filterByTag(PROJECTS as any, filter), [filter]);

  const themeVars = React.useMemo(() => {
    if (theme === "noir") {
      return {
        "--bg": "#0f0f12",
        "--bg-accent": "radial-gradient(circle at top left, rgba(120,120,255,0.12), transparent 55%), radial-gradient(circle at bottom right, rgba(255,120,200,0.08), transparent 45%)",
        "--fg": "#f2f2f2",
        "--muted": "#a1a1a8",
        "--card": "#15151a",
        "--border": "#2a2a33",
      } as React.CSSProperties;
    }
    if (theme === "dark") {
      return {
        "--bg": "#0b0b0b",
        "--bg-accent": "radial-gradient(circle at top right, rgba(90,140,255,0.18), transparent 50%), radial-gradient(circle at bottom left, rgba(120,255,212,0.12), transparent 45%)",
        "--fg": "#f5f5f5",
        "--muted": "#b0b0b0",
        "--card": "#141414",
        "--border": "#262626",
      } as React.CSSProperties;
    }
    return {
      "--bg": "#fbfbfd",
      "--bg-accent": "radial-gradient(circle at top left, rgba(147,197,253,0.35), transparent 55%), radial-gradient(circle at bottom right, rgba(196,181,253,0.28), transparent 45%)",
      "--fg": "#111111",
      "--muted": "#565b61",
      "--card": "#ffffff",
      "--border": "#e6e6e6",
    } as React.CSSProperties;
  }, [theme]);

  return (
    <div style={themeVars as any} className="root">
      <style>{`
        .root { position:relative; min-height:100vh; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial; }
        .root::before { content:""; position:fixed; inset:0; pointer-events:none; background: var(--bg-accent); opacity:0.9; z-index:-2; }
        .root::after { content:""; position:fixed; inset:0; pointer-events:none; background: linear-gradient(180deg, rgba(255,255,255,0.04), transparent 30%); z-index:-3; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }
        .header { position: sticky; top: 0; backdrop-filter: saturate(150%) blur(6px); background: color-mix(in oklab, var(--bg) 80%, white 20%); border-bottom: 1px solid var(--border); z-index: 20; }
        .head-row { display:flex; align-items:center; justify-content:space-between; padding: 10px 16px; }
        .nav { display:flex; align-items:center; gap:14px; font-size: 14px; }
        .link { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
        .btn { border:1px solid var(--border); padding:8px 12px; border-radius: 12px; background: var(--card); color: inherit; cursor:pointer; }
        .btn-outline { border:1px solid var(--border); padding:6px 10px; border-radius: 10px; background: transparent; color: inherit; cursor:pointer; }
        .section { padding: 48px 0; }
        .section-head h2 { margin:0; font-size: 28px; }
        .muted { color: var(--muted); }
        .sm { font-size: 14px; }
        .xs { font-size: 12px; }
        .row { display:flex; align-items:center; }
        .row-between { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .gap { gap:10px; }
        .grid { display:grid; gap: 14px; }
        @media(min-width: 640px){ .grid-2 { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media(min-width: 960px){ .grid-3 { grid-template-columns: repeat(3, minmax(0,1fr)); } }
        .card { border:1px solid var(--border); border-radius: 16px; background: var(--card); padding: 14px; }
        .linkcard { display:block; padding:0; overflow:hidden; }
        .card-body { padding: 12px 14px 14px; }
        .card-title { font-weight: 600; }
        .cover { width: 100%; height: 160px; object-fit: cover; display:block; }
        .tags { display:flex; flex-wrap: wrap; gap:6px; margin-top:8px; }
        .tag { border:1px solid var(--border); padding: 2px 8px; border-radius: 999px; font-size: 12px; }
        .hero { padding: 52px 0; }
        .hero h1 { font-size: clamp(32px, 6vw, 54px); line-height: 1.05; margin: 0; }
        .hero-cta { display:flex; flex-wrap: wrap; gap:10px; margin-top:16px; }
        .overlay { position: fixed; inset: 0; background: color-mix(in hsl, black 40%, transparent); display:flex; align-items:flex-start; justify-content:center; padding: 20px; }
        .palette { width: min(680px, 100%); background: var(--card); border:1px solid var(--border); border-radius: 14px; overflow:hidden; }
        .palette-head { padding:10px; border-bottom:1px solid var(--border); }
        .palette-head input { width:100%; background: transparent; border:0; outline: none; color: inherit; font-size: 15px; }
        .palette-list { max-height: 60vh; overflow:auto; }
        .palette-item { width:100%; text-align:left; padding:10px 12px; display:flex; align-items:center; justify-content:space-between; border-bottom: 1px dashed var(--border); background: transparent; color: inherit; cursor:pointer; }
        .footer { text-align:center; padding: 28px 0; border-top: 1px solid var(--border); margin-top: 32px; }
        .skills-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap:12px; }
        .skill-chip { display:flex; flex-direction:column; align-items:center; gap:6px; padding:10px; border:1px solid var(--border); border-radius:12px; background: var(--card); transition: transform 0.2s ease; }
        .skill-icon-img { width:56px; height:56px; object-fit:contain; }
        .skill-icon-fallback { width:56px; height:56px; display:flex; align-items:center; justify-content:center; }
        .skill-icon-fallback svg { width:48px; height:48px; }
        .skill-chip:hover { transform: translateY(-1px); }
        .contact-logo { width:24px; height:24px; display:block; }
        .org-logo { width:36px; height:36px; display:block; border-radius:10px; }
        .career-grid { display:grid; gap:24px; }
        @media(min-width: 960px){ .career-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        .career-panel { border:1px solid var(--border); border-radius:16px; background: var(--card); padding:24px; }
        .career-panel .section-head { margin-bottom:16px; }
        .form-card { display:flex; flex-direction:column; gap:12px; }
        .form-field { display:flex; flex-direction:column; gap:6px; }
        .form-field label { font-size:12px; text-transform:uppercase; letter-spacing:0.04em; }
        .form-field input, .form-field textarea { box-sizing: border-box; }
        .contact-links { display:flex; gap:12px; flex-wrap:wrap; }
        .contact-meta { margin-top:16px; display:flex; flex-direction:column; gap:8px; }
        .contact-meta-title { font-weight:600; }
        .contact-tip { margin-top:4px; }
        .skills-panels { display:grid; gap:30px; }
        @media(min-width: 960px){ .skills-panels { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        .skill-group-card { height:100%; display:flex; flex-direction:column; gap:12px; }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="head-row container">
          <a href="#home" className="link" style={{textDecoration:"none"}}><strong>Jayesh Shinde</strong></a>
          <nav className="nav">
            <a className="link" href="#projects">Projects</a>
            <a className="link" href="#skills">Skills</a>
            <a className="link" href="#about">About</a>
            <a className="link" href="#education">Education</a>
            <a className="link" href="#experience">Experience</a>
            <a className="link" href="#contact">Contact</a>
            <button className="btn-outline" onClick={()=>setMenuOpen(true)}>⌘K</button>
            <ThemeToggle value={theme} onChange={setTheme} />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="container">
          <div className="grid grid-2" style={{alignItems: "center"}}>
            <div>
              <h1>Building useful AI & resilient backends.</h1>
              <p className="muted" style={{marginTop: 8, fontSize: 18}}>I turn vague requirements into shipped, well-tested systems.</p>
              <div className="hero-cta">
                <a className="btn" href="#projects">View Projects</a>
                <a className="btn-outline" href="#contact">Contact</a>
                <a className="btn-outline" href="/Jayesh_Shinde_Resume.pdf" download>Download Resume</a>
              </div>
              <div style={{marginTop: 14}} className="tags">
                {["PyTorch","TensorFlow","Java","Spring Boot","Docker","K8s","AWS","GCP","Kafka","Postgres"].map(s=> <Tag key={s}>{s}</Tag>)}
              </div>
            </div>
            <div>
              <div className="card">
                <div className="muted xs">Featured</div>
                <div className="grid grid-2" style={{marginTop:10}}>
                  {PROJECTS.filter(p=>FEATURED.includes(p.slug)).map(p=> <ProjectCard key={p.slug} p={p} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <Section id="projects" title="Projects" subtitle="Filter by tag and explore details below.">
        <div className="row gap" style={{flexWrap:'wrap', marginBottom: 12}}>
          {(["All", ...Array.from(new Set(PROJECTS.flatMap(p=>p.tags)))] as string[]).map(t => (
            <button key={t} className="btn-outline" onClick={()=>setFilter(t)} style={filter===t?{background:'var(--card)', boxShadow:'inset 0 0 0 999px color-mix(in oklab, var(--fg) 6%, transparent)'}:undefined}>{t}</button>
          ))}
        </div>
        <div className="grid grid-2 grid-3">
          {PROJECTS.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      </Section>

      {/* Details */}
      {PROJECTS.map((p)=> {
        const metrics = p.metrics ?? [];
        const hasMetrics = metrics.length > 0;
        return (
        <Section key={p.slug} id={p.slug} title={p.title} subtitle={p.oneLiner}>
          <div className="grid grid-2" style={{alignItems:'start'}}>
            <div>
              <div className="card">
                <h3 className="card-title">Problem</h3>
                <p className="muted sm">{p.problem}</p>
                <h3 className="card-title" style={{marginTop:12}}>Approach</h3>
                <p className="muted sm">{p.approach}</p>
                <h3 className="card-title" style={{marginTop:12}}>Impact</h3>
                <ul className="muted sm" style={{paddingLeft:16}}>
                  {p.impact.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                </ul>
                {hasMetrics && (
                  <div className="grid grid-2" style={{marginTop:12}}>
                    {metrics.map((m: any) => (
                      <div key={m.label} className="card" style={{padding:'10px 12px'}}>
                        <div className="xs muted">{m.label}</div>
                        <div className="card-title" style={{fontSize:22}}>{m.value}</div>
                        {m.hint && <div className="xs muted">{m.hint}</div>}
                      </div>
                    ))}
                  </div>
                )}
                <div className="tags" style={{marginTop:12}}>
                  {p.tech.map((t: string) => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
            </div>
            <aside>
              <div className="card">
                <div className="card-title sm">Quick Actions</div>
                <div className="row gap" style={{marginTop:8, flexWrap:'wrap'}}>
                  {p.repoUrl && <CopyButton text={p.repoUrl} label="Copy repo URL" />}
                  <CopyButton label="Email (Recruiter)" text={`Hi there, I came across your role and thought this project may be relevant: ${p.title}. It ${p.impact[0]}. Happy to share more context or a quick demo. — Jayesh`} />
                  <CopyButton label="Explain for PM" text={`Project: ${p.title}. Problem: ${p.problem}. Approach: ${p.approach}. Outcomes: ${p.impact.join("; ")}. In PM terms: scope clarified, risk-managed, measurable impact.`} />
                </div>
              </div>
              <div style={{marginTop:12}}>
                <ProjectExplainer p={p} />
              </div>
              {p.cover && <div className="card" style={{marginTop:12, padding:0, overflow:'hidden'}}><img src={p.cover} alt="visual" className="cover" /></div>}
            </aside>
          </div>
        </Section>
        );
      })}

      {/* About */}
      <Section id="about" title="About" subtitle="A quick snapshot of who I am and what I value.">
        <div className="grid grid-2" style={{alignItems:'start'}}>
          <div>
            <p className="muted">I'm Jayesh, a product-minded AI/ML and backend engineer. I enjoy turning ambiguous ideas into reliable systems with crisp APIs, robust tests, and thoughtful UX.</p>
            <p className="muted">Background across startups and academia; comfortable in Python/PyTorch for ML, and Java/Spring for backend. Cloud-native with Docker/K8s and CI/CD.</p>
          </div>
          <div className="card">
            <div className="xs muted" style={{marginBottom:6}}>Certifications</div>
            <ul className="sm" style={{margin:0, paddingLeft:16}}>
              <li>AWS Cloud Practitioner</li>
              <li>AWS Developer Associate</li>
              <li>Global Agile Developer</li>
            </ul>
          </div>
        </div>
      </Section>

      <SkillsSection />

      {/* Education + Experience */}
      <section className="section" id="career" style={{paddingTop:0}}>
        <div className="container career-grid">
          <div id="education" className="career-panel">
            <div className="section-head">
              <h2>Education</h2>
              <p className="muted">Academic foundations.</p>
            </div>
            <ol style={{position:'relative', paddingLeft:0, listStyle:'none', margin:0}}>
              {EDUCATION.map((item) => (
                <li key={item.degree} style={{marginBottom:16}}>
                  <div className="row gap" style={{alignItems:'center'}}>
                    <OrgLogo org={item.orgKey} label={item.school} />
                    <div>
                      <div className="card-title">{item.degree} · {item.school}</div>
                      <div className="sm">{item.summary}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div id="experience" className="career-panel">
            <div className="section-head">
              <h2>Experience</h2>
              <p className="muted">A brief career timeline.</p>
            </div>
            <ol style={{position:'relative', paddingLeft:0, listStyle:'none', margin:0}}>
              {EXPERIENCE.map((item) => (
                <li key={item.title} style={{marginBottom:16}}>
                  <div className="row gap" style={{alignItems:'center'}}>
                    <OrgLogo org={item.orgKey} label={item.org} />
                    <div>
                      <div className="xs muted">{item.range}</div>
                      <div className="card-title">{item.title} · {item.org}</div>
                      <div className="sm">{item.summary}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Contact */}
      <Section id="contact" title="Contact" subtitle="Reach out for roles, collabs, or mentorship.">
        <div className="grid">
          <form className="card form-card" onSubmit={(e)=>{ e.preventDefault(); alert('Thanks! In a real deployment, this would hit an API route or EmailJS.'); }}>
            <div className="form-field">
              <label className="xs muted">Your email</label>
              <input style={{width:'100%', padding:'10px 12px', borderRadius:12, border: '1px solid var(--border)', background:'transparent', color:'inherit'}} placeholder="you@example.com" required />
            </div>
            <div className="form-field" style={{marginTop:4}}>
              <label className="xs muted">Message</label>
              <textarea style={{width:'100%', padding:'10px 12px', borderRadius:12, border: '1px solid var(--border)', background:'transparent', color:'inherit', minHeight:120}} placeholder="Let's work together…" required />
            </div>
            <div>
              <button className="btn">Send</button>
              <div className="contact-meta">
                <div className="contact-meta-title sm">Connect with me</div>
                <div className="contact-links">
                  <a href="mailto:jay98shinde@gmail.com" target="_blank" rel="noreferrer" title="Email" aria-label="Email Jayesh" className="row gap"><ContactLogo brand="gmail" label="Gmail" /><span className="sm">Gmail</span></a>
                  <a href="https://www.linkedin.com/in/jayesh-shinde-5a3405175" target="_blank" rel="noreferrer" title="LinkedIn" aria-label="LinkedIn profile" className="row gap"><ContactLogo brand="linkedin" label="LinkedIn" /><span className="sm">LinkedIn</span></a>
                  <a href="https://github.com/shindejayesh987" target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub profile" className="row gap"><ContactLogo brand="github" label="GitHub" /><span className="sm">GitHub</span></a>
                  <a href="https://discord.com/users/your-discord-id" target="_blank" rel="noreferrer" title="Discord" aria-label="Discord profile" className="row gap"><ContactLogo brand="discord" label="Discord" /><span className="sm">Discord</span></a>
                </div>
                <p className="xs muted contact-tip">Tip: Press <kbd style={{border:'1px solid var(--border)', borderRadius:6, padding:'0 4px'}}>⌘</kbd> + <kbd style={{border:'1px solid var(--border)', borderRadius:6, padding:'0 4px'}}>K</kbd> (or Ctrl+K) to navigate quickly.</p>
              </div>
            </div>
          </form>
        </div>
      </Section>

      {/* Footer */}
      <div className="footer">© {new Date().getFullYear()} Jayesh Shinde — Built with clean UX.</div>

      {/* Command Palette */}
      <CommandMenu open={menuOpen} onClose={()=>setMenuOpen(false)} onGo={go} projects={PROJECTS as any} />
    </div>
  );
}

(function test_skillLogoMap() {
  const ok = ["React", "TypeScript", "Git", "Postman", "Vercel"];
  console.assert(ok.every(Boolean), "skills baseline");
})();
