import { useRef } from "react";
import { motion, useInView } from "motion/react";
import "./tech.css";

// SVG Icons for each technology
const ReactIcon = () => (
  <svg viewBox="0 0 115.3 100" className="tech-logo-svg" fill="#61DAFB">
    <ellipse cx="57.6" cy="50" rx="14" ry="14" />
    <path d="M57.6,0C42.8,0,30,19.2,28.8,43.2c-0.1,2.3-0.1,4.6,0,6.8c1.2,24,14,43.2,28.8,43.2s27.6-19.2,28.8-43.2c0.1-2.3,0.1-4.6,0-6.8C85.2,19.2,72.4,0,57.6,0z M57.6,90C45.3,90,34.8,72.8,33.8,50c1-22.8,11.5-40,23.8-40s22.8,17.2,23.8,40C80.4,72.8,69.9,90,57.6,90z" opacity="0.85" />
    <path d="M14.3,25C3.5,31.3-1.6,48.2,2.8,62.8c0.8,2.2,1.8,4.2,3,6.2c12.2,20.8,30.4,24.8,41.2,18.5s15.9-23.2,11.5-37.8c-0.8-2.2-1.8-4.2-3-6.2C43.3,22.7,25.1,18.7,14.3,25z" opacity="0.85" />
    <path d="M101,25C90.2,18.7,72,22.7,59.8,43.5c-1.2,2-2.2,4-3,6.2c-4.4,14.6,0.7,31.5,11.5,37.8c10.8,6.3,29,2.3,41.2-18.5c1.2-2,2.2-4,3-6.2C116.9,48.2,111.8,31.3,101,25z" opacity="0.85" />
  </svg>
);

const TSIcon = () => (
  <svg viewBox="0 0 128 128" className="tech-logo-svg" fill="#3178C6">
    <rect width="128" height="128" rx="16" fill="#3178C6" />
    <path d="M1.5 63.8C1.5 98.2 29.5 126.2 63.9 126.2C98.3 126.2 126.3 98.2 126.3 63.8C126.3 29.4 98.3 1.4 63.9 1.4C29.5 1.4 1.5 29.4 1.5 63.8Z" fill="#3178C6" />
    <path d="M68.5 73.5C68.5 82.2 73.2 86.8 82.7 86.8C88.6 86.8 93.3 84.8 96.5 82.6L100.8 92.4C96.2 95.8 89.2 98.2 80.3 98.2C64.9 98.2 55.4 89.1 55.4 74.3C55.4 59.9 64.9 50.8 79.5 50.8C93.4 50.8 101.4 59.2 101.4 72.8H68.5V73.5ZM68.5 65.5H88.4C88.2 59.5 84.3 56.4 78.9 56.4C73.4 56.4 69.3 59.9 68.5 65.5ZM37.2 97H24.7V51.8H9.3V41.7H52.6V51.8H37.2V97Z" fill="#FFFFFF" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 180 180" className="tech-logo-svg" fill="#ffffff">
    <circle cx="90" cy="90" r="90" fill="#000000" />
    <path d="M149.5 149.5L82.5 59.5H62.5V120.5H74.5V75.5L137.5 160.5C141.8 157.2 145.8 153.5 149.5 149.5Z" fill="#FFFFFF" />
    <rect x="117" y="60" width="12" height="60" fill="#FFFFFF" />
  </svg>
);

const ThreeIcon = () => (
  <svg viewBox="0 0 128 128" className="tech-logo-svg" fill="#FFFFFF">
    <path d="M64 14L16 98H112L64 14Z" stroke="#FFFFFF" strokeWidth="10" fill="none" strokeLinejoin="round" />
    <path d="M64 42L40 84H88L64 42Z" fill="#FFFFFF" />
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 128 128" className="tech-logo-svg" fill="#68A063">
    <path d="M64 12L112 39.7V95.3L64 123L16 95.3V39.7L64 12Z" fill="#68A063" />
    <path d="M64 26L98 45.6V84.8L64 104.4L30 84.8V45.6L64 26Z" fill="#020202" />
    <path d="M64 36L86 48.7V74.1L64 86.8L42 74.1V48.7L64 36Z" fill="#68A063" />
  </svg>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 128 128" className="tech-logo-svg" fill="#38BDF8">
    <path d="M64 32C42.7 32 37.3 48 26.7 48C16 48 10.7 37.3 0 37.3C-10.7 37.3 -16 48 -26.7 48C-37.3 48 -42.7 32 -64 32M64 80C42.7 80 37.3 96 26.7 96C16 96 10.7 85.3 0 85.3C-10.7 85.3 -16 96 -26.7 96C-37.3 96 -42.7 80 -64 80" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" fill="none" transform="translate(64, 0)" />
    <path d="M38.4 46.1C40.6 37.3 47.7 32 59.8 32C74.9 32 78.9 44 86.4 46.8C91.4 48.7 96.1 46.6 100.8 41.6C98.6 50.4 91.5 55.7 79.4 55.7C64.3 55.7 60.3 43.7 52.8 40.9C47.8 39 43.1 41.1 38.4 46.1ZM16 71.7C18.2 62.9 25.3 57.6 37.4 57.6C52.5 57.6 56.5 69.6 64 72.4C69 74.3 73.7 72.2 78.4 67.2C76.2 76 69.1 81.3 57 81.3C41.9 81.3 37.9 69.3 30.4 66.5C25.4 64.6 20.7 66.7 16 71.7Z" fill="#38BDF8" />
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 128 128" className="tech-logo-svg">
    <path d="M63.6 8C38.4 8 39.8 18.9 39.8 18.9L39.9 30.2H64.4V33.7H29.8C18.4 33.7 8 39.5 8 62.4C8 85.3 17.5 86.4 17.5 86.4H27.9V71.8C27.9 57.7 39.7 57.7 39.7 57.7H64.1C76 57.7 76 46.2 76 46.2V20.8C76 8.5 63.6 8 63.6 8ZM51.8 17.5C54.4 17.5 56.5 19.6 56.5 22.2C56.5 24.8 54.4 26.9 51.8 26.9C49.2 26.9 47.1 24.8 47.1 22.2C47.1 19.6 49.2 17.5 51.8 17.5Z" fill="#387EB8" />
    <path d="M64.4 120C89.6 120 88.2 109.1 88.2 109.1L88.1 97.8H63.6V94.3H98.2C109.6 94.3 120 88.5 120 65.6C120 42.7 110.5 41.6 110.5 41.6H100.1V56.2C100.1 70.3 88.3 70.3 88.3 70.3H63.9C52 70.3 52 81.8 52 81.8V107.2C52 119.5 64.4 120 64.4 120ZM76.2 110.5C73.6 110.5 71.5 108.4 71.5 105.8C71.5 103.2 73.6 101.1 76.2 101.1C78.8 101.1 80.9 103.2 80.9 105.8C80.9 108.4 78.8 110.5 76.2 110.5Z" fill="#FFE052" />
  </svg>
);

const MotionIcon = () => (
  <svg viewBox="0 0 128 128" className="tech-logo-svg" fill="#A855F7">
    <path d="M14 14H114V64H64L14 14Z" fill="#A855F7" />
    <path d="M14 64H64L114 114H14V64Z" fill="#C084FC" opacity="0.9" />
    <path d="M64 64H114V114L64 64Z" fill="#E879F9" opacity="0.8" />
  </svg>
);

// Tech Stack Data with realistic code snippets matching the box card layout
const rowOneTech = [
  {
    id: "react",
    name: "React.js",
    tag: "Frontend",
    accent: "#61DAFB",
    glow: "rgba(97, 218, 251, 0.3)",
    icon: <ReactIcon />,
    filename: "App.tsx",
    codeLines: [
      { tokens: [{ t: "const", c: "syn-keyword" }, { t: " [data, set] = ", c: "syn-punct" }, { t: "useState", c: "syn-func" }, { t: "();", c: "syn-punct" }] },
      { tokens: [{ t: "useEffect", c: "syn-func" }, { t: "(() => {", c: "syn-punct" }] },
      { tokens: [{ t: "  renderInteractive3D", c: "syn-func" }, { t: "(data);", c: "syn-punct" }] },
      { tokens: [{ t: "}, [data]);", c: "syn-punct" }] },
    ],
  },
  {
    id: "three",
    name: "Three.js",
    tag: "3D Graphics",
    accent: "#ffffff",
    glow: "rgba(255, 255, 255, 0.25)",
    icon: <ThreeIcon />,
    filename: "scene.js",
    codeLines: [
      { tokens: [{ t: "const", c: "syn-keyword" }, { t: " mesh = ", c: "syn-punct" }, { t: "new", c: "syn-keyword" }, { t: " THREE.", c: "syn-punct" }, { t: "Mesh", c: "syn-type" }, { t: "(", c: "syn-punct" }] },
      { tokens: [{ t: "  new", c: "syn-keyword" }, { t: " IcosahedronGeometry", c: "syn-type" }, { t: "(),", c: "syn-punct" }] },
      { tokens: [{ t: "  new", c: "syn-keyword" }, { t: " MeshPhysicalMaterial", c: "syn-type" }, { t: "()", c: "syn-punct" }] },
      { tokens: [{ t: "); scene.", c: "syn-punct" }, { t: "add", c: "syn-func" }, { t: "(mesh);", c: "syn-punct" }] },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    tag: "Languages",
    accent: "#3178C6",
    glow: "rgba(49, 120, 198, 0.3)",
    icon: <TSIcon />,
    filename: "types.ts",
    codeLines: [
      { tokens: [{ t: "interface", c: "syn-keyword" }, { t: " FullStackProject", c: "syn-type" }, { t: " {", c: "syn-punct" }] },
      { tokens: [{ t: "  title: ", c: "syn-prop" }, { t: "string", c: "syn-type" }, { t: ";", c: "syn-punct" }] },
      { tokens: [{ t: "  technologies: ", c: "syn-prop" }, { t: "TechStack", c: "syn-type" }, { t: "[];", c: "syn-punct" }] },
      { tokens: [{ t: "  isProduction: ", c: "syn-prop" }, { t: "boolean", c: "syn-type" }, { t: ";", c: "syn-punct" }] },
      { tokens: [{ t: "}", c: "syn-punct" }] },
    ],
  },
  {
    id: "next",
    name: "Next.js",
    tag: "Full-Stack",
    accent: "#ffffff",
    glow: "rgba(255, 255, 255, 0.2)",
    icon: <NextIcon />,
    filename: "page.tsx",
    codeLines: [
      { tokens: [{ t: "export default async function", c: "syn-keyword" }, { t: " Page() {", c: "syn-punct" }] },
      { tokens: [{ t: "  const", c: "syn-keyword" }, { t: " portfolio = ", c: "syn-punct" }, { t: "await", c: "syn-keyword" }, { t: " db.", c: "syn-punct" }, { t: "getWorks", c: "syn-func" }, { t: "();", c: "syn-punct" }] },
      { tokens: [{ t: "  return <", c: "syn-punct" }, { t: "Showcase", c: "syn-type" }, { t: " items={portfolio} />;", c: "syn-punct" }] },
      { tokens: [{ t: "}", c: "syn-punct" }] },
    ],
  },
];

const rowTwoTech = [
  {
    id: "node",
    name: "Node.js",
    tag: "Backend",
    accent: "#68A063",
    glow: "rgba(104, 160, 99, 0.3)",
    icon: <NodeIcon />,
    filename: "server.js",
    codeLines: [
      { tokens: [{ t: "import", c: "syn-keyword" }, { t: " express ", c: "syn-str" }, { t: "from", c: "syn-keyword" }, { t: " 'express';", c: "syn-str" }] },
      { tokens: [{ t: "const", c: "syn-keyword" }, { t: " app = ", c: "syn-punct" }, { t: "express", c: "syn-func" }, { t: "();", c: "syn-punct" }] },
      { tokens: [{ t: "app.", c: "syn-punct" }, { t: "post", c: "syn-func" }, { t: "(", c: "syn-punct" }, { t: "'/api/contact'", c: "syn-str" }, { t: ", sendMail);", c: "syn-punct" }] },
      { tokens: [{ t: "app.", c: "syn-punct" }, { t: "listen", c: "syn-func" }, { t: "(", c: "syn-punct" }, { t: "3000", c: "syn-type" }, { t: ");", c: "syn-punct" }] },
    ],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    tag: "Styling",
    accent: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.3)",
    icon: <TailwindIcon />,
    filename: "card.tsx",
    codeLines: [
      { tokens: [{ t: "<div", c: "syn-punct" }, { t: " className=", c: "syn-keyword" }, { t: "\"backdrop-blur-xl", c: "syn-str" }] },
      { tokens: [{ t: "  bg-black/80 rounded-2xl", c: "syn-str" }] },
      { tokens: [{ t: "  border border-white/10", c: "syn-str" }] },
      { tokens: [{ t: "  hover:scale-105 transition\" />", c: "syn-str" }] },
    ],
  },
  {
    id: "motion",
    name: "Motion",
    tag: "Animation",
    accent: "#EC4899",
    glow: "rgba(236, 72, 153, 0.3)",
    icon: <MotionIcon />,
    filename: "reveal.jsx",
    codeLines: [
      { tokens: [{ t: "<", c: "syn-punct" }, { t: "motion.div", c: "syn-type" }] },
      { tokens: [{ t: "  initial", c: "syn-prop" }, { t: "={{ opacity: ", c: "syn-punct" }, { t: "0", c: "syn-type" }, { t: ", y: ", c: "syn-punct" }, { t: "30", c: "syn-type" }, { t: " }}", c: "syn-punct" }] },
      { tokens: [{ t: "  whileInView", c: "syn-prop" }, { t: "={{ opacity: ", c: "syn-punct" }, { t: "1", c: "syn-type" }, { t: ", y: ", c: "syn-punct" }, { t: "0", c: "syn-type" }, { t: " }}", c: "syn-punct" }] },
      { tokens: [{ t: "  transition", c: "syn-prop" }, { t: "={{ duration: ", c: "syn-punct" }, { t: "0.6", c: "syn-type" }, { t: " }} />", c: "syn-punct" }] },
    ],
  },
  {
    id: "python",
    name: "Python",
    tag: "Data & ML",
    accent: "#FFD43B",
    glow: "rgba(255, 212, 59, 0.3)",
    icon: <PythonIcon />,
    filename: "pipeline.py",
    codeLines: [
      { tokens: [{ t: "async def", c: "syn-keyword" }, { t: " process_assets", c: "syn-func" }, { t: "(stream):", c: "syn-punct" }] },
      { tokens: [{ t: "    async for", c: "syn-keyword" }, { t: " chunk ", c: "syn-punct" }, { t: "in", c: "syn-keyword" }, { t: " stream:", c: "syn-punct" }] },
      { tokens: [{ t: "        cleaned = ", c: "syn-punct" }, { t: "transform", c: "syn-func" }, { t: "(chunk)", c: "syn-punct" }] },
      { tokens: [{ t: "        yield", c: "syn-keyword" }, { t: " cleaned", c: "syn-punct" }] },
    ],
  },
];

// Single Tech Box Card Component
const TechCard = ({ tech }) => {
  return (
    <div
      className="tech-card"
      style={{
        "--accent-color": tech.accent,
        "--accent-glow": tech.glow,
      }}
    >
      {/* Left side: Tech Stack Logo, Name and Tag */}
      <div className="tech-card-left">
        <div className="tech-logo-container">
          {tech.icon}
        </div>
        <div className="tech-name">{tech.name}</div>
        <div className="tech-tag">{tech.tag}</div>
      </div>

      {/* Right side: Code Window Mockup */}
      <div className="tech-card-right">
        <div className="tech-code-header">
          <div className="tech-code-dots">
            <span className="tech-dot tech-dot-red"></span>
            <span className="tech-dot tech-dot-yellow"></span>
            <span className="tech-dot tech-dot-green"></span>
          </div>
          <span className="tech-code-filename">{tech.filename}</span>
        </div>

        <div className="tech-code-body">
          {tech.codeLines.map((line, lIdx) => (
            <div key={lIdx} className="tech-code-line">
              {line.tokens.map((token, tIdx) => (
                <span key={tIdx} className={token.c}>
                  {token.t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Variants for section entrance/exit
const headerVariants = {
  initial: {
    y: -40,
    opacity: 0,
    filter: "blur(16px)",
  },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const rowLeftVariants = {
  initial: {
    x: -120,
    opacity: 0,
    filter: "blur(18px)",
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
};

const rowRightVariants = {
  initial: {
    x: 120,
    opacity: 0,
    filter: "blur(18px)",
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2,
    },
  },
};

export default function TechStack() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-70px", once: false });

  return (
    <section className="tech-section" id="skills" ref={sectionRef}>
      <div className="tech-bg-glow" />

      {/* Dual Side Blur Transition Overlays */}
      <motion.div 
        className="tech-side-blur tech-side-blur-left"
        initial={{ opacity: 1, scaleX: 1.3 }}
        animate={isInView ? { opacity: 0.25, scaleX: 0.7 } : { opacity: 1, scaleX: 1.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div 
        className="tech-side-blur tech-side-blur-right"
        initial={{ opacity: 1, scaleX: 1.3 }}
        animate={isInView ? { opacity: 0.25, scaleX: 0.7 } : { opacity: 1, scaleX: 1.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div 
        className="tech-header"
        variants={headerVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <h2 className="tech-title">TECH STACK</h2>
        <p className="tech-subtitle">
          Core technologies, frameworks, and graphics libraries I leverage to build scalable, interactive web solutions.
        </p>
      </motion.div>

      <div className="tech-carousel-wrapper">
        {/* Row 1 - Slides in from left, hidden & blurred, glides into position */}
        <motion.div 
          className="tech-marquee-row tech-scroll-left"
          variants={rowLeftVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >
          <div className="tech-marquee-content">
            {rowOneTech.map((tech) => (
              <TechCard key={tech.id} tech={tech} />
            ))}
          </div>
          <div className="tech-marquee-content" aria-hidden="true">
            {rowOneTech.map((tech) => (
              <TechCard key={`${tech.id}-dup`} tech={tech} />
            ))}
          </div>
          <div className="tech-marquee-content" aria-hidden="true">
            {rowOneTech.map((tech) => (
              <TechCard key={`${tech.id}-dup2`} tech={tech} />
            ))}
          </div>
        </motion.div>

        {/* Row 2 - Slides in from right, hidden & blurred, glides into position */}
        <motion.div 
          className="tech-marquee-row tech-scroll-right"
          variants={rowRightVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >
          <div className="tech-marquee-content">
            {rowTwoTech.map((tech) => (
              <TechCard key={tech.id} tech={tech} />
            ))}
          </div>
          <div className="tech-marquee-content" aria-hidden="true">
            {rowTwoTech.map((tech) => (
              <TechCard key={`${tech.id}-dup`} tech={tech} />
            ))}
          </div>
          <div className="tech-marquee-content" aria-hidden="true">
            {rowTwoTech.map((tech) => (
              <TechCard key={`${tech.id}-dup2`} tech={tech} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
