import { useEffect, useRef, useState } from "react";
import "./portfolio.css";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const items = [
    {
        id: 1,
        img: "/p1.png",
        title: "Full Stack Cinema Website",
        desc: "A website full of all the latest TV series and movies, so you can choose and watch the movie you want whenever you want.",
        link: "https://cineflixtime.vercel.app/",
        category: "Full Stack / Cinema & Streaming",
    },
    {
        id: 2,
        img: "/p2.png",
        title: "Salon Management Site",
        desc: "An all-in-one management solution for salons featuring appointment scheduling and client notifications.",
        link: "https://p-lumina.netlify.app/",
        category: "Web Application / SaaS",
    },
    {
        id: 3,
        img: "/p3.png",
        title: "Hotel Booking System",
        desc: "A scalable hotel reservation system developed with modern architecture, room availability tracking, and a dedicated admin panel.",
        link: "https://p-aurelia.netlify.app/",
        category: "Full Stack / Hospitality",
    },
    {
        id: 4,
        img: "/p4.png",
        title: "Personal Animation Portfolio",
        desc: "An interactive 3D portfolio website showcasing developer projects with smooth transitions, 3D Canvas elements, and responsive layout.",
        link: "https://portfolio-tharusha.netlify.app/",
        category: "Interactive 3D / Creative",
    },
    {
        id: 5,
        img: "/p5.png",
        title: "Online file converting Project",
        desc: "The only place where people can convert any file, video, or image to make their own files when they need them.",
        link: "https://fromat-any-document.netlify.app/",
        category: "Utility Platform / File Converter",
    },
];

const titleVariants = {
    hidden: {
        transition: {
            staggerChildren: 0.015,
            staggerDirection: -1,
        },
    },
    visible: {
        transition: {
            staggerChildren: 0.024,
            delayChildren: 0.06,
        },
    },
};

const charVariants = {
    hidden: {
        y: "115%",
        opacity: 0,
        rotateX: 45,
        filter: "blur(4px)",
    },
    visible: {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            damping: 18,
            stiffness: 115,
            mass: 0.5,
        },
    },
};

const descVariants = {
    hidden: {
        y: 28,
        opacity: 0,
        filter: "blur(6px)",
        transition: { duration: 0.3 },
    },
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.65,
            delay: 0.28,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const btnVariants = {
    hidden: {
        y: 20,
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.25 },
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 16,
            stiffness: 130,
            delay: 0.38,
        },
    },
};

const badgeVariants = {
    hidden: {
        y: -15,
        opacity: 0,
        filter: "blur(4px)",
        transition: { duration: 0.25 },
    },
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const ListItem = ({ item, index, total, smoothProgress, viewportWidth }) => {
    const center = index / (total - 1);
    const step = 1 / (total - 1);
    const isFirst = index === 0;
    const isLast = index === total - 1;

    // Range for when this card is approached, centered, and exited
    const range = isFirst
        ? [0, step * 0.85]
        : isLast
        ? [1 - step * 0.85, 1]
        : [center - step * 0.85, center, center + step * 0.85];

    // Card smoothly flows upward from bottom to center as it arrives from side
    const cardY = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, -65] : isLast ? [120, 0] : [120, 0, -65]
    );

    const cardScale = useTransform(
        smoothProgress,
        range,
        isFirst ? [1, 0.88] : isLast ? [0.86, 1] : [0.86, 1, 0.88]
    );

    const cardOpacity = useTransform(
        smoothProgress,
        range,
        isFirst ? [1, 0.25] : isLast ? [0.25, 1] : [0.25, 1, 0.25]
    );

    const cardRotateX = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, -6] : isLast ? [8, 0] : [8, 0, -6]
    );

    const cardRotateZ = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, 2] : isLast ? [-3, 0] : [-3, 0, 2]
    );

    // Left side: hides to left with blur, slides into place, exits to left with blur
    const cardX = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, -85] : isLast ? [-95, 0] : [-95, 0, -85]
    );

    const cardFilter = useTransform(
        smoothProgress,
        range,
        isFirst
            ? ["blur(0px)", "blur(16px)"]
            : isLast
            ? ["blur(16px)", "blur(0px)"]
            : ["blur(16px)", "blur(0px)", "blur(16px)"]
    );

    // Right side: hides to right with blur, slides into place, exits to right with blur
    const textX = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, 85] : isLast ? [95, 0] : [95, 0, 85]
    );

    const textFilter = useTransform(
        smoothProgress,
        range,
        isFirst
            ? ["blur(0px)", "blur(16px)"]
            : isLast
            ? ["blur(16px)", "blur(0px)"]
            : ["blur(16px)", "blur(0px)", "blur(16px)"]
    );

    const textY = useTransform(
        smoothProgress,
        range,
        isFirst ? [0, -35] : isLast ? [50, 0] : [50, 0, -35]
    );

    // Active state listener to trigger staggered letter and text reveal
    const [isActive, setIsActive] = useState(index === 0);

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (latest) => {
            const diff = Math.abs(latest - center);
            const shouldBeActive = diff < step * 0.48;
            setIsActive(shouldBeActive);
        });
        return () => unsubscribe();
    }, [smoothProgress, center, step]);

    const words = item.title.split(" ");

    return (
        <div 
            className="pItem"
            style={{
                width: viewportWidth ? `${viewportWidth}px` : "100vw",
                minWidth: viewportWidth ? `${viewportWidth}px` : "100vw",
            }}
        >
            {/* Project Card (Left side) - Smoothly flows from bottom to top, hidden & blurred on edges */}
            <motion.div
                style={{
                    x: cardX,
                    filter: cardFilter,
                    y: cardY,
                    scale: cardScale,
                    opacity: cardOpacity,
                    rotateX: cardRotateX,
                    rotateZ: cardRotateZ,
                }}
                className="pImgWrapper"
            >
                <div className="pImg">
                    <img src={item.img} alt={item.title} draggable={false} />
                    <div className="pImgGloss" />
                </div>
            </motion.div>

            {/* Project Details (Right side) - Hidden to right & blurred on edges, unblurs in focus */}
            <motion.div
                style={{ 
                    x: textX,
                    filter: textFilter,
                    y: textY 
                }}
                className="pText"
                animate={isActive ? "visible" : "hidden"}
                initial={index === 0 ? "visible" : "hidden"}
            >
                <motion.div variants={badgeVariants} className="pBadge">
                    <span className="pBadgeDot" />
                    <span className="pBadgeIndex">{String(index + 1).padStart(2, "0")}</span>
                    <span className="pBadgeDivider">/</span>
                    <span className="pBadgeCategory">{item.category}</span>
                </motion.div>

                <motion.h1 
                    variants={titleVariants} 
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

                <motion.p variants={descVariants} className="pDesc">
                    {item.desc}
                </motion.p>
                
                <motion.button 
                    variants={btnVariants} 
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.link, "_blank", "noopener,noreferrer");
                    }}
                    className="pBtn"
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

const backgroundColors = [
    "#0b0316", // 1. CineFlix Time (Cinema Violet)
    "#160212", // 2. Salon Management (Warm Rose & Magenta)
    "#030a1c", // 3. Hotel Booking (Royal Sapphire Blue)
    "#021215", // 4. Personal 3D Portfolio (Cosmic Teal / Emerald)
    "#0e0318", // 5. Online File Converter (Electric Purple)
];

const Portfolio = () => {
    const ref = useRef(null);
    const [viewportWidth, setViewportWidth] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.clientWidth || window.innerWidth;
        }
        return 1200;
    });

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

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 24,
        restDelta: 0.001,
    });

    const xTranslate = useTransform(
        smoothProgress,
        [0, 1],
        [0, -viewportWidth * (items.length - 1)]
    );

    const stickyBg = useTransform(
        smoothProgress,
        [0, 0.25, 0.5, 0.75, 1],
        backgroundColors
    );

    const sideBlurOpacity = useTransform(
        smoothProgress,
        [0, 0.08, 0.92, 1],
        [0.85, 0.25, 0.25, 0.85]
    );

    return (
        <div className="portfolio font-geist" ref={ref}>
            <motion.div 
                className="pSticky"
                style={{ backgroundColor: stickyBg }}
            >
                {/* Dual Side Blur Wings for cinematic horizontal scroll */}
                <motion.div 
                    className="p-side-blur p-side-blur-left"
                    style={{ opacity: sideBlurOpacity }}
                />
                <motion.div 
                    className="p-side-blur p-side-blur-right"
                    style={{ opacity: sideBlurOpacity }}
                />

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
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Portfolio;
