import { useEffect, useRef, useState } from "react";
import "./portfolio.css";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const items = [
    {
        id: 1,
        img: "/p1.png",
        title: "Full Stack Cinema Website",
        desc: "A feature-packed cinema and streaming web application with an extensive movie catalog, instant trailers, and personalized watchlists.",
        link: "https://cineflixtime.vercel.app/",
        category: "Cinema & Streaming",
        tags: ["React", "Node.js", "Express", "Streaming API"],
        accent: "#c084fc",
        accentGlow: "rgba(192, 132, 252, 0.45)",
    },
    {
        id: 2,
        img: "/p2.png",
        title: "Salon Management Site",
        desc: "An all-in-one salon management SaaS featuring automated appointment booking, real-time staff scheduling, and client notifications.",
        link: "https://p-lumina.netlify.app/",
        category: "SaaS & Web App",
        tags: ["Full Stack", "Booking Engine", "Tailwind", "Dashboard"],
        accent: "#f43f5e",
        accentGlow: "rgba(244, 63, 94, 0.45)",
    },
    {
        id: 3,
        img: "/p3.png",
        title: "Hotel Booking System",
        desc: "A scalable luxury hospitality reservation platform with live room availability tracking, rate tiers, and custom admin panel.",
        link: "https://p-aurelia.netlify.app/",
        category: "Hospitality & Travel",
        tags: ["React", "Reservation API", "Admin Suite", "MongoDB"],
        accent: "#38bdf8",
        accentGlow: "rgba(56, 189, 248, 0.45)",
    },
    {
        id: 4,
        img: "/p4.png",
        title: "Personal Animation Portfolio",
        desc: "An immersive creative portfolio featuring responsive 3D WebGL scenes, interactive Canvas elements, and physics-driven transitions.",
        link: "https://portfolio-tharusha.netlify.app/",
        category: "Creative 3D / WebGL",
        tags: ["Three.js", "React", "3D Canvas", "Motion"],
        accent: "#2dd4bf",
        accentGlow: "rgba(45, 212, 191, 0.45)",
    },
    {
        id: 5,
        img: "/p5.png",
        title: "Online File Converting Project",
        desc: "High-speed multi-format utility platform enabling users to seamlessly convert videos, audio, documents, and images on the fly.",
        link: "https://fromat-any-document.netlify.app/",
        category: "Utility Platform",
        tags: ["Next.js", "FFmpeg", "WebAssembly", "Cloud API"],
        accent: "#e879f9",
        accentGlow: "rgba(232, 121, 249, 0.45)",
    },
];

// Staggered character reveal variants: emerges from hidden underneath the mask
const titleContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.018,
            delayChildren: 0.05,
        },
    },
};

const charVariants = {
    hidden: {
        y: "135%",
        opacity: 0,
        rotateX: 45,
    },
    visible: {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        transition: {
            duration: 0.42,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const badgeVariants = {
    hidden: {
        y: -14,
        opacity: 0,
        transition: { duration: 0.2 },
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const tagsContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.2,
        },
    },
};

const tagVariants = {
    hidden: {
        y: 14,
        opacity: 0,
        scale: 0.88,
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.32,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const descVariants = {
    hidden: {
        y: 18,
        opacity: 0,
        transition: { duration: 0.2 },
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.45,
            delay: 0.22,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const btnVariants = {
    hidden: {
        y: 18,
        opacity: 0,
        scale: 0.92,
        transition: { duration: 0.2 },
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 18,
            stiffness: 140,
            delay: 0.3,
        },
    },
};

const ListItem = ({ item, index, total, smoothProgress, viewportWidth, isActive }) => {
    const step = 1 / (total - 1);
    const center = index * step;
    const isFirst = index === 0;
    const isLast = index === total - 1;

    // Fast, crisp range without heavy blur
    const range = isFirst
        ? [0, step * 0.9]
        : isLast
        ? [1 - step * 0.9, 1]
        : [center - step * 0.9, center, center + step * 0.9];

    // Card motion: crisp lift and perspective scale (no laggy filter: blur)
    const cardY = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, -45] : isLast ? [75, 0] : [75, 0, -45]
    );

    const cardScale = useTransform(
        smoothProgress,
        range,
        isFirst ? [1, 0.92] : isLast ? [0.92, 1] : [0.92, 1, 0.92]
    );

    const cardOpacity = useTransform(
        smoothProgress,
        range,
        isFirst ? [1, 0.3] : isLast ? [0.3, 1] : [0.3, 1, 0.3]
    );

    const cardRotateY = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, 5] : isLast ? [-5, 0] : [-5, 0, 5]
    );

    // Text container motion
    const textY = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, -30] : isLast ? [45, 0] : [45, 0, -30]
    );

    const words = item.title.split(" ");

    return (
        <div 
            className="pItem"
            style={{
                width: viewportWidth ? `${viewportWidth}px` : "100vw",
                minWidth: viewportWidth ? `${viewportWidth}px` : "100vw",
            }}
        >
            {/* Project Card Image (Left side) with Specular Sheen & 3D Lift */}
            <motion.div
                style={{
                    y: cardY,
                    scale: cardScale,
                    opacity: cardOpacity,
                    rotateY: cardRotateY,
                }}
                className="pImgWrapper"
            >
                <div 
                    className="pImg"
                    style={{
                        boxShadow: isActive 
                            ? `0 28px 65px -12px rgba(0, 0, 0, 0.88), 0 0 32px ${item.accentGlow}`
                            : "0 20px 45px -12px rgba(0, 0, 0, 0.8)",
                        borderColor: isActive ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <img src={item.img} alt={item.title} draggable={false} loading="lazy" />
                    
                    {/* Active dynamic specular light sweep across image */}
                    <motion.div 
                        className="pImgShine"
                        animate={isActive ? { x: ["-120%", "240%"], opacity: [0, 0.7, 0] } : { x: "-120%", opacity: 0 }}
                        transition={{ duration: 0.95, delay: 0.15, ease: "easeInOut" }}
                    />
                    
                    <div className="pImgGloss" />

                    {/* Live indicator overlay badge */}
                    <div className="pImgBadge">
                        <span className="pImgBadgeDot" style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }} />
                        <span>LIVE PREVIEW</span>
                    </div>
                </div>
            </motion.div>

            {/* Project Details (Right side) - Staggered Letter Reveal from hidden underneath */}
            <motion.div
                style={{ y: textY }}
                className="pText"
                animate={isActive ? "visible" : "hidden"}
                initial={index === 0 ? "visible" : "hidden"}
            >
                {/* Category & Index Header */}
                <motion.div variants={badgeVariants} className="pBadge">
                    <span 
                        className="pBadgeDot" 
                        style={{ background: item.accent, boxShadow: `0 0 10px ${item.accent}` }} 
                    />
                    <span className="pBadgeIndex">{String(index + 1).padStart(2, "0")}</span>
                    <span className="pBadgeDivider">/</span>
                    <span className="pBadgeCategory">{item.category}</span>
                </motion.div>

                {/* Masked Title: letters emerge hidden from underneath (yata hengila akuren akura) */}
                <motion.h1 
                    variants={titleContainerVariants} 
                    className="pTitle"
                >
                    {words.map((word, wordIdx) => (
                        <span key={wordIdx} className="pTitleWord">
                            {word.split("").map((char, charIdx) => (
                                <motion.span
                                    key={charIdx}
                                    variants={charVariants}
                                    className="pTitleChar"
                                >
                                    {char}
                                </motion.span>
                            ))}
                            {wordIdx < words.length - 1 && <span className="pTitleSpace">&nbsp;</span>}
                        </span>
                    ))}
                </motion.h1>

                {/* Tech Stack Chips */}
                <motion.div variants={tagsContainerVariants} className="pTags">
                    {item.tags.map((tag, tagIdx) => (
                        <motion.span 
                            key={tagIdx} 
                            variants={tagVariants}
                            className="pTag"
                            style={{
                                borderColor: isActive ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.08)",
                            }}
                        >
                            <Sparkles className="pTagIcon" style={{ color: item.accent }} />
                            <span>{tag}</span>
                        </motion.span>
                    ))}
                </motion.div>

                {/* Project Description */}
                <motion.p variants={descVariants} className="pDesc">
                    {item.desc}
                </motion.p>
                
                {/* View Project Action Button */}
                <motion.button 
                    variants={btnVariants} 
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.link, "_blank", "noopener,noreferrer");
                    }}
                    className="pBtn"
                    style={{
                        background: "#fbcfe8",
                        boxShadow: `0 10px 28px -4px rgba(251, 207, 232, 0.4), 0 0 20px ${item.accentGlow}`,
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                >
                    <span>View Project</span>
                    <ArrowUpRight className="pBtnIcon" />
                </motion.button>
            </motion.div>
        </div>
    );
};

const backgroundColorsDark = [
    "#0b0316", // 1. CineFlix Time (Cinema Violet)
    "#160212", // 2. Salon Management (Warm Rose & Magenta)
    "#030a1c", // 3. Hotel Booking (Royal Sapphire Blue)
    "#021215", // 4. Personal 3D Portfolio (Cosmic Teal)
    "#0e0318", // 5. Online File Converter (Electric Purple)
];

const backgroundColorsLight = [
    "#f5f3ff", // 1. Light Lavender Pearl
    "#fff1f2", // 2. Light Rose Pearl
    "#f0f9ff", // 3. Light Sky Blue Pearl
    "#f0fdf4", // 4. Light Mint Pearl
    "#faf5ff", // 5. Light Soft Fuchsia Pearl
];

const Portfolio = () => {
    const ref = useRef(null);
    const { theme } = useTheme();
    const isLight = theme === "light";
    const bgColors = isLight ? backgroundColorsLight : backgroundColorsDark;

    const [viewportWidth, setViewportWidth] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.clientWidth || window.innerWidth;
        }
        return 1200;
    });

    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const w = document.documentElement.clientWidth || window.innerWidth;
            if (w) setViewportWidth(w);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { scrollYProgress } = useScroll({ 
        target: ref,
        offset: ["start start", "end end"]
    });

    // Snappy spring: fast response to scroll/touch, zero lag
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 130,
        damping: 26,
        restDelta: 0.001,
    });

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (latest) => {
            const idx = Math.round(latest * (items.length - 1));
            const clamped = Math.max(0, Math.min(items.length - 1, idx));
            setActiveIdx(clamped);
        });
        return () => unsubscribe();
    }, [smoothProgress]);

    const xTranslate = useTransform(
        smoothProgress,
        [0, 1],
        [0, -viewportWidth * (items.length - 1)]
    );

    const stickyBg = useTransform(
        smoothProgress,
        [0, 0.25, 0.5, 0.75, 1],
        bgColors
    );

    const progressBarScale = useTransform(smoothProgress, [0, 1], [0, 1]);

    return (
        <div className="portfolio font-geist" ref={ref} id="portfolio">
            <motion.div 
                className="pSticky"
                style={{ backgroundColor: stickyBg }}
            >
                {/* Top Glowing Scroll Progress Bar */}
                <div className="pTopProgressTrack">
                    <motion.div 
                        className="pTopProgressBar" 
                        style={{ 
                            scaleX: progressBarScale,
                            background: `linear-gradient(90deg, #c084fc, ${items[activeIdx]?.accent || "#fbcfe8"})`,
                        }} 
                    />
                </div>

                {/* Lightweight edge gradients for cinema look (no heavy backdrop-filter blur) */}
                <div className="p-edge-vignette p-edge-left" />
                <div className="p-edge-vignette p-edge-right" />

                {/* Horizontal Project List */}
                <motion.div 
                    className="pList" 
                    style={{ x: xTranslate }}
                >
                    {items.map((item, index) => (
                        <ListItem 
                            item={item} 
                            key={item.id} 
                            index={index} 
                            total={items.length}
                            smoothProgress={smoothProgress}
                            viewportWidth={viewportWidth}
                            isActive={activeIdx === index}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Portfolio;
