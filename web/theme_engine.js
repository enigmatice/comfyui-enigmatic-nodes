import { app } from "/scripts/app.js";

app.registerExtension({
    name: "enigmatic.theme",

    setup() {

// ─── Themes ───────────────────────────────────────────────────────────────────
// font      = CSS font-family stack applied to DOM + canvas node/group text
// googleFont = optional Google Fonts @import URL (only loads when theme is active)

const THEMES = {

    comfy_default: {
        label: "ComfyUI Default", tags: ["default", "original", "gray", "dark", "standard", "reset"],
        canvas: "#1a1a1a", nodeHeader: "#353535", nodeBody: "#1e1e1e", groupColor: "#3a3a3a",
        font: "system-ui, 'Segoe UI', sans-serif",
        css: { "--bg-color": "#202020", "--fg-color": "#dddddd", "--comfy-menu-bg": "#353535",
               "--comfy-menu-secondary-bg": "#292929", "--comfy-input-bg": "#222222",
               "--border-color": "#4e4e4e", "--content-bg": "#353535", "--content-fg": "#dddddd",
               "--content-hover-bg": "#3f3f3f", "--input-text": "#dddddd" },
    },

    // ── Sci-fi / Neon ─────────────────────────────────────────────────────────

    cyberpunk: {
        label: "Cyberpunk", tags: ["yellow", "neon", "dark", "sci-fi", "futuristic", "tech"],
        canvas: "#0a0a0f", nodeHeader: "#3a2000", nodeBody: "#1a1a2e", groupColor: "#f7c948",
        font: "'Orbitron', 'Share Tech Mono', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap",
        css: { "--bg-color": "#0d0d1a", "--fg-color": "#f7c948", "--comfy-menu-bg": "#1a1a2e",
               "--comfy-menu-secondary-bg": "#12122a", "--comfy-input-bg": "#0d0d1a",
               "--border-color": "#f7c94866", "--content-bg": "#1a1a2e", "--content-fg": "#ffe680",
               "--content-hover-bg": "#2a2a0e", "--input-text": "#ffe680" },
    },

    matrix: {
        label: "Matrix", tags: ["green", "dark", "hacker", "terminal", "code", "retro"],
        canvas: "#000300", nodeHeader: "#00cc33", nodeBody: "#0a1f0a", groupColor: "#00ff41",
        font: "'Space Mono', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",
        css: { "--bg-color": "#000300", "--fg-color": "#00ff41", "--comfy-menu-bg": "#001a00",
               "--comfy-menu-secondary-bg": "#001400", "--comfy-input-bg": "#000800",
               "--border-color": "#00aa2266", "--content-bg": "#001a00", "--content-fg": "#00ff41",
               "--content-hover-bg": "#002200", "--input-text": "#00dd33" },
    },

    tron: {
        label: "Tron", tags: ["cyan", "dark", "neon", "sci-fi", "grid", "blue"],
        canvas: "#010a0f", nodeHeader: "#003344", nodeBody: "#001a22", groupColor: "#00e5ff",
        font: "'Share Tech Mono', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
        css: { "--bg-color": "#010a0f", "--fg-color": "#00e5ff", "--comfy-menu-bg": "#001a22",
               "--comfy-menu-secondary-bg": "#00141a", "--comfy-input-bg": "#010a0f",
               "--border-color": "#0088aa66", "--content-bg": "#001a22", "--content-fg": "#80f0ff",
               "--content-hover-bg": "#002233", "--input-text": "#80f0ff" },
    },

    synthwave: {
        label: "Synthwave", tags: ["purple", "pink", "neon", "retro", "80s", "magenta"],
        canvas: "#0d0221", nodeHeader: "#44004a", nodeBody: "#1a0533", groupColor: "#bf5fff",
        font: "'Orbitron', 'Share Tech Mono', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap",
        css: { "--bg-color": "#0d0221", "--fg-color": "#ff9de2", "--comfy-menu-bg": "#1a0533",
               "--comfy-menu-secondary-bg": "#130326", "--comfy-input-bg": "#0d0221",
               "--border-color": "#bf5fff66", "--content-bg": "#1a0533", "--content-fg": "#ff9de2",
               "--content-hover-bg": "#2a0540", "--input-text": "#ff9de2" },
    },

    vaporwave: {
        label: "Vaporwave", tags: ["pink", "teal", "retro", "aesthetic", "pastel", "80s", "purple"],
        canvas: "#1a0533", nodeHeader: "#4a1060", nodeBody: "#2d1b4e", groupColor: "#ff71ce",
        font: "'VT323', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=VT323&display=swap",
        css: { "--bg-color": "#1a0533", "--fg-color": "#ff71ce", "--comfy-menu-bg": "#2d1b4e",
               "--comfy-menu-secondary-bg": "#220a40", "--comfy-input-bg": "#1a0533",
               "--border-color": "#ff71ce55", "--content-bg": "#2d1b4e", "--content-fg": "#ff71ce",
               "--content-hover-bg": "#3a1f60", "--input-text": "#b967ff" },
    },

    deep_space: {
        label: "Deep Space", tags: ["dark", "blue", "space", "stars", "navy", "minimal"],
        canvas: "#02020a", nodeHeader: "#0a0a3e", nodeBody: "#080822", groupColor: "#4444cc",
        font: "'Exo 2', 'Segoe UI', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap",
        css: { "--bg-color": "#02020a", "--fg-color": "#aaaaee", "--comfy-menu-bg": "#080822",
               "--comfy-menu-secondary-bg": "#06061a", "--comfy-input-bg": "#02020a",
               "--border-color": "#2222aa55", "--content-bg": "#080822", "--content-fg": "#aaaaee",
               "--content-hover-bg": "#10103a", "--input-text": "#ccccff" },
    },

    aurora: {
        label: "Aurora", tags: ["green", "teal", "dark", "northern", "lights", "nature"],
        canvas: "#030a0f", nodeHeader: "#0a3320", nodeBody: "#041208", groupColor: "#00f5a0",
        font: "'Exo 2', 'Segoe UI', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap",
        css: { "--bg-color": "#040c12", "--fg-color": "#00f5a0", "--comfy-menu-bg": "#092218",
               "--comfy-menu-secondary-bg": "#061710", "--comfy-input-bg": "#030a0f",
               "--border-color": "#00f5a055", "--content-bg": "#0e3020", "--content-fg": "#44ffbb",
               "--content-hover-bg": "#123d28", "--input-text": "#66ffcc" },
    },

    neon_noir: {
        label: "Neon Noir", tags: ["pink", "dark", "neon", "noir", "contrast", "magenta"],
        canvas: "#050208", nodeHeader: "#3a0022", nodeBody: "#0e0518", groupColor: "#ff0099",
        font: "'Share Tech Mono', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
        css: { "--bg-color": "#050208", "--fg-color": "#ff66cc", "--comfy-menu-bg": "#0e0518",
               "--comfy-menu-secondary-bg": "#0a0412", "--comfy-input-bg": "#050208",
               "--border-color": "#88004455", "--content-bg": "#0e0518", "--content-fg": "#ff66cc",
               "--content-hover-bg": "#180828", "--input-text": "#ff99dd" },
    },

    blade_runner: {
        label: "Blade Runner", tags: ["orange", "dark", "noir", "sci-fi", "rain", "neon"],
        canvas: "#0a0805", nodeHeader: "#3a1800", nodeBody: "#1a0f08", groupColor: "#ff6b1a",
        font: "'Share Tech Mono', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
        css: { "--bg-color": "#0a0805", "--fg-color": "#ff9955", "--comfy-menu-bg": "#1a0f08",
               "--comfy-menu-secondary-bg": "#140c06", "--comfy-input-bg": "#0d0a06",
               "--border-color": "#cc440055", "--content-bg": "#1a0f08", "--content-fg": "#ff9955",
               "--content-hover-bg": "#281508", "--input-text": "#ffbb88" },
    },

    toxic: {
        label: "Toxic", tags: ["green", "yellow", "neon", "dark", "acid", "poison"],
        canvas: "#050f00", nodeHeader: "#2a4800", nodeBody: "#0a1e00", groupColor: "#88dd00",
        font: "'Space Mono', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",
        css: { "--bg-color": "#050f00", "--fg-color": "#aaff00", "--comfy-menu-bg": "#0a1e00",
               "--comfy-menu-secondary-bg": "#081800", "--comfy-input-bg": "#050f00",
               "--border-color": "#44880055", "--content-bg": "#0a1e00", "--content-fg": "#aaff00",
               "--content-hover-bg": "#102800", "--input-text": "#ccff44" },
    },

    // ── Nature ────────────────────────────────────────────────────────────────

    forest: {
        label: "Forest", tags: ["green", "nature", "dark", "earth", "trees", "organic"],
        canvas: "#0a1a0a", nodeHeader: "#1e4a20", nodeBody: "#1a2e1a", groupColor: "#5a9e50",
        font: "'Lora', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",
        css: { "--bg-color": "#0a1a0a", "--fg-color": "#8cc97e", "--comfy-menu-bg": "#1a2e1a",
               "--comfy-menu-secondary-bg": "#142214", "--comfy-input-bg": "#0d1f0d",
               "--border-color": "#3d6b3555", "--content-bg": "#1a2e1a", "--content-fg": "#8cc97e",
               "--content-hover-bg": "#243824", "--input-text": "#a8d99a" },
    },

    ocean: {
        label: "Ocean", tags: ["blue", "teal", "water", "dark", "deep", "waves"],
        canvas: "#020d18", nodeHeader: "#0d2d44", nodeBody: "#061e30", groupColor: "#2a8aaa",
        font: "'Raleway', 'Segoe UI', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap",
        css: { "--bg-color": "#020d18", "--fg-color": "#7fd4f0", "--comfy-menu-bg": "#061e30",
               "--comfy-menu-secondary-bg": "#041624", "--comfy-input-bg": "#03121e",
               "--border-color": "#1a557055", "--content-bg": "#061e30", "--content-fg": "#7fd4f0",
               "--content-hover-bg": "#082840", "--input-text": "#a8e4f5" },
    },

    desert: {
        label: "Desert", tags: ["orange", "tan", "warm", "earth", "sand", "brown"],
        canvas: "#1a1005", nodeHeader: "#4a2a08", nodeBody: "#2e1f0a", groupColor: "#d4924e",
        font: "'Merriweather', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
        css: { "--bg-color": "#1a1005", "--fg-color": "#e8b87a", "--comfy-menu-bg": "#2e1f0a",
               "--comfy-menu-secondary-bg": "#221607", "--comfy-input-bg": "#1e1308",
               "--border-color": "#8a522855", "--content-bg": "#2e1f0a", "--content-fg": "#e8b87a",
               "--content-hover-bg": "#3a2810", "--input-text": "#f0cc99" },
    },

    arctic: {
        label: "Arctic", tags: ["white", "blue", "cold", "ice", "light", "minimal", "clean"],
        canvas: "#e8f2fa", nodeHeader: "#2e7abd", nodeBody: "#d0e8f8", groupColor: "#4a96d6",
        font: "'Inter', 'Segoe UI', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
        css: { "--bg-color": "#e8f2fa", "--fg-color": "#1a3d5c", "--comfy-menu-bg": "#d0e8f8",
               "--comfy-menu-secondary-bg": "#c0daf0", "--comfy-input-bg": "#e0eef8",
               "--border-color": "#7ab4d8", "--content-bg": "#d0e8f8", "--content-fg": "#1a3d5c",
               "--content-hover-bg": "#b8d6f0", "--input-text": "#0d2a42" },
    },

    autumn: {
        label: "Autumn", tags: ["orange", "red", "warm", "fall", "leaves", "earth", "amber"],
        canvas: "#1a0d05", nodeHeader: "#4a2005", nodeBody: "#2e1808", groupColor: "#d4712a",
        font: "'Lora', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",
        css: { "--bg-color": "#1a0d05", "--fg-color": "#e09060", "--comfy-menu-bg": "#2e1808",
               "--comfy-menu-secondary-bg": "#221205", "--comfy-input-bg": "#1e1007",
               "--border-color": "#8a3c1055", "--content-bg": "#2e1808", "--content-fg": "#e09060",
               "--content-hover-bg": "#3a2010", "--input-text": "#f0b080" },
    },

    volcanic: {
        label: "Volcanic", tags: ["red", "orange", "dark", "fire", "lava", "dramatic"],
        canvas: "#0f0500", nodeHeader: "#440800", nodeBody: "#200800", groupColor: "#ff4411",
        font: "'Anton', Impact, sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
        css: { "--bg-color": "#0f0500", "--fg-color": "#ff6633", "--comfy-menu-bg": "#200800",
               "--comfy-menu-secondary-bg": "#180600", "--comfy-input-bg": "#140400",
               "--border-color": "#88220055", "--content-bg": "#200800", "--content-fg": "#ff6633",
               "--content-hover-bg": "#2a0c00", "--input-text": "#ff8855" },
    },

    jade: {
        label: "Jade", tags: ["green", "dark", "gem", "rich", "deep", "cool"],
        canvas: "#011a08", nodeHeader: "#0a4a28", nodeBody: "#022e14", groupColor: "#0acc66",
        font: "'Cormorant Garamond', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap",
        css: { "--bg-color": "#011a08", "--fg-color": "#50d890", "--comfy-menu-bg": "#022e14",
               "--comfy-menu-secondary-bg": "#01220e", "--comfy-input-bg": "#011a08",
               "--border-color": "#0a5e3055", "--content-bg": "#022e14", "--content-fg": "#50d890",
               "--content-hover-bg": "#043820", "--input-text": "#80eeb0" },
    },

    // ── Developer / Professional ──────────────────────────────────────────────

    slate: {
        label: "Slate", tags: ["gray", "dark", "minimal", "professional", "clean", "neutral"],
        canvas: "#0e1117", nodeHeader: "#2a3141", nodeBody: "#1f2937", groupColor: "#4b5563",
        font: "'Inter', 'Segoe UI', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
        css: { "--bg-color": "#0e1117", "--fg-color": "#d1d5db", "--comfy-menu-bg": "#1f2937",
               "--comfy-menu-secondary-bg": "#171e2b", "--comfy-input-bg": "#111827",
               "--border-color": "#374151", "--content-bg": "#1f2937", "--content-fg": "#d1d5db",
               "--content-hover-bg": "#2d3748", "--input-text": "#e5e7eb" },
    },

    nord: {
        label: "Nord", tags: ["blue", "gray", "nordic", "cool", "minimal", "pastel", "developer"],
        canvas: "#2e3440", nodeHeader: "#3b4252", nodeBody: "#3b4252", groupColor: "#5e81ac",
        font: "'JetBrains Mono', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap",
        css: { "--bg-color": "#2e3440", "--fg-color": "#eceff4", "--comfy-menu-bg": "#3b4252",
               "--comfy-menu-secondary-bg": "#353c4a", "--comfy-input-bg": "#2e3440",
               "--border-color": "#4c566a", "--content-bg": "#3b4252", "--content-fg": "#eceff4",
               "--content-hover-bg": "#434c5e", "--input-text": "#e5e9f0" },
    },

    dracula: {
        label: "Dracula", tags: ["purple", "dark", "developer", "terminal", "classic", "pink"],
        canvas: "#1e1f29", nodeHeader: "#44475a", nodeBody: "#282a36", groupColor: "#bd93f9",
        font: "'Fira Code', 'Consolas', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap",
        css: { "--bg-color": "#1e1f29", "--fg-color": "#f8f8f2", "--comfy-menu-bg": "#282a36",
               "--comfy-menu-secondary-bg": "#21222c", "--comfy-input-bg": "#1e1f29",
               "--border-color": "#6272a4", "--content-bg": "#282a36", "--content-fg": "#f8f8f2",
               "--content-hover-bg": "#343746", "--input-text": "#cdd6f4" },
    },

    monokai: {
        label: "Monokai", tags: ["dark", "developer", "colorful", "terminal", "editor", "green"],
        canvas: "#1e1e1e", nodeHeader: "#4a4a35", nodeBody: "#272822", groupColor: "#a6e22e",
        font: "'Fira Code', 'Consolas', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap",
        css: { "--bg-color": "#1e1e1e", "--fg-color": "#f8f8f2", "--comfy-menu-bg": "#272822",
               "--comfy-menu-secondary-bg": "#1e1f1b", "--comfy-input-bg": "#1e1e1e",
               "--border-color": "#49483e", "--content-bg": "#272822", "--content-fg": "#f8f8f2",
               "--content-hover-bg": "#33342e", "--input-text": "#f8f8f0" },
    },

    solarized_dark: {
        label: "Solarized Dark", tags: ["teal", "dark", "developer", "warm", "classic", "professional"],
        canvas: "#002b36", nodeHeader: "#073642", nodeBody: "#002b36", groupColor: "#268bd2",
        font: "'Fira Code', 'Consolas', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap",
        css: { "--bg-color": "#002b36", "--fg-color": "#93a1a1", "--comfy-menu-bg": "#073642",
               "--comfy-menu-secondary-bg": "#00222c", "--comfy-input-bg": "#002b36",
               "--border-color": "#586e75", "--content-bg": "#073642", "--content-fg": "#93a1a1",
               "--content-hover-bg": "#0d4050", "--input-text": "#93a1a1" },
    },

    obsidian: {
        label: "Obsidian", tags: ["dark", "black", "minimal", "elegant", "night", "pure"],
        canvas: "#050505", nodeHeader: "#1e1e1e", nodeBody: "#121212", groupColor: "#444444",
        font: "'JetBrains Mono', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap",
        css: { "--bg-color": "#050505", "--fg-color": "#cccccc", "--comfy-menu-bg": "#121212",
               "--comfy-menu-secondary-bg": "#0d0d0d", "--comfy-input-bg": "#0a0a0a",
               "--border-color": "#2a2a2a", "--content-bg": "#121212", "--content-fg": "#cccccc",
               "--content-hover-bg": "#1a1a1a", "--input-text": "#e0e0e0" },
    },

    midnight: {
        label: "Midnight", tags: ["dark", "blue", "professional", "minimal", "navy", "clean"],
        canvas: "#080c14", nodeHeader: "#14264a", nodeBody: "#101828", groupColor: "#3a5a8a",
        font: "'Audiowide', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Audiowide&display=swap",
        css: { "--bg-color": "#080c14", "--fg-color": "#8aaed8", "--comfy-menu-bg": "#101828",
               "--comfy-menu-secondary-bg": "#0c1420", "--comfy-input-bg": "#0a1018",
               "--border-color": "#1e3a5a55", "--content-bg": "#101828", "--content-fg": "#8aaed8",
               "--content-hover-bg": "#182238", "--input-text": "#b0ccee" },
    },

    blueprint: {
        label: "Blueprint", tags: ["blue", "dark", "technical", "grid", "architect", "white"],
        canvas: "#0a1520", nodeHeader: "#0e2a44", nodeBody: "#102030", groupColor: "#4488cc",
        font: "'Share Tech Mono', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
        css: { "--bg-color": "#0a1520", "--fg-color": "#aaccee", "--comfy-menu-bg": "#102030",
               "--comfy-menu-secondary-bg": "#0d1828", "--comfy-input-bg": "#081320",
               "--border-color": "#4488cc44", "--content-bg": "#152a3a", "--content-fg": "#88aacc",
               "--content-hover-bg": "#1a3348", "--input-text": "#aaccee" },
    },

    // ── Light themes ──────────────────────────────────────────────────────────

    newspaper: {
        label: "Newspaper", tags: ["black", "white", "minimal", "print", "contrast", "light"],
        canvas: "#f5f5f0", nodeHeader: "#1a1a1a", nodeBody: "#e8e8e0", groupColor: "#333333",
        font: "'Special Elite', cursive",
        googleFont: "https://fonts.googleapis.com/css2?family=Special+Elite&display=swap",
        css: { "--bg-color": "#f5f5f0", "--fg-color": "#1a1a1a", "--comfy-menu-bg": "#e8e8e0",
               "--comfy-menu-secondary-bg": "#dcdcd4", "--comfy-input-bg": "#f5f5f0",
               "--border-color": "#999999", "--content-bg": "#e8e8e0", "--content-fg": "#1a1a1a",
               "--content-hover-bg": "#d8d8cc", "--input-text": "#000000" },
    },

    cherry_blossom: {
        label: "Cherry Blossom", tags: ["pink", "light", "soft", "japanese", "spring", "pastel", "cute"],
        canvas: "#fce4ec", nodeHeader: "#c2185b", nodeBody: "#f8bbd9", groupColor: "#f06292",
        font: "'IM Fell English', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap",
        css: { "--bg-color": "#fce4ec", "--fg-color": "#880e4f", "--comfy-menu-bg": "#f8bbd9",
               "--comfy-menu-secondary-bg": "#f5a8cc", "--comfy-input-bg": "#fce4ec",
               "--border-color": "#f06292", "--content-bg": "#f8bbd9", "--content-fg": "#880e4f",
               "--content-hover-bg": "#f299be", "--input-text": "#560027" },
    },

    // ── Vintage / Warm ────────────────────────────────────────────────────────

    retro: {
        label: "Retro", tags: ["brown", "warm", "vintage", "amber", "sepia", "old"],
        canvas: "#1a1008", nodeHeader: "#3a2810", nodeBody: "#2a1c0e", groupColor: "#aa7744",
        font: "'Righteous', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Righteous&display=swap",
        css: { "--bg-color": "#1e1408", "--fg-color": "#ddb866", "--comfy-menu-bg": "#261a0d",
               "--comfy-menu-secondary-bg": "#1e1508", "--comfy-input-bg": "#180f06",
               "--border-color": "#aa774455", "--content-bg": "#332211", "--content-fg": "#cc9944",
               "--content-hover-bg": "#3d2a14", "--input-text": "#ddb866" },
    },

    steampunk: {
        label: "Steampunk", tags: ["copper", "brass", "dark", "brown", "vintage", "gears"],
        canvas: "#0f0a05", nodeHeader: "#3a2008", nodeBody: "#1a1208", groupColor: "#c4882a",
        font: "'IM Fell English', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap",
        css: { "--bg-color": "#18100a", "--fg-color": "#c4882a", "--comfy-menu-bg": "#221808",
               "--comfy-menu-secondary-bg": "#1a1206", "--comfy-input-bg": "#0f0a05",
               "--border-color": "#c4882a55", "--content-bg": "#352010", "--content-fg": "#d4994a",
               "--content-hover-bg": "#40280e", "--input-text": "#c4882a" },
    },

    coffee: {
        label: "Coffee", tags: ["brown", "warm", "dark", "cozy", "earth", "mocha"],
        canvas: "#1a0f08", nodeHeader: "#4a2a12", nodeBody: "#2e1a0e", groupColor: "#8a5534",
        font: "'Merriweather', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
        css: { "--bg-color": "#1a0f08", "--fg-color": "#c8956a", "--comfy-menu-bg": "#2e1a0e",
               "--comfy-menu-secondary-bg": "#22140a", "--comfy-input-bg": "#1a0f08",
               "--border-color": "#5a302055", "--content-bg": "#2e1a0e", "--content-fg": "#c8956a",
               "--content-hover-bg": "#3a2010", "--input-text": "#e0b090" },
    },

    dungeon: {
        label: "Dungeon", tags: ["dark", "stone", "gold", "fantasy", "medieval", "RPG"],
        canvas: "#0a0805", nodeHeader: "#2a2010", nodeBody: "#1e1a0c", groupColor: "#c8aa44",
        font: "'Uncial Antiqua', cursive",
        googleFont: "https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap",
        css: { "--bg-color": "#0f0c08", "--fg-color": "#c8aa44", "--comfy-menu-bg": "#1c180a",
               "--comfy-menu-secondary-bg": "#161208", "--comfy-input-bg": "#0a0805",
               "--border-color": "#c8aa4455", "--content-bg": "#282210", "--content-fg": "#dabb55",
               "--content-hover-bg": "#342c14", "--input-text": "#c8aa44" },
    },

    // ── Retro Gaming ──────────────────────────────────────────────────────────

    gameboy: {
        label: "Game Boy", tags: ["green", "retro", "gaming", "pixel", "8bit", "classic"],
        canvas: "#0f380f", nodeHeader: "#306230", nodeBody: "#0f380f", groupColor: "#8bac0f",
        font: "'Press Start 2P', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
        css: { "--bg-color": "#0f380f", "--fg-color": "#9bbc0f", "--comfy-menu-bg": "#306230",
               "--comfy-menu-secondary-bg": "#1e4e1e", "--comfy-input-bg": "#0f380f",
               "--border-color": "#306230", "--content-bg": "#306230", "--content-fg": "#9bbc0f",
               "--content-hover-bg": "#3a6e3a", "--input-text": "#8bac0f" },
    },

    crt_amber: {
        label: "CRT Amber", tags: ["orange", "retro", "terminal", "crt", "vintage", "amber"],
        canvas: "#0d0800", nodeHeader: "#2a1500", nodeBody: "#1a1000", groupColor: "#cc6600",
        font: "'VT323', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=VT323&display=swap",
        css: { "--bg-color": "#0d0800", "--fg-color": "#ffaa00", "--comfy-menu-bg": "#1a1000",
               "--comfy-menu-secondary-bg": "#140c00", "--comfy-input-bg": "#0d0800",
               "--border-color": "#77440055", "--content-bg": "#1a1000", "--content-fg": "#ffaa00",
               "--content-hover-bg": "#221800", "--input-text": "#ffcc44" },
    },

    arcade: {
        label: "Arcade", tags: ["multicolor", "retro", "gaming", "bright", "fun", "neon"],
        canvas: "#0a0010", nodeHeader: "#440022", nodeBody: "#1a0030", groupColor: "#ffcc00",
        font: "'Press Start 2P', 'Courier New', monospace",
        googleFont: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
        css: { "--bg-color": "#0a0010", "--fg-color": "#ffcc00", "--comfy-menu-bg": "#1a0030",
               "--comfy-menu-secondary-bg": "#14002a", "--comfy-input-bg": "#0a0010",
               "--border-color": "#cc005555", "--content-bg": "#1a0030", "--content-fg": "#ffcc00",
               "--content-hover-bg": "#220040", "--input-text": "#ff88aa" },
    },

    // ── Gemstones ─────────────────────────────────────────────────────────────

    amethyst: {
        label: "Amethyst", tags: ["purple", "dark", "gem", "elegant", "deep", "violet"],
        canvas: "#0e0514", nodeHeader: "#3a1260", nodeBody: "#1c0a2e", groupColor: "#8a44bb",
        font: "'Cinzel', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap",
        css: { "--bg-color": "#0e0514", "--fg-color": "#c49be4", "--comfy-menu-bg": "#1c0a2e",
               "--comfy-menu-secondary-bg": "#160822", "--comfy-input-bg": "#0e0514",
               "--border-color": "#5a228855", "--content-bg": "#1c0a2e", "--content-fg": "#c49be4",
               "--content-hover-bg": "#280e3a", "--input-text": "#dbbef0" },
    },

    sapphire: {
        label: "Sapphire", tags: ["blue", "dark", "gem", "deep", "elegant", "royal"],
        canvas: "#030818", nodeHeader: "#0e2260", nodeBody: "#08142e", groupColor: "#2255cc",
        font: "'Raleway', 'Segoe UI', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap",
        css: { "--bg-color": "#030818", "--fg-color": "#7a9eee", "--comfy-menu-bg": "#08142e",
               "--comfy-menu-secondary-bg": "#060e22", "--comfy-input-bg": "#030818",
               "--border-color": "#14288855", "--content-bg": "#08142e", "--content-fg": "#7a9eee",
               "--content-hover-bg": "#0c1a3a", "--input-text": "#aabbff" },
    },

    garnet: {
        label: "Garnet", tags: ["red", "dark", "gem", "deep", "crimson", "ruby"],
        canvas: "#0f0205", nodeHeader: "#4a0810", nodeBody: "#180610", groupColor: "#cc2244",
        font: "'Cinzel', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap",
        css: { "--bg-color": "#0f0205", "--fg-color": "#ff7799", "--comfy-menu-bg": "#1e0812",
               "--comfy-menu-secondary-bg": "#160610", "--comfy-input-bg": "#0f0208",
               "--border-color": "#cc224455", "--content-bg": "#330d1a", "--content-fg": "#ee4466",
               "--content-hover-bg": "#3d1222", "--input-text": "#ff7799" },
    },

    golden_age: {
        label: "Golden Age", tags: ["gold", "dark", "luxury", "warm", "elegant", "amber"],
        canvas: "#0e0a00", nodeHeader: "#3a2800", nodeBody: "#1e1600", groupColor: "#c8a000",
        font: "'Cinzel Decorative', serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap",
        css: { "--bg-color": "#0e0a00", "--fg-color": "#d4a800", "--comfy-menu-bg": "#1e1600",
               "--comfy-menu-secondary-bg": "#181200", "--comfy-input-bg": "#0e0a00",
               "--border-color": "#6a500055", "--content-bg": "#1e1600", "--content-fg": "#d4a800",
               "--content-hover-bg": "#2a1e00", "--input-text": "#f0cc44" },
    },

    // ── Moody / Dramatic ──────────────────────────────────────────────────────

    blood_moon: {
        label: "Blood Moon", tags: ["red", "dark", "dramatic", "horror", "deep", "crimson"],
        canvas: "#0a0000", nodeHeader: "#440000", nodeBody: "#1a0000", groupColor: "#cc0000",
        font: "'Cinzel', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap",
        css: { "--bg-color": "#0a0000", "--fg-color": "#dd4444", "--comfy-menu-bg": "#1a0000",
               "--comfy-menu-secondary-bg": "#140000", "--comfy-input-bg": "#0a0000",
               "--border-color": "#66000055", "--content-bg": "#1a0000", "--content-fg": "#dd4444",
               "--content-hover-bg": "#220000", "--input-text": "#ff6666" },
    },

    ember: {
        label: "Ember", tags: ["orange", "red", "dark", "fire", "warm", "glow"],
        canvas: "#100500", nodeHeader: "#441200", nodeBody: "#1e0804", groupColor: "#ff4a1a",
        font: "'Anton', Impact, sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
        css: { "--bg-color": "#180804", "--fg-color": "#ff8855", "--comfy-menu-bg": "#2a1008",
               "--comfy-menu-secondary-bg": "#1e0a06", "--comfy-input-bg": "#100500",
               "--border-color": "#ff4a1a55", "--content-bg": "#441808", "--content-fg": "#ff6633",
               "--content-hover-bg": "#552010", "--input-text": "#ff8855" },
    },

    rose_gold: {
        label: "Rose Gold", tags: ["pink", "gold", "elegant", "feminine", "luxury", "warm"],
        canvas: "#1a0f0f", nodeHeader: "#5a2a30", nodeBody: "#2e1a1a", groupColor: "#c4877a",
        font: "'Cormorant Garamond', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap",
        css: { "--bg-color": "#1a0f0f", "--fg-color": "#e8b4b8", "--comfy-menu-bg": "#2e1a1a",
               "--comfy-menu-secondary-bg": "#221414", "--comfy-input-bg": "#1a0f0f",
               "--border-color": "#8a4a5055", "--content-bg": "#2e1a1a", "--content-fg": "#e8b4b8",
               "--content-hover-bg": "#3a2222", "--input-text": "#f0cccc" },
    },

    midnight_sun: {
        label: "Midnight Sun", tags: ["orange", "purple", "sunset", "sky", "dramatic", "warm"],
        canvas: "#1a0a22", nodeHeader: "#3a1808", nodeBody: "#2e1040", groupColor: "#ff8c00",
        font: "'Cormorant Garamond', Georgia, serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap",
        css: { "--bg-color": "#1a0a22", "--fg-color": "#ffcc88", "--comfy-menu-bg": "#2e1040",
               "--comfy-menu-secondary-bg": "#220a30", "--comfy-input-bg": "#1a0a22",
               "--border-color": "#88442255", "--content-bg": "#2e1040", "--content-fg": "#ffcc88",
               "--content-hover-bg": "#3a1450", "--input-text": "#ffd8aa" },
    },

    lavender: {
        label: "Lavender", tags: ["purple", "dark", "soft", "calm", "pastel", "violet"],
        canvas: "#100d1a", nodeHeader: "#2a2045", nodeBody: "#1e1830", groupColor: "#9988cc",
        font: "'Raleway', 'Segoe UI', sans-serif",
        googleFont: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap",
        css: { "--bg-color": "#140f22", "--fg-color": "#ccbbff", "--comfy-menu-bg": "#1e1833",
               "--comfy-menu-secondary-bg": "#180f2a", "--comfy-input-bg": "#100d1a",
               "--border-color": "#9988cc44", "--content-bg": "#2a2240", "--content-fg": "#aa99dd",
               "--content-hover-bg": "#322855", "--input-text": "#ccbbff" },
    },

    cotton_candy: {
        label: "Cotton Candy", tags: ["pink", "blue", "light", "pastel", "soft", "cute", "sweet"],
        canvas: "#fff0f8", nodeHeader: "#cc6699", nodeBody: "#ffe0f5", groupColor: "#99ccff",
        font: "'Pacifico', cursive",
        googleFont: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
        css: { "--bg-color": "#fff0f8", "--fg-color": "#aa4488", "--comfy-menu-bg": "#ffe0f5",
               "--comfy-menu-secondary-bg": "#ffd0ee", "--comfy-input-bg": "#fff0f8",
               "--border-color": "#ffaadd", "--content-bg": "#ffe0f5", "--content-fg": "#aa4488",
               "--content-hover-bg": "#ffccee", "--input-text": "#882266" },
    },

};

// ─── Font palette ──────────────────────────────────────────────────────────────
const FONTS = [
    { id:"default",    label:"Arial (Default)",   stack:"Arial, sans-serif",               googleFont:null, sampleSz:"18px", themes:["Default"] },
    { id:"orbitron",   label:"Orbitron",           stack:"'Orbitron', sans-serif",          googleFont:"https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap",           sampleSz:"14px", themes:["Cyberpunk","Synthwave"] },
    { id:"space_mono", label:"Space Mono",         stack:"'Space Mono', monospace",         googleFont:"https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",          sampleSz:"13px", themes:["Matrix","Toxic"] },
    { id:"share_tech", label:"Share Tech Mono",    stack:"'Share Tech Mono', monospace",    googleFont:"https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",                  sampleSz:"13px", themes:["Tron","Neon Noir","Blade Runner"] },
    { id:"vt323",      label:"VT323",              stack:"'VT323', monospace",              googleFont:"https://fonts.googleapis.com/css2?family=VT323&display=swap",                            sampleSz:"22px", themes:["Vaporwave","CRT Amber"] },
    { id:"press2p",    label:"Press Start 2P",     stack:"'Press Start 2P', monospace",     googleFont:"https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",                   sampleSz:"9px",  themes:["Game Boy","Arcade"] },
    { id:"exo2",       label:"Exo 2",              stack:"'Exo 2', sans-serif",             googleFont:"https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap",               sampleSz:"18px", themes:["Deep Space","Aurora"] },
    { id:"lora",       label:"Lora",               stack:"'Lora', Georgia, serif",          googleFont:"https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",                sampleSz:"18px", themes:["Forest","Autumn"] },
    { id:"raleway",    label:"Raleway",            stack:"'Raleway', sans-serif",           googleFont:"https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap",              sampleSz:"18px", themes:["Ocean","Sapphire","Lavender"] },
    { id:"merriw",     label:"Merriweather",       stack:"'Merriweather', Georgia, serif",  googleFont:"https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",         sampleSz:"15px", themes:["Desert","Coffee"] },
    { id:"inter",      label:"Inter",              stack:"'Inter', sans-serif",             googleFont:"https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",                sampleSz:"18px", themes:["Arctic","Slate","Nord","Obsidian","Midnight"] },
    { id:"anton",      label:"Anton",              stack:"'Anton', Impact, sans-serif",     googleFont:"https://fonts.googleapis.com/css2?family=Anton&display=swap",                             sampleSz:"22px", themes:["Volcanic","Ember"] },
    { id:"cormorant",  label:"Cormorant Garamond", stack:"'Cormorant Garamond', serif",     googleFont:"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap",  sampleSz:"18px", themes:["Jade","Rose Gold","Midnight Sun"] },
    { id:"firacode",   label:"Fira Code",          stack:"'Fira Code', monospace",          googleFont:"https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap",            sampleSz:"14px", themes:["Dracula","Monokai","Solarized Dark"] },
    { id:"playfair",   label:"Playfair Display",   stack:"'Playfair Display', serif",       googleFont:"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",     sampleSz:"18px", themes:["Newspaper","Retro"] },
    { id:"imfell",     label:"IM Fell English",    stack:"'IM Fell English', serif",        googleFont:"https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap",          sampleSz:"18px", themes:["Steampunk","Cherry Blossom"] },
    { id:"cinzel",     label:"Cinzel",             stack:"'Cinzel', serif",                 googleFont:"https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap",               sampleSz:"15px", themes:["Dungeon","Amethyst","Garnet","Golden Age","Blood Moon"] },
    { id:"pacifico",   label:"Pacifico",           stack:"'Pacifico', cursive",             googleFont:"https://fonts.googleapis.com/css2?family=Pacifico&display=swap",                          sampleSz:"16px", themes:["Cotton Candy"] },
    // ── More sci-fi / electronic ──────────────────────────────────────────────
    { id:"audiowide",  label:"Audiowide",          stack:"'Audiowide', sans-serif",         googleFont:"https://fonts.googleapis.com/css2?family=Audiowide&display=swap",                            sampleSz:"14px", themes:["Midnight","Synthwave","Deep Space"] },
    { id:"oxanium",    label:"Oxanium",            stack:"'Oxanium', sans-serif",            googleFont:"https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap",                 sampleSz:"15px", themes:["Cyberpunk","Neon Noir","Tron"] },
    { id:"syncopate",  label:"Syncopate",          stack:"'Syncopate', sans-serif",          googleFont:"https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap",               sampleSz:"11px", themes:["Deep Space","Arctic","Blade Runner"] },
    { id:"chakra",     label:"Chakra Petch",       stack:"'Chakra Petch', sans-serif",       googleFont:"https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;700&display=swap",            sampleSz:"15px", themes:["Aurora","Cyberpunk","Toxic"] },
    // ── More coding / dark dev ────────────────────────────────────────────────
    { id:"jetbrains",  label:"JetBrains Mono",     stack:"'JetBrains Mono', monospace",     googleFont:"https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap",          sampleSz:"13px", themes:["Nord","Obsidian","Dracula","Monokai"] },
    // ── More bold / display ───────────────────────────────────────────────────
    { id:"bebas",      label:"Bebas Neue",         stack:"'Bebas Neue', sans-serif",         googleFont:"https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",                           sampleSz:"22px", themes:["Volcanic","Ember","Blood Moon"] },
    { id:"righteous",  label:"Righteous",          stack:"'Righteous', sans-serif",          googleFont:"https://fonts.googleapis.com/css2?family=Righteous&display=swap",                            sampleSz:"18px", themes:["Retro","Vaporwave","Cotton Candy"] },
    // ── More typewriter / editorial ───────────────────────────────────────────
    { id:"special",    label:"Special Elite",      stack:"'Special Elite', cursive",         googleFont:"https://fonts.googleapis.com/css2?family=Special+Elite&display=swap",                        sampleSz:"16px", themes:["Newspaper","Steampunk","Blade Runner"] },
    // ── More fantasy / ornate ─────────────────────────────────────────────────
    { id:"cinzeldeco", label:"Cinzel Decorative",  stack:"'Cinzel Decorative', serif",       googleFont:"https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap",       sampleSz:"13px", themes:["Golden Age","Dungeon","Amethyst"] },
    { id:"uncial",     label:"Uncial Antiqua",     stack:"'Uncial Antiqua', cursive",        googleFont:"https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap",                       sampleSz:"16px", themes:["Dungeon","Blood Moon","Steampunk"] },
    // ── More minimal / geometric ──────────────────────────────────────────────
    { id:"josefin",    label:"Josefin Sans",       stack:"'Josefin Sans', sans-serif",       googleFont:"https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap",            sampleSz:"18px", themes:["Arctic","Slate","Nord"] },
];

// ─── State ─────────────────────────────────────────────────────────────────────

let themeStyleEl       = null;
let floatingBtn        = null;
let _canvasFontPatched = false;
let _customFont        = null;   // font stack override independent of active theme

// ─── Canvas font helpers ───────────────────────────────────────────────────────

const DEFAULT_TITLE_FONT = "bold 14px Arial";
const DEFAULT_INNER_FONT = "normal 12px Arial";

function setCanvasFont(fontStack) {
    const primary = (fontStack || "Arial").split(",")[0].replace(/['"]/g, "").trim();
    try { app.canvas.title_text_font = `bold 14px '${primary}'`; } catch (_) {}
    try { app.canvas.inner_text_font = `normal 12px '${primary}'`; } catch (_) {}
    try { app.canvas.setDirty(true, true); } catch (_) {}
    try { app.graph.setDirtyCanvas(true, true); } catch (_) {}
}

// Patch the LiteGraph canvas 2D context's font setter so every ctx.font assignment
// (nodes, groups, links) prepends our custom font family.
// Uses a passthrough property instead of delete to avoid canvas context corruption.
function patchCanvasFont(fontStack) {
    try {
        const ctx = app?.canvas?.ctx
            || app?.canvas?.canvas?.getContext?.("2d");
        if (!ctx) return;

        const fontDesc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "font");
        if (!fontDesc?.set) return;

        if (!fontStack) {
            // Replace with a pass-through — never delete the own property
            Object.defineProperty(ctx, "font", {
                configurable: true,
                get() { return fontDesc.get.call(this); },
                set(v) { fontDesc.set.call(this, v); },
            });
            _canvasFontPatched = false;
            return;
        }

        const primary = fontStack.split(",")[0].replace(/['"]/g, "").trim();
        const fontCache = new Map();
        Object.defineProperty(ctx, "font", {
            configurable: true,
            get() { return fontDesc.get.call(this); },
            set(v) {
                let mapped = fontCache.get(v);
                if (mapped === undefined) {
                    mapped = v.replace(/(\d+(?:\.\d+)?px\s+)(.+)$/, `$1'${primary}', $2`);
                    fontCache.set(v, mapped);
                }
                fontDesc.set.call(this, mapped);
            },
        });
        _canvasFontPatched = true;
        try { app.graph?.setDirtyCanvas(true, true); } catch (_) {}
    } catch (_) {}
}

// ─── Apply / Reset ─────────────────────────────────────────────────────────────

function applyTheme(id, applyToNodes = false) {
    const theme = THEMES[id];
    if (!theme) return;

    const font = _customFont || theme.font || "system-ui, sans-serif";
    const gfUrl = _customFont
        ? (FONTS.find(f => f.stack === _customFont)?.googleFont || null)
        : theme.googleFont;

    // 1. CSS variable + font injection
    if (!themeStyleEl) {
        themeStyleEl = document.createElement("style");
        themeStyleEl.id = "enigmatic-theme-vars";
        document.head.appendChild(themeStyleEl);
    }
    const importLine = gfUrl ? `@import url('${gfUrl}');` : "";
    const vars = Object.entries(theme.css).map(([k, v]) => `${k}:${v}`).join(";");
    themeStyleEl.textContent =
        `${importLine}` +
        `:root{${vars};--enigmatic-font:${font};}` +
        `.comfy-menu,.comfy-modal,.p-dialog,.litecontextmenu,` +
        `.litegraph,.graph-canvas-container` +
        `{font-family:${font} !important;}`;

    // 2. Canvas node font (title + inner text via LiteGraph properties — no ctx intercept)
    setCanvasFont(font);

    // 3. Ensure Google Font downloads and prewarm glyph cache so tab-switch renders are fast
    if (gfUrl) {
        if (!document.querySelector(`link[href="${gfUrl}"]`)) {
            const lnk = document.createElement("link");
            lnk.rel = "stylesheet"; lnk.href = gfUrl;
            document.head.appendChild(lnk);
        }
        const _fn = font.split(",")[0].replace(/['"]/g, "").trim();
        setTimeout(() => {
            document.fonts.load(`14px '${_fn}'`).then(() => {
                prewarmFontGlyphs(font);
                try { app.graph?.setDirtyCanvas(true, true); } catch (_) {}
            }).catch(() => {});
        }, 80);
    }

    // 4. Apply node/group colors
    if (applyToNodes) {
        const _hdr = theme.nodeHeader, _bdy = theme.nodeBody, _grp = theme.groupColor;
        requestAnimationFrame(() => {
            try {
                (app.graph._nodes  || []).forEach(n => { n.color = _hdr; n.bgcolor = _bdy; });
                (app.graph._groups || []).forEach(g => { g.color = _grp; });
                app.graph.setDirtyCanvas(true, true);
            } catch (_) {}
        });
    } else {
        try { app.graph.setDirtyCanvas(true, true); } catch (_) {}
    }

    // 6. Update button label — show active theme name on second line
    if (floatingBtn) {
        floatingBtn.innerHTML =
            `🎨 Theme<br><span style="font-size:10px;opacity:.7;display:block;margin-top:1px">${theme.label}</span>`;
    }

    // 7. Persist
    localStorage.setItem("enigmatic-theme", id);
}

function resetTheme() {
    // Remove injected CSS
    if (themeStyleEl) { themeStyleEl.remove(); themeStyleEl = null; }
    // Clear custom font override
    _customFont = null;
    localStorage.removeItem("enigmatic-custom-font");
    // Restore LiteGraph canvas fonts to default Arial
    try { app.canvas.title_text_font = DEFAULT_TITLE_FONT; } catch (_) {}
    try { app.canvas.inner_text_font = DEFAULT_INNER_FONT; } catch (_) {}
    // Reset all node/group colors — null is safer than delete for reactive objects
    try {
        (app.graph._nodes  || []).forEach(n => { n.color = null; n.bgcolor = null; });
        (app.graph._groups || []).forEach(g => { g.color = null; });
        app.graph.setDirtyCanvas(true, true);
    } catch (_) {}
    try { app.canvas.setDirty(true, true); } catch (_) {}
    if (floatingBtn) floatingBtn.textContent = "🎨 Theme";
    localStorage.removeItem("enigmatic-theme");
}


function applyFont(fontId) {
    const fentry = FONTS.find(f => f.id === fontId);
    if (!fentry) return;

    if (fentry.id === "default") {
        _customFont = null;
        localStorage.removeItem("enigmatic-custom-font");
    } else {
        _customFont = fentry.stack;
        localStorage.setItem("enigmatic-custom-font", fentry.stack);
    }

    // Preload Google Font if needed
    if (fentry.googleFont && !document.querySelector(`link[href="${fentry.googleFont}"]`)) {
        const lnk = document.createElement("link");
        lnk.rel = "stylesheet";
        lnk.href = fentry.googleFont;
        document.head.appendChild(lnk);
    }

    // Re-apply active theme CSS (which now picks up _customFont)
    const activeId = localStorage.getItem("enigmatic-theme");
    if (activeId && THEMES[activeId]) {
        applyTheme(activeId, false);
    } else if (_customFont) {
        // No active theme — inject font-only CSS + patch canvas
        if (!themeStyleEl) {
            themeStyleEl = document.createElement("style");
            themeStyleEl.id = "enigmatic-theme-vars";
            document.head.appendChild(themeStyleEl);
        }
        const imp = fentry.googleFont ? `@import url('${fentry.googleFont}');` : "";
        themeStyleEl.textContent = `${imp}` +
            `.comfy-menu,.comfy-modal,.p-dialog,.litecontextmenu,` +
            `.litegraph,.graph-canvas-container` +
            `{font-family:${_customFont} !important;}`;
        setCanvasFont(_customFont);
        if (fentry.googleFont) {
            const _fn = _customFont.split(",")[0].replace(/['"]/g, "").trim();
            setTimeout(() => {
                document.fonts.load(`14px '${_fn}'`).then(() => {
                    prewarmFontGlyphs(_customFont);
                    try { app.graph?.setDirtyCanvas(true, true); } catch (_) {}
                }).catch(() => {});
            }, 80);
        }
    } else {
        // Reset to Arial
        setCanvasFont("Arial");
    }
}

// Pre-render common characters on an offscreen canvas to warm the browser's glyph
// cache for the custom font. Once warmed, tab-switch renders hit the cache instead
// of rasterizing each glyph cold, which eliminates the first-switch lag.
function prewarmFontGlyphs(font) {
    try {
        const primary = font.split(",")[0].replace(/['"]/g, "").trim();
        const tmp = document.createElement("canvas");
        tmp.width = 1200; tmp.height = 1;
        const ctx = tmp.getContext("2d");
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:-_/()[]{}!?'\"";
        for (const size of ["bold 14px", "normal 12px", "bold 10px"]) {
            ctx.font = `${size} '${primary}'`;
            ctx.fillText(chars, 0, 0);
        }
    } catch (_) {}
}

// ─── Fuzzy search ──────────────────────────────────────────────────────────────

function fuzzyMatch(pattern, text) {
    let pi = 0;
    for (let ti = 0; ti < text.length && pi < pattern.length; ti++) {
        if (text[ti] === pattern[pi]) pi++;
    }
    return pi === pattern.length;
}

// ─── Dialog styles (injected once) ────────────────────────────────────────────

let dialogStylesInjected = false;

function ensureDialogStyles() {
    if (dialogStylesInjected) return;
    dialogStylesInjected = true;
    const s = document.createElement("style");
    s.id = "enigmatic-theme-dialog-styles";
    s.textContent = `
#enigmatic-theme-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);
z-index:100000;display:flex;align-items:center;justify-content:center;}
#enigmatic-theme-dialog{background:#16162a;color:#ddd;border:1px solid #3a3a5a;
border-radius:12px;width:min(880px,96vw);max-height:88vh;overflow:hidden;
display:flex;flex-direction:column;box-shadow:0 12px 48px rgba(0,0,0,.85);
font-family:sans-serif !important;}
.etd-header{padding:14px 18px;border-bottom:1px solid #2a2a4a;
display:flex;justify-content:space-between;align-items:center;}
.etd-title{font-size:15px;font-weight:600;color:#fff;}
.etd-close{background:transparent;border:none;color:#666;font-size:22px;
cursor:pointer;padding:0 4px;line-height:1;transition:color .12s;}
.etd-close:hover{color:#fff;}
.etd-toolbar{padding:10px 14px;border-bottom:1px solid #222240;
display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
#enigmatic-theme-search{flex:1;min-width:160px;padding:7px 12px;
background:#1e1e38;color:#ddd;border:1px solid #3a3a5a;
border-radius:20px;font-size:13px;outline:none;transition:border-color .12s;}
#enigmatic-theme-search:focus{border-color:#6060cc;}
.etd-reset{padding:6px 14px;background:transparent;border:1px solid #444;
color:#999;border-radius:20px;cursor:pointer;font-size:12px;white-space:nowrap;
transition:border-color .12s,color .12s;}
.etd-reset:hover{border-color:#888;color:#fff;}
.etd-hint{font-size:11px;color:#666;white-space:nowrap;user-select:none;}
#enigmatic-theme-grid{display:grid;grid-template-columns:repeat(4,1fr);
gap:10px;padding:14px;overflow-y:auto;flex:1;}
.etd-card{border:2px solid #2a2a4a;border-radius:9px;cursor:pointer;
overflow:hidden;transition:border-color .15s,transform .12s,box-shadow .15s;}
.etd-card:hover{border-color:#6060cc;transform:scale(1.035);
box-shadow:0 4px 18px rgba(60,60,200,.3);}
.etd-card.active{border-color:#ffffff;box-shadow:0 0 12px rgba(255,255,255,.2);}
.etd-preview{height:72px;display:flex;}
.etd-sidebar{width:24px;flex-shrink:0;}
.etd-canvas-area{flex:1;position:relative;overflow:hidden;}
.etd-fake-node{position:absolute;top:11px;left:10px;width:64px;
border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.5);}
.etd-fake-hdr{height:14px;}
.etd-fake-body{height:24px;}
.etd-label{padding:7px 6px;font-size:12px;text-align:center;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700;
background:#0d0d18 !important;color:#e8e8f0 !important;
border-top:1px solid rgba(255,255,255,.12);letter-spacing:.02em;}
.etd-empty{grid-column:1/-1;text-align:center;padding:40px;
color:#555;font-size:13px;}
@media(max-width:620px){#enigmatic-theme-grid{grid-template-columns:repeat(2,1fr);}}
.etd-tabbar{display:flex;gap:0;padding:8px 14px 0;border-bottom:1px solid #1e1e38;}
.etd-tab{padding:7px 18px;background:transparent;border:1px solid #2a2a4a;
border-bottom:none;color:#666;border-radius:8px 8px 0 0;cursor:pointer;
font-size:12px;font-family:sans-serif !important;transition:color .12s,border-color .12s;
margin-right:4px;}
.etd-tab:hover{color:#ccc;border-color:#4a4a6a;}
.etd-tab.active{background:#16162a;color:#fff;border-color:#5050aa;}
.etd-font-card{border:2px solid #2a2a4a;border-radius:9px;cursor:pointer;overflow:hidden;
transition:border-color .15s,transform .12s,box-shadow .15s;}
.etd-font-card:hover{border-color:#6060cc;transform:scale(1.035);
box-shadow:0 4px 18px rgba(60,60,200,.3);}
.etd-font-card.active{border-color:#fff;box-shadow:0 0 12px rgba(255,255,255,.2);}
.etd-font-name{padding:6px 8px 3px;background:#16162a;}
.etd-font-sample{padding:8px;min-height:52px;display:flex;align-items:center;
justify-content:center;background:#0d0d18;color:#e8e8f0;}
.etd-font-used{padding:3px 8px 6px;background:#0d0d18;
border-top:1px solid rgba(255,255,255,.07);}
    `;
    document.head.appendChild(s);
}

// ─── Card builder ──────────────────────────────────────────────────────────────

function buildCard(id, theme) {
    const card = document.createElement("div");
    card.className = "etd-card";
    card.dataset.id = id;

    const preview = document.createElement("div");
    preview.className = "etd-preview";

    const sidebar = document.createElement("div");
    sidebar.className = "etd-sidebar";
    sidebar.style.background = theme.css["--comfy-menu-bg"];

    const canvasArea = document.createElement("div");
    canvasArea.className = "etd-canvas-area";
    canvasArea.style.background = theme.canvas;

    const fakeNode = document.createElement("div");
    fakeNode.className = "etd-fake-node";

    const fakeHdr = document.createElement("div");
    fakeHdr.className = "etd-fake-hdr";
    fakeHdr.style.background = theme.nodeHeader;

    const fakeBody = document.createElement("div");
    fakeBody.className = "etd-fake-body";
    fakeBody.style.background = theme.nodeBody;

    fakeNode.append(fakeHdr, fakeBody);
    canvasArea.appendChild(fakeNode);
    preview.append(sidebar, canvasArea);

    const label = document.createElement("div");
    label.className = "etd-label";
    label.textContent = theme.label;
    // Force readable label regardless of any active theme's font/color overrides
    label.style.setProperty("background-color", "#0d0d18", "important");
    label.style.setProperty("color", "#e8e8f0", "important");
    label.style.setProperty("font-family", "sans-serif", "important");
    label.style.setProperty("font-size", "12px", "important");
    // preload the Google Font when the card is rendered so it's ready before clicking
    if (theme.googleFont) {
        const existing = document.querySelector(`link[data-enigmatic="${id}"]`);
        if (!existing) {
            const lnk = document.createElement("link");
            lnk.rel = "stylesheet";
            lnk.href = theme.googleFont;
            lnk.dataset.enigmatic = id;
            document.head.appendChild(lnk);
        }
    }

    card.append(preview, label);

    function activate(applyToNodes) {
        applyTheme(id, applyToNodes);
        document.querySelectorAll(".etd-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
    }

    card.addEventListener("click", () => activate(true));

    return card;
}

// ─── Font card builder ─────────────────────────────────────────────────────────

function buildFontCard(font) {
    const card = document.createElement("div");
    card.className = "etd-font-card";
    card.dataset.fontId = font.id;

    const nameEl = document.createElement("div");
    nameEl.className = "etd-font-name";
    nameEl.textContent = font.label;
    nameEl.style.setProperty("font-family", "sans-serif", "important");
    nameEl.style.setProperty("font-size", "11px", "important");
    nameEl.style.setProperty("color", "#aaa", "important");
    nameEl.style.setProperty("font-weight", "600", "important");

    const sampleEl = document.createElement("div");
    sampleEl.className = "etd-font-sample";
    sampleEl.textContent = "Aa Bb 123";
    sampleEl.style.fontFamily = font.stack;
    sampleEl.style.setProperty("font-size", font.sampleSz, "important");
    sampleEl.style.setProperty("color", "#e8e8f0", "important");

    const usedEl = document.createElement("div");
    usedEl.className = "etd-font-used";
    usedEl.textContent = font.themes.join(" · ");
    usedEl.style.setProperty("font-family", "sans-serif", "important");
    usedEl.style.setProperty("font-size", "10px", "important");
    usedEl.style.setProperty("color", "#666", "important");

    card.append(nameEl, sampleEl, usedEl);

    // Preload Google Font
    if (font.googleFont && !document.querySelector(`link[href="${font.googleFont}"]`)) {
        const lnk = document.createElement("link");
        lnk.rel = "stylesheet";
        lnk.href = font.googleFont;
        document.head.appendChild(lnk);
    }

    card.addEventListener("click", () => {
        applyFont(font.id);
        document.querySelectorAll(".etd-font-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
    });

    return card;
}

// ─── Gallery dialog ────────────────────────────────────────────────────────────

function openThemeGallery() {
    const existing = document.getElementById("enigmatic-theme-overlay");
    if (existing) { existing.remove(); return; }

    ensureDialogStyles();

    const overlay = document.createElement("div");
    overlay.id = "enigmatic-theme-overlay";
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

    const dialog = document.createElement("div");
    dialog.id = "enigmatic-theme-dialog";
    dialog.addEventListener("click", e => e.stopPropagation());

    // Header
    const header = document.createElement("div");
    header.className = "etd-header";
    const title = document.createElement("span");
    title.className = "etd-title";
    title.textContent = "🎨 Theme Engine";
    const closeBtn = document.createElement("button");
    closeBtn.className = "etd-close";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = () => overlay.remove();
    header.append(title, closeBtn);

    // Tab bar
    const tabBar = document.createElement("div");
    tabBar.className = "etd-tabbar";
    const themesTab = document.createElement("button");
    themesTab.className = "etd-tab active";
    themesTab.textContent = "🎨 Themes";
    const fontsTab = document.createElement("button");
    fontsTab.className = "etd-tab";
    fontsTab.textContent = "✏️ Fonts";
    tabBar.append(themesTab, fontsTab);

    // Toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "etd-toolbar";
    const search = document.createElement("input");
    search.id = "enigmatic-theme-search";
    search.type = "text";
    const hint = document.createElement("span");
    hint.className = "etd-hint";
    const resetBtn = document.createElement("button");
    resetBtn.className = "etd-reset";
    resetBtn.textContent = "↺ Reset to Default";
    resetBtn.onclick = () => { resetTheme(); overlay.remove(); };
    toolbar.append(search, hint, resetBtn);

    // Grid
    const grid = document.createElement("div");
    grid.id = "enigmatic-theme-grid";

    let activeTab = "themes";

    function showTab(tab) {
        activeTab = tab;
        themesTab.classList.toggle("active", tab === "themes");
        fontsTab.classList.toggle("active", tab === "fonts");
        if (tab === "themes") {
            hint.textContent = "Click to apply theme (colors + fonts)";
            search.placeholder = "Search… try 'dark', 'neon', 'serif', 'pink'…";
        } else {
            hint.textContent = "Click a font to override the active theme's font";
            search.placeholder = "Search fonts by name or theme…";
        }
        grid.innerHTML = "";
        search.value = "";
        if (tab === "themes") {
            const savedId = localStorage.getItem("enigmatic-theme");
            Object.entries(THEMES).forEach(([id, theme]) => {
                const card = buildCard(id, theme);
                if (id === savedId) card.classList.add("active");
                grid.appendChild(card);
            });
        } else {
            const savedStack = localStorage.getItem("enigmatic-custom-font");
            FONTS.forEach(f => {
                const card = buildFontCard(f);
                if (savedStack ? f.stack === savedStack : f.id === "default") {
                    card.classList.add("active");
                }
                grid.appendChild(card);
            });
        }
    }

    themesTab.onclick = () => showTab("themes");
    fontsTab.onclick = () => showTab("fonts");
    search.addEventListener("input", () => filterCards(search.value, activeTab));

    dialog.append(header, tabBar, toolbar, grid);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    showTab("themes");
    setTimeout(() => search.focus(), 60);
}

function filterCards(query, tab = "themes") {
    const q = query.toLowerCase().trim();
    const grid = document.getElementById("enigmatic-theme-grid");
    if (!grid) return;

    let anyVisible = false;

    if (tab === "themes") {
        grid.querySelectorAll(".etd-card[data-id]").forEach(card => {
            const theme = THEMES[card.dataset.id];
            if (!theme) return;
            if (!q) { card.style.display = ""; anyVisible = true; return; }
            const corpus = [theme.label, ...theme.tags, theme.font].join(" ").toLowerCase();
            const visible = corpus.includes(q) || fuzzyMatch(q, corpus);
            card.style.display = visible ? "" : "none";
            if (visible) anyVisible = true;
        });
    } else {
        grid.querySelectorAll(".etd-font-card").forEach(card => {
            const font = FONTS.find(f => f.id === card.dataset.fontId);
            if (!font) return;
            if (!q) { card.style.display = ""; anyVisible = true; return; }
            const corpus = [font.label, ...font.themes].join(" ").toLowerCase();
            const visible = corpus.includes(q) || fuzzyMatch(q, corpus);
            card.style.display = visible ? "" : "none";
            if (visible) anyVisible = true;
        });
    }

    let emptyEl = grid.querySelector(".etd-empty");
    if (!anyVisible) {
        if (!emptyEl) {
            emptyEl = document.createElement("div");
            emptyEl.className = "etd-empty";
            emptyEl.textContent = tab === "themes"
                ? "No themes match — try a color, mood, or font style"
                : "No fonts match — try a font name or theme name";
            grid.appendChild(emptyEl);
        }
    } else {
        emptyEl?.remove();
    }
}

// ─── Floating button (draggable) ──────────────────────────────────────────────

function buildFloatingButton() {
    floatingBtn = document.createElement("button");
    floatingBtn.id = "enigmatic-theme-btn";

    Object.assign(floatingBtn.style, {
        position: "fixed", zIndex: "9000",
        background: "#16162a", color: "#ccc", border: "1px solid #3a3a5a",
        borderRadius: "20px", padding: "6px 16px", cursor: "grab",
        fontSize: "12px", fontFamily: "sans-serif", userSelect: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,.65)", whiteSpace: "nowrap",
        lineHeight: "1.4", textAlign: "center",
        transition: "background .12s, color .12s",
    });
    floatingBtn.textContent = "🎨 Theme";

    // Restore saved position or default to bottom-right
    const savedPos = JSON.parse(localStorage.getItem("enigmatic-btn-pos") || "null");
    if (savedPos) {
        floatingBtn.style.left = savedPos.x + "px";
        floatingBtn.style.top  = savedPos.y + "px";
    } else {
        floatingBtn.style.bottom = "70px";
        floatingBtn.style.right  = "16px";
    }

    // Drag state
    let drag = null;

    floatingBtn.addEventListener("mousedown", e => {
        if (e.button !== 0) return;
        // Convert bottom/right to top/left so we can drag freely
        if (!floatingBtn.style.top || floatingBtn.style.top === "auto") {
            const r = floatingBtn.getBoundingClientRect();
            floatingBtn.style.top    = r.top + "px";
            floatingBtn.style.left   = r.left + "px";
            floatingBtn.style.bottom = "auto";
            floatingBtn.style.right  = "auto";
        }
        drag = {
            startX: e.clientX, startY: e.clientY,
            origX: parseFloat(floatingBtn.style.left),
            origY: parseFloat(floatingBtn.style.top),
            moved: false,
        };
        floatingBtn.style.cursor = "grabbing";
        floatingBtn.style.transition = "none";
        e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
        if (!drag) return;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;
        if (!drag.moved) return;
        const bw = floatingBtn.offsetWidth, bh = floatingBtn.offsetHeight;
        const nx = Math.max(0, Math.min(window.innerWidth  - bw, drag.origX + dx));
        const ny = Math.max(0, Math.min(window.innerHeight - bh, drag.origY + dy));
        floatingBtn.style.left = nx + "px";
        floatingBtn.style.top  = ny + "px";
    });

    document.addEventListener("mouseup", () => {
        if (!drag) return;
        floatingBtn.style.cursor = "grab";
        floatingBtn.style.transition = "background .12s, color .12s";
        if (drag.moved) {
            localStorage.setItem("enigmatic-btn-pos", JSON.stringify({
                x: parseFloat(floatingBtn.style.left),
                y: parseFloat(floatingBtn.style.top),
            }));
        } else {
            openThemeGallery();
        }
        drag = null;
    });

    floatingBtn.addEventListener("mouseenter", () => {
        if (!drag) { floatingBtn.style.background = "#2d2d4a"; floatingBtn.style.color = "#fff"; }
    });
    floatingBtn.addEventListener("mouseleave", () => {
        floatingBtn.style.background = "#16162a"; floatingBtn.style.color = "#ccc";
    });

    document.body.appendChild(floatingBtn);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

buildFloatingButton();

// Restore CSS/canvas-bg immediately; defer canvas font + group patch until LiteGraph is ready
const savedTheme = localStorage.getItem("enigmatic-theme");
if (savedTheme && THEMES[savedTheme]) {
    applyTheme(savedTheme, false);
}

setTimeout(() => {
    // Re-apply canvas font with LiteGraph now available (no ctx intercept needed)
    const activeId = localStorage.getItem("enigmatic-theme");
    const savedFontStack = localStorage.getItem("enigmatic-custom-font");
    if (savedFontStack) _customFont = savedFontStack;
    if (activeId && THEMES[activeId]) {
        const activeFont = _customFont || THEMES[activeId].font;
        setCanvasFont(activeFont);
        try { app.graph.setDirtyCanvas(true, true); } catch (_) {}
        // Prewarm glyph cache so first tab-switch is fast
        const gfUrl = _customFont
            ? (FONTS.find(f => f.stack === _customFont)?.googleFont || null)
            : THEMES[activeId].googleFont;
        if (gfUrl) {
            const _fn = activeFont.split(",")[0].replace(/['"]/g, "").trim();
            document.fonts.load(`14px '${_fn}'`).then(() => {
                prewarmFontGlyphs(activeFont);
                try { app.graph?.setDirtyCanvas(true, true); } catch (_) {}
            }).catch(() => {});
        } else {
            prewarmFontGlyphs(activeFont);
        }
    } else if (_customFont) {
        setCanvasFont(_customFont);
        prewarmFontGlyphs(_customFont);
    }
}, 500);

    }, // end setup
}); // end registerExtension
