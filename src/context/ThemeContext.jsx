/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const defaultThemeContext = {
  theme: "dark",
  toggleTheme: () => {},
  blastState: {
    active: false,
    origin: { x: typeof window !== "undefined" ? window.innerWidth / 2 : 500, y: 50 },
    targetTheme: "dark",
    key: 0,
  },
};

const ThemeContext = createContext(defaultThemeContext);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context || defaultThemeContext;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("portfolio_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    }
    return "dark";
  });

  const [blastState, setBlastState] = useState({
    active: false,
    origin: { x: window.innerWidth / 2, y: 50 },
    targetTheme: "dark",
    key: 0,
  });

  // Apply data-theme attribute and class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    }
    try {
      localStorage.setItem("portfolio_theme", theme);
    } catch {
      // ignore storage error
    }
  }, [theme]);

  // Gentle audio synthesis for theme blast
  const playThemeSound = (nextTheme) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (nextTheme === "light") {
        // Sunrise: Bright warm rising shimmer
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc2.type = "triangle";

        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5
        osc2.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now + 0.05);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
      } else {
        // Nightfall: Cosmic deep shimmer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.22); // E4

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const toggleTheme = useCallback(
    (e) => {
      let x = window.innerWidth - 80;
      let y = 30;

      if (e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (e && typeof e.clientX === "number") {
        x = e.clientX;
        y = e.clientY;
      }

      const nextTheme = theme === "dark" ? "light" : "dark";

      // Trigger blast animation
      setBlastState((prev) => ({
        active: true,
        origin: { x, y },
        targetTheme: nextTheme,
        key: prev.key + 1,
      }));

      playThemeSound(nextTheme);

      // Switch theme right at the start of shockwave expansion
      setTimeout(() => {
        setTheme(nextTheme);
      }, 140);

      // End blast animation
      setTimeout(() => {
        setBlastState((prev) => ({ ...prev, active: false }));
      }, 950);
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, blastState }}>
      {children}
    </ThemeContext.Provider>
  );
};
