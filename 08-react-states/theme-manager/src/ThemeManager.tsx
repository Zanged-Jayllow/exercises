import { createContext, useContext, useMemo, useReducer, memo } from "react";

// Type Declaration //

type Mode = "light" | "dark";
type Accent = "red" | "orange" | "amber" | "lime" | "emerald" | "cyan" | "indigo" | "violet" | "rose";
type Radius = "none" | "sm" | "md" | "lg" | "full";
type FontStyle = "regular" | "bold" | "italic";
type Alignment = "left" | "center" | "right";
type DarkColoring = "default" | "dynamic";

interface ThemeState {
  mode: Mode;
  accent: Accent;
  radius: Radius;
  fontSize: number;
  fontStyle: FontStyle;
  alignment: Alignment;
  darkColoring: DarkColoring;
}

type ThemeAction =
  | { type: "SET_MODE"; payload: Mode }
  | { type: "SET_ACCENT"; payload: Accent }
  | { type: "SET_RADIUS"; payload: Radius }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "SET_FONT_STYLE"; payload: FontStyle }
  | { type: "SET_ALIGNMENT"; payload: Alignment }
  | { type: "SET_DARK_COLORING"; payload: DarkColoring }
  | { type: "RESET" };

interface ThemeDispatch {
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setRadius: (r: Radius) => void;
  setFontSize: (s: number) => void;
  setFontStyle: (f: FontStyle) => void;
  setAlignment: (a: Alignment) => void;
  setDarkColoring: (a: DarkColoring) => void;
  reset: () => void;
}

// Default & Initial Theme //

const DEFAULT: ThemeState = { mode: "light", accent: "indigo", radius: "md", fontSize: 16, fontStyle: "regular", alignment: "left", darkColoring: "default" };

// Contexts //

const ThemeReadContext = createContext<ThemeState>(DEFAULT);
const ThemeDispatchContext = createContext<ThemeDispatch>({} as ThemeDispatch);

// Reducer //

function reducer(s: ThemeState, a: ThemeAction): ThemeState {
  switch (a.type) {
    case "SET_MODE":       return { ...s, mode: a.payload };
    case "SET_ACCENT":     return { ...s, accent: a.payload };
    case "SET_RADIUS":     return { ...s, radius: a.payload };
    case "SET_FONT_SIZE":  return { ...s, fontSize: a.payload };
    case "SET_FONT_STYLE": return { ...s, fontStyle: a.payload };
    case "SET_ALIGNMENT":   return { ...s, alignment: a.payload };
    case "SET_DARK_COLORING": return { ...s, darkColoring: a.payload };
    case "RESET":           return DEFAULT;
    default:               return s;
  }
}

// Provider //

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT);

  const actions = useMemo<ThemeDispatch>(() => ({
    setMode:      (p) => dispatch({ type: "SET_MODE",       payload: p }),
    setAccent:    (p) => dispatch({ type: "SET_ACCENT",     payload: p }),
    setRadius:    (p) => dispatch({ type: "SET_RADIUS",     payload: p }),
    setFontSize:  (p) => dispatch({ type: "SET_FONT_SIZE",  payload: p }),
    setFontStyle: (p) => dispatch({ type: "SET_FONT_STYLE", payload: p }),
    setAlignment:    (p) => dispatch({ type: "SET_ALIGNMENT",    payload: p }),
    setDarkColoring: (p) => dispatch({ type: "SET_DARK_COLORING", payload: p }),
    reset:           ()  => dispatch({ type: "RESET" }),
  }), [dispatch]);

  return (
    <ThemeDispatchContext.Provider value={actions}>
      <ThemeReadContext.Provider value={state}>
        {children}
      </ThemeReadContext.Provider>
    </ThemeDispatchContext.Provider>
  );
}

// Hooks //

const useTheme = () => useContext(ThemeReadContext);
function useThemeSelector<T>(selector: (s: ThemeState) => T): T {
  return selector(useContext(ThemeReadContext));
}
const useThemeDispatch = () => useContext(ThemeDispatchContext);

// Theme Palettes //

// Ordered warm -> cool on the spectrum
const ACCENTS: Record<Accent, { bg: string; ring: string; text: string; label: string }> = {
  red:     { bg: "#ef4444", ring: "#f87171", text: "#fff", label: "Red"     },
  orange:  { bg: "#f97316", ring: "#fb923c", text: "#fff", label: "Orange"  },
  amber:   { bg: "#f59e0b", ring: "#fcd34d", text: "#fff", label: "Amber"   },
  lime:    { bg: "#84cc16", ring: "#a3e635", text: "#fff", label: "Lime"    },
  emerald: { bg: "#10b981", ring: "#34d399", text: "#fff", label: "Emerald" },
  cyan:    { bg: "#06b6d4", ring: "#22d3ee", text: "#fff", label: "Cyan"    },
  indigo:  { bg: "#6366f1", ring: "#818cf8", text: "#fff", label: "Indigo"  },
  violet:  { bg: "#8b5cf6", ring: "#a78bfa", text: "#fff", label: "Violet"  },
  rose:    { bg: "#f43f5e", ring: "#fb7185", text: "#fff", label: "Rose"    },
};

const RADII: Record<Radius, { px: string; label: string }> = {
  none: { px: "0px",    label: "None"   },
  sm:   { px: "4px",    label: "Small"  },
  md:   { px: "8px",    label: "Medium" },
  lg:   { px: "16px",   label: "Large"  },
  full: { px: "9999px", label: "Full"   },
};

const FONT_STYLES: Record<FontStyle, { fontWeight: string; fontStyle: string; label: string }> = {
  regular: { fontWeight: "400", fontStyle: "normal", label: "Regular" },
  bold:    { fontWeight: "700", fontStyle: "normal", label: "Bold"    },
  italic:  { fontWeight: "400", fontStyle: "italic", label: "Italic"  },
};

// Demo Components //

let modeRenders = 0, accentRenders = 0, radiusRenders = 0, fontRenders = 0,
    fontStyleRenders = 0, alignmentRenders = 0, darkColoringRenders = 0, dispatchRenders = 0;

const RenderBadge = ({ count }: { count: number }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: "1px 6px",
    borderRadius: 99, background: "#6366f120", color: "#6366f1",
    marginLeft: 6, letterSpacing: ".5px"
  }}>x{count}</span>
);

const ModePanel = memo(() => {
  modeRenders++;
  const mode = useThemeSelector(s => s.mode);
  const { setMode } = useThemeDispatch();
  const modes: Mode[] = ["light", "dark"];
  return (
    <Panel label="Mode" renderCount={modeRenders} note="useThemeSelector(s => s.mode)">
      <div style={{ display: "flex", gap: 8 }}>
        {modes.map(m => (
          <Chip key={m} active={mode === m} onClick={() => setMode(m)}>{m}</Chip>
        ))}
      </div>
    </Panel>
  );
});

const AccentPanel = memo(() => {
  accentRenders++;
  const accent = useThemeSelector(s => s.accent);
  const { setAccent } = useThemeDispatch();
  return (
    <Panel label="Accent" renderCount={accentRenders} note="useThemeSelector(s => s.accent)">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(Object.keys(ACCENTS) as Accent[]).map(a => (
          <button key={a} onClick={() => setAccent(a)} title={ACCENTS[a].label} style={{
            width: 32, height: 32, borderRadius: "50%",
            background: ACCENTS[a].bg, border: accent === a
              ? `3px solid ${ACCENTS[a].ring}` : "3px solid transparent",
            cursor: "pointer", outline: "none",
            boxShadow: accent === a ? `0 0 0 2px ${ACCENTS[a].bg}44` : "none",
            transition: "all .15s"
          }} />
        ))}
      </div>
    </Panel>
  );
});

const RadiusPanel = memo(() => {
  radiusRenders++;
  const radius = useThemeSelector(s => s.radius);
  const { setRadius } = useThemeDispatch();
  return (
    <Panel label="Button Border Radius" renderCount={radiusRenders} note="useThemeSelector(s => s.radius)">
      <div style={{ display: "flex", gap: 8 }}>
        {(Object.keys(RADII) as Radius[]).map(r => (
          <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>{RADII[r].label}</Chip>
        ))}
      </div>
    </Panel>
  );
});

const FontPanel = memo(() => {
  fontRenders++;
  const fontSize = useThemeSelector(s => s.fontSize);
  const { setFontSize } = useThemeDispatch();
  return (
    <Panel label="Font Size" renderCount={fontRenders} note="useThemeSelector(s => s.fontSize)">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input type="range" min={12} max={24} value={fontSize}
          onChange={e => setFontSize(+e.target.value)}
          style={{ flex: 1, accentColor: "#6366f1" }} />
        <span style={{ fontWeight: 700, minWidth: 36 }}>{fontSize}px</span>
      </div>
    </Panel>
  );
});

const FontStylePanel = memo(() => {
  fontStyleRenders++;
  const fontStyle = useThemeSelector(s => s.fontStyle);
  const { setFontStyle } = useThemeDispatch();
  return (
    <Panel label="Font Type" renderCount={fontStyleRenders} note="useThemeSelector(s => s.fontStyle)">
      <div style={{ display: "flex", gap: 8 }}>
        {(Object.keys(FONT_STYLES) as FontStyle[]).map(f => (
          <Chip key={f} active={fontStyle === f} onClick={() => setFontStyle(f)}>
            <span style={{
              fontWeight: FONT_STYLES[f].fontWeight,
              fontStyle: FONT_STYLES[f].fontStyle,
            }}>{FONT_STYLES[f].label}</span>
          </Chip>
        ))}
      </div>
    </Panel>
  );
});

const AlignmentPanel = memo(() => {
  alignmentRenders++;
  const alignment = useThemeSelector(s => s.alignment);
  const { setAlignment } = useThemeDispatch();
  const alignments: Alignment[] = ["left", "center", "right"];
  const icons: Record<Alignment, string> = { left: "Left", center: "Center", right: "Right" };
  return (
    <Panel label="Alignment" renderCount={alignmentRenders} note="useThemeSelector(s => s.alignment)">
      <div style={{ display: "flex", gap: 8 }}>
        {alignments.map(a => (
          <Chip key={a} active={alignment === a} onClick={() => setAlignment(a)}>{icons[a]}</Chip>
        ))}
      </div>
    </Panel>
  );
});

const DarkColoringPanel = memo(() => {
  darkColoringRenders++;
  const darkColoring = useThemeSelector(s => s.darkColoring);
  const { setDarkColoring } = useThemeDispatch();
  return (
    <Panel label="Dark Mode Coloring" renderCount={darkColoringRenders} note="useThemeSelector(s => s.darkColoring)">
      <div style={{ display: "flex", gap: 8 }}>
        <Chip active={darkColoring === "default"} onClick={() => setDarkColoring("default")}>Default</Chip>
        <Chip active={darkColoring === "dynamic"} onClick={() => setDarkColoring("dynamic")}>Dynamic (accent-matched)</Chip>
      </div>
    </Panel>
  );
});

const ResetPanel = memo(() => {
  dispatchRenders++;
  const { reset } = useThemeDispatch();
  return (
    <Panel label="Dispatch-Only Consumer" renderCount={dispatchRenders}
      note="useThemeDispatch() — zero re-renders from state">
      <button onClick={reset} style={{
        padding: "8px 20px", borderRadius: 8, border: "none",
        background: "#f43f5e", color: "#fff", fontWeight: 700,
        cursor: "pointer", fontSize: 14
      }}>Reset to Defaults</button>
    </Panel>
  );
});

const Preview = memo(() => {
  const theme = useTheme();
  const ac = ACCENTS[theme.accent];
  const r = RADII[theme.radius].px;
  const fs = FONT_STYLES[theme.fontStyle];
  const isDark = theme.mode === "dark";
  const dynamic = isDark && theme.darkColoring === "dynamic";

  // For dynamic dark: derive deep/mid tones from the accent hue via a small inline palette
  const DYNAMIC_DARK: Record<Accent, { outer: string; inner: string; text: string; code: string }> = {
    red:     { outer: "#2d0a0a", inner: "#4a1010", text: "#fecaca", code: "#fca5a5" },
    orange:  { outer: "#2d1500", inner: "#4a2200", text: "#fed7aa", code: "#fdba74" },
    amber:   { outer: "#2d1f00", inner: "#4a3200", text: "#fde68a", code: "#fcd34d" },
    lime:    { outer: "#162008", inner: "#243510", text: "#d9f99d", code: "#bef264" },
    emerald: { outer: "#062318", inner: "#0c3d28", text: "#a7f3d0", code: "#6ee7b7" },
    cyan:    { outer: "#042330", inner: "#0a3d50", text: "#a5f3fc", code: "#67e8f9" },
    indigo:  { outer: "#1e1b4b", inner: "#312e81", text: "#e0e7ff", code: "#a5b4fc" },
    violet:  { outer: "#1e0a3d", inner: "#3b0f6e", text: "#ede9fe", code: "#c4b5fd" },
    rose:    { outer: "#2d0a18", inner: "#4a1028", text: "#fecdd3", code: "#fda4af" },
  };

  const darkOuter = dynamic ? DYNAMIC_DARK[theme.accent].outer : "#1e1b4b";
  const darkInner = dynamic ? DYNAMIC_DARK[theme.accent].inner : "#312e81";
  const darkText  = dynamic ? DYNAMIC_DARK[theme.accent].text  : "#e0e7ff";
  const darkCode  = dynamic ? DYNAMIC_DARK[theme.accent].code  : "#a5b4fc";
  return (
    <div style={{
      borderRadius: 12, padding: 20, marginTop: 8,
      background: isDark ? darkOuter : "#f5f3ff",
      border: `1.5px solid ${ac.bg}33`, transition: "all .3s"
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Live Preview</div>
      <div style={{
        background: isDark ? darkInner : "#fff",
        borderRadius: r, padding: 16, marginBottom: 12,
        boxShadow: "0 2px 8px #0001"
      }}>
        <p style={{
          fontSize: theme.fontSize, margin: "0 0 12px",
          fontWeight: fs.fontWeight, fontStyle: fs.fontStyle,
          textAlign: theme.alignment,
          color: isDark ? darkText : "#1e1b4b"
        }}>
          This is an ipsum lorem text.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: theme.alignment === "right" ? "flex-end" : theme.alignment === "center" ? "center" : "flex-start" }}>
          <button style={{
            background: ac.bg, color: ac.text, border: "none",
            borderRadius: r, padding: "8px 16px", fontWeight: 700,
            fontSize: theme.fontSize * 0.85, cursor: "pointer"
          }}>Primary</button>
          <button style={{
            background: "transparent", color: ac.bg,
            border: `2px solid ${ac.bg}`, borderRadius: r,
            padding: "8px 16px", fontWeight: 700,
            fontSize: theme.fontSize * 0.85, cursor: "pointer"
          }}>Outlined</button>
        </div>
      </div>
      <code style={{
        fontSize: 11, color: isDark ? darkCode : "#4338ca",
        background: isDark ? darkOuter : "#ede9fe",
        padding: "6px 10px", borderRadius: 6, display: "block"
      }}>
        {JSON.stringify(theme)}
      </code>
    </div>
  );
});

// Shared UI primitives //

function Panel({ label, renderCount, note, children }: {
  label: string; renderCount: number; note: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: 16,
      border: "1.5px solid #e0e7ff", marginBottom: 12
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b" }}>{label}</span>
        <RenderBadge count={renderCount} />
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#6366f180", fontStyle: "italic" }}>{note}</span>
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: 99, fontSize: 13, fontWeight: 600,
      border: active ? "2px solid #6366f1" : "2px solid #e0e7ff",
      background: active ? "#ede9fe" : "#f8f8ff",
      color: active ? "#4338ca" : "#6b7280",
      cursor: "pointer", transition: "all .15s"
    }}>{children}</button>
  );
}

// Exported Demo App //

export default function App() {
  return (
    <ThemeProvider>
      <div style={{
        maxWidth: 640, margin: "0 auto", padding: 24,
        fontFamily: "system-ui, sans-serif"
      }}>
        <h2 style={{ margin: "0 0 4px", color: "#1e1b4b" }}>Theme Manager</h2>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: 13 }}>
          Split contexts + selector optimization. The <strong>xN</strong> badge counts re-renders per component — change one value and watch only relevant panels increment.
        </p>
        <ModePanel />
        <AccentPanel />
        <DarkColoringPanel />
        <RadiusPanel />
        <FontPanel />
        <FontStylePanel />
        <AlignmentPanel />
        <ResetPanel />
        <Preview />
      </div>
    </ThemeProvider>
  );
}