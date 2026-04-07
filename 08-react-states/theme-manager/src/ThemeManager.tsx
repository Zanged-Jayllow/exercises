import { createContext, useContext, useMemo, useReducer, memo } from "react";

// Type Declaration //

type Mode = "light" | "dark" | "system";
type Accent = "indigo" | "rose" | "emerald" | "amber";
type Radius = "none" | "sm" | "md" | "lg" | "full";

interface ThemeState {
  mode: Mode;
  accent: Accent;
  radius: Radius;
  fontSize: number;
}

type ThemeAction =
  | { type: "SET_MODE"; payload: Mode }
  | { type: "SET_ACCENT"; payload: Accent }
  | { type: "SET_RADIUS"; payload: Radius }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "RESET" };

interface ThemeDispatch {
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setRadius: (r: Radius) => void;
  setFontSize: (s: number) => void;
  reset: () => void;
}

// Default & Initial Theme //

const DEFAULT: ThemeState = { mode: "light", accent: "indigo", radius: "md", fontSize: 16 };

// Contexts //

const ThemeReadContext = createContext<ThemeState>(DEFAULT);
const ThemeDispatchContext = createContext<ThemeDispatch>({} as ThemeDispatch);

// Reducer //

function reducer(s: ThemeState, a: ThemeAction): ThemeState {
  switch (a.type) {
    case "SET_MODE":      return { ...s, mode: a.payload };
    case "SET_ACCENT":    return { ...s, accent: a.payload };
    case "SET_RADIUS":    return { ...s, radius: a.payload };
    case "SET_FONT_SIZE": return { ...s, fontSize: a.payload };
    case "RESET":         return DEFAULT;
    default:              return s;
  }
}

// Provider //

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT);

  // Dispatch context is stable — only recreated if dispatch identity changes
  // (which never happens with useReducer), so memoised actions are rock-solid.
  const actions = useMemo<ThemeDispatch>(() => ({
    setMode:     (p) => dispatch({ type: "SET_MODE",      payload: p }),
    setAccent:   (p) => dispatch({ type: "SET_ACCENT",    payload: p }),
    setRadius:   (p) => dispatch({ type: "SET_RADIUS",    payload: p }),
    setFontSize: (p) => dispatch({ type: "SET_FONT_SIZE", payload: p }),
    reset:       ()  => dispatch({ type: "RESET" }),
  }), [dispatch]);

  // Read context re-renders only when state changes.
  // Dispatch context NEVER re-renders its consumers due to state changes.
  return (
    <ThemeDispatchContext.Provider value={actions}>
      <ThemeReadContext.Provider value={state}>
        {children}
      </ThemeReadContext.Provider>
    </ThemeDispatchContext.Provider>
  );
}

// Hooks //

/** Full state — use when you need the whole object */
const useTheme = () => useContext(ThemeReadContext);

/** Context-selector pattern: subscribe to a single derived slice */
function useThemeSelector<T>(selector: (s: ThemeState) => T): T {
  return selector(useContext(ThemeReadContext));
}

/** Dispatch-only hook — NEVER triggers a re-render from state changes */
const useThemeDispatch = () => useContext(ThemeDispatchContext);

// Theme Palettes //

const ACCENTS: Record<Accent, { bg: string; ring: string; text: string; label: string }> = {
  indigo:  { bg: "#6366f1", ring: "#818cf8", text: "#fff", label: "Indigo"  },
  rose:    { bg: "#f43f5e", ring: "#fb7185", text: "#fff", label: "Rose"    },
  emerald: { bg: "#10b981", ring: "#34d399", text: "#fff", label: "Emerald" },
  amber:   { bg: "#f59e0b", ring: "#fcd34d", text: "#fff", label: "Amber"   },
};

const RADII: Record<Radius, { px: string; label: string }> = {
  none: { px: "0px",   label: "None"  },
  sm:   { px: "4px",   label: "Small"    },
  md:   { px: "8px",   label: "Medium"    },
  lg:   { px: "16px",  label: "Large"    },
  full: { px: "9999px",label: "Full"  },
};

// Demo Components //
// each is memo'd + uses a targeted selector //

let modeRenders = 0, accentRenders = 0, radiusRenders = 0, fontRenders = 0, dispatchRenders = 0;

const RenderBadge = ({ count }: { count: number }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: "1px 6px",
    borderRadius: 99, background: "#6366f120", color: "#6366f1",
    marginLeft: 6, letterSpacing: ".5px"
  }}>×{count}</span>
);

/** Subscribes ONLY to mode */
const ModePanel = memo(() => {
  modeRenders++;
  const mode = useThemeSelector(s => s.mode);
  const { setMode } = useThemeDispatch();
  const modes: Mode[] = ["light", "dark", "system"];
  return (
    <Panel label="Mode" renderCount={modeRenders} note="useThemeSelector(s ⇒ s.mode)">
      <div style={{ display: "flex", gap: 8 }}>
        {modes.map(m => (
          <Chip key={m} active={mode === m} onClick={() => setMode(m)}>
            {m === "light" ? "☀️" : m === "dark" ? "🌙" : "💻"} {m}
          </Chip>
        ))}
      </div>
    </Panel>
  );
});

/** Subscribes ONLY to accent */
const AccentPanel = memo(() => {
  accentRenders++;
  const accent = useThemeSelector(s => s.accent);
  const { setAccent } = useThemeDispatch();
  return (
    <Panel label="Accent" renderCount={accentRenders} note="useThemeSelector(s ⇒ s.accent)">
      <div style={{ display: "flex", gap: 10 }}>
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

/** Subscribes ONLY to radius */
const RadiusPanel = memo(() => {
  radiusRenders++;
  const radius = useThemeSelector(s => s.radius);
  const { setRadius } = useThemeDispatch();
  return (
    <Panel label="Border Radius" renderCount={radiusRenders} note="useThemeSelector(s ⇒ s.radius)">
      <div style={{ display: "flex", gap: 8 }}>
        {(Object.keys(RADII) as Radius[]).map(r => (
          <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>{RADII[r].label}</Chip>
        ))}
      </div>
    </Panel>
  );
});

/** Subscribes ONLY to fontSize */
const FontPanel = memo(() => {
  fontRenders++;
  const fontSize = useThemeSelector(s => s.fontSize);
  const { setFontSize } = useThemeDispatch();
  return (
    <Panel label="Font Size" renderCount={fontRenders} note="useThemeSelector(s ⇒ s.fontSize)">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input type="range" min={12} max={24} value={fontSize}
          onChange={e => setFontSize(+e.target.value)}
          style={{ flex: 1, accentColor: "#6366f1" }} />
        <span style={{ fontWeight: 700, minWidth: 36 }}>{fontSize}px</span>
      </div>
    </Panel>
  );
});

/** Uses useThemeDispatch ONLY — should never re-render from state changes */
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
      }}>↺ Reset to Defaults</button>
    </Panel>
  );
});

/** Full theme preview — uses useTheme() for the whole object */
const Preview = memo(() => {
  const theme = useTheme();
  const ac = ACCENTS[theme.accent];
  const r = RADII[theme.radius].px;
  const isDark = theme.mode === "dark";
  return (
    <div style={{
      borderRadius: 12, padding: 20, marginTop: 8,
      background: isDark ? "#1e1b4b" : "#f5f3ff",
      border: `1.5px solid ${ac.bg}33`, transition: "all .3s"
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Live Preview</div>
      <div style={{
        background: isDark ? "#312e81" : "#fff",
        borderRadius: r, padding: 16, marginBottom: 12,
        boxShadow: "0 2px 8px #0001"
      }}>
        <p style={{ fontSize: theme.fontSize, margin: "0 0 12px", fontWeight: 600,
          color: isDark ? "#e0e7ff" : "#1e1b4b" }}>
          This is an ipsum lorem text.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
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
        fontSize: 11, color: isDark ? "#a5b4fc" : "#4338ca",
        background: isDark ? "#1e1b4b" : "#ede9fe",
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
          Split contexts + selector optimization. The <strong>×N</strong> badge counts re-renders per component — change one value and watch only relevant panels increment.
        </p>
        <ModePanel />
        <AccentPanel />
        <RadiusPanel />
        <FontPanel />
        <ResetPanel />
        <Preview />
      </div>
    </ThemeProvider>
  );
}