import { useState, useCallback } from "react";
import type { CSSProperties, FC, SyntheticEvent } from "react";
import profiles from "./profileData";
import type { ProfileData } from "./ProfileCard";
import ProfileCard from "./ProfileCard";

interface ProfileEntry extends ProfileData {
    id: string;
    highlighted: boolean;
}

// Color presets for the profiles //

const COLOR_PRESETS = [
    "#e90e0e",
    "#0ee948",
    "#0e53e9",
    "#e9830e",
    "#e9d00e",
    "#0ee99c",
    "#830ee9",
    "#0e8ee9",
];

// Add Profile Form //

interface FormProps {
    onAdd: (p: ProfileData) => void;
}

const AddProfileForm: FC<FormProps> = ({ onAdd }) => {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [color, setColor] = useState(COLOR_PRESETS[0]);
    const [open, setOpen] = useState(false);

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({
            name: name.trim(),
            bio: bio.trim() || "No Bio Provided.",
            avatarUrl: avatarUrl.trim() || null,
            accentColor: color,
        });
        setName("");
        setBio("");
        setAvatarUrl("");
        setColor(COLOR_PRESETS[0]);
        setOpen(false);
    };

    const wrapper: CSSProperties = {
        width: "100%",
        maxWidth: 520,
        borderRadius: 16,
        border: "1.5px dashed #d1d5db",
        background: "#fafafa",
        overflow: "hidden",
        transition: "all 0.3s ease",
    };

    const input: CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1.5px solid #e5e7eb",
        fontSize: 14,
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    };

    if (!open) {
        return (
            <div style={wrapper}>
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        width: "100%",
                        padding: "18px",
                        background: "none",
                        border: "none",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#6b7280",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>+</span> Add New
                    Profile
                </button>
            </div>
        );
    }

    return (
        <div style={wrapper}>
            <div style={{ padding: 24 }}>
                <h3 style={{ margin: "0 0 18px", fontSize: 17, fontWeight: 700, color: "#1f2937" }}>
                    New Profile
                </h3>

                <div onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <input
                        style={input}
                        placeholder="Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                    />
                    <textarea
                        style={{ ...input, resize: "vertical", minHeight: 60 }}
                        placeholder="Short bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                    />
                    <input
                        style={input}
                        placeholder="Avatar URL (optional)"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                    />

                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>
                            Profile Color
                        </label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {COLOR_PRESETS.map((c) => (
                                <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 10,
                                    border: c === color ? `2.5px solid ${c}` : "2.5px solid transparent",
                                    background: c,
                                    cursor: "pointer",
                                    outline: c === color ? `2px solid ${c}44` : "none",
                                    outlineOffset: 2,
                                    transition: "all 0.2s ease",
                                }}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                        <button
                            type="button"
                            onClick={submit}
                            style={{
                                flex: 1,
                                padding: "11px 0",
                                borderRadius: 12,
                                border: "none",
                                background: color,
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: name.trim() ? "pointer" : "not-allowed",
                                opacity: name.trim() ? 1 : 0.5,
                                transition: "all 0.2s ease",
                            }}
                        >
                            Add Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            style={{
                                padding: "11px 20px",
                                borderRadius: 12,
                                border: "1.5px solid #e5e7eb",
                                background: "#fff",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#6b7280",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ProfileList Component //

const makeId = (() => {
  let n = 0;
  return () => `profile-${++n}`;
})();

const toEntry = (p: ProfileData): ProfileEntry => ({
    ...p,
    id: makeId(),
    highlighted: false,
});

const ProfileList: FC = () => {
    const [entries, setEntries] = useState<ProfileEntry[]>(() =>
        profiles.map(toEntry)
    );

    const toggleHighlight = useCallback((id: string) => {
        setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, highlighted: !e.highlighted } : e))
        );
    }, []);

    const removeProfile = useCallback((id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const addProfile = useCallback((p: ProfileData) => {
        setEntries((prev) => [...prev, toEntry(p)]);
    }, []);

    const highlightedCount = entries.filter((e) => e.highlighted).length;

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "48px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            <div style={{ textAlign: "center", marginBottom: 4 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1f2937", margin: 0 }}>
                    Profile List
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>
                    {entries.length} profile{entries.length !== 1 && "s"}
                    {highlightedCount > 0 && (
                        <span style={{ color: "#6366f1", fontWeight: 600 }}>
                            {" "}
                            · {highlightedCount} highlighted
                        </span>
                    )}
                </p>
            </div>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 28,
                }}
            >
                {entries.map((entry) => (
                    <ProfileCard
                        key={entry.id}
                        {...entry}
                        onToggleHighlight={() => toggleHighlight(entry.id)}
                        onRemove={() => removeProfile(entry.id)}
                    />
                ))}

                {entries.length === 0 && (
                    <p style={{ fontSize: 15, color: "#9ca3af", padding: "40px 0" }}>
                        No Profiles Yet
                    </p>
                )}
            </div>

            <AddProfileForm onAdd={addProfile} />

            <div
                style={{
                    marginTop: 8,
                    padding: "16px 24px",
                    borderRadius: 14,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    maxWidth: 520,
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "#6b7280",
                }}
            >
                <strong style={{ color: "#374151" }}>ProfileList Features</strong>
                <br />
                <code>Add</code> : create profiles via the form ·{" "}
                <code>Remove</code> : hover a card and click × ·{" "}
                <code>Highlight</code> : toggle per-card featured state ·{" "}
                Initial data loaded from <code>profileData</code>
            </div>
        </div>
    );
};

export default ProfileList;