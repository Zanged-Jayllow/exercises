import { useState, useCallback } from "react";
import type { FC } from "react";
import profiles from "./profileData";
import type { ProfileData } from "./ProfileCard";
import ProfileCard from "./ProfileCard";
import { DynamicForm, type DynamicFormProps, type FormSchema, type FormValues } from "./FormBoiler";
import PROFILE_SCHEMA from "./ProfileSchema";

interface ProfileEntry extends ProfileData {
    id: string;
    highlighted: boolean;
}

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

            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    borderRadius: 16,
                    border: "1.5px dashed #d1d5db",
                    background: "#fafafa",
                    overflow: "hidden",
                    padding: "24px 24px 20px",
                }}
            >
                <h3 style={{ margin: "0 0 14px", fontSize: 17, fontWeight: 700, color: "#1f2937" }}>
                    New Profile
                </h3>
                <DynamicForm
                    schema={PROFILE_SCHEMA as FormSchema}
                    onSubmit={(vals: FormValues) => addProfile({
                        name:        String(vals.name),
                        bio:         String(vals.bio),
                        avatarUrl:   vals.avatarUrl ? String(vals.avatarUrl) : null,
                        accentColor: String(vals.accentColor),
                    })}
                />
            </div>

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