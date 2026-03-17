import { useState } from "react";
import type { CSSProperties, MouseEvent, FC } from "react";
import profiles from "./profileData";

// TypeScript Format, Need Type Declarations //

interface ProfileCardProps {
    name?: string;
    bio?: string;
    avatarUrl?: string | null;
    accentColor?: string;
}

export interface ProfileData {
    name: string;
    bio: string;
    avatarUrl: string | null;
    accentColor: string;
}

// Profile Card Component //

const ProfileCard: FC<ProfileCardProps> = ({
    name = "John Smith",
    bio = "If you are seeing this something is wrong.",
    avatarUrl = null,
    accentColor = "#6366f1",
}) => {
    const [highlighted, setHighlighted] = useState<boolean>(false);
    const [hovered, setHovered] = useState<boolean>(false);

    const initials: string = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

    const cardStyle: CSSProperties = {
        position: "relative",
        width: 320,
        borderRadius: 20,
        overflow: "hidden",
        background: highlighted
            ? `linear-gradient(135deg, ${accentColor}11, ${accentColor}22)`
            : "#ffffff",
        border: `1.5px solid ${highlighted ? accentColor : "#e5e7eb"}`,
        boxShadow: hovered
            ? highlighted
            ? `0 20px 40px ${accentColor}33, 0 0 0 2px ${accentColor}44`
            : "0 16px 32px rgba(0,0,0,0.10)"
            : highlighted
            ? `0 8px 24px ${accentColor}22`
            : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const bannerStyle: CSSProperties = {
        height: 80,
        background: highlighted
            ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
            : `linear-gradient(135deg, ${accentColor}88, ${accentColor}44)`,
        transition: "background 0.35s ease",
    };

    const avatarWrapperStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        marginTop: -44,
        position: "relative",
        zIndex: 1,
    };

    const avatarStyle: CSSProperties = {
        width: 88,
        height: 88,
        borderRadius: "50%",
        border: `3.5px solid ${highlighted ? accentColor : "#fff"}`,
        boxShadow: highlighted
            ? `0 0 0 3px ${accentColor}33`
            : "0 2px 8px rgba(0,0,0,0.10)",
        objectFit: "cover",
        transition: "all 0.35s ease",
    };

    const initialsStyle: CSSProperties = {
        ...avatarStyle,
        background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}66)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: accentColor,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 1,
        userSelect: "none",
    };

    const bodyStyle: CSSProperties = {
        padding: "12px 24px 24px",
        textAlign: "center",
    };

    const nameStyle: CSSProperties = {
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: highlighted ? accentColor : "#1f2937",
        transition: "color 0.3s ease",
    };

    const bioStyle: CSSProperties = {
        margin: "8px 0 20px",
        fontSize: 14,
        lineHeight: 1.6,
        color: "#6b7280",
    };

    const btnStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 22px",
        borderRadius: 12,
        border: "none",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.25s ease",
        background: highlighted ? accentColor : `${accentColor}14`,
        color: highlighted ? "#fff" : accentColor,
    };

    const tagStyle: CSSProperties = {
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        background: highlighted ? `${accentColor}22` : "transparent",
        color: accentColor,
        opacity: highlighted ? 1 : 0,
        transform: highlighted ? "translateY(0)" : "translateY(6px)",
        transition: "all 0.3s ease",
        marginTop: 12,
        letterSpacing: 0.5,
    };

    const handleBtnEnter = (e: MouseEvent<HTMLButtonElement>): void => {
        e.currentTarget.style.transform = "scale(1.05)";
    };

    const handleBtnLeave = (e: MouseEvent<HTMLButtonElement>): void => {
        e.currentTarget.style.transform = "scale(1)";
    };

    return (
    <div
        style={cardStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <div style={bannerStyle} />

        <div style={avatarWrapperStyle}>
            {avatarUrl ? (
                <img src={avatarUrl} alt={name} style={avatarStyle} />
            ) : (
                <div style={initialsStyle}>{initials}</div>
            )}
        </div>

        <div style={bodyStyle}>
            <h3 style={nameStyle}>{name}</h3>
            <p style={bioStyle}>{bio}</p>

            <button
                style={btnStyle}
                onClick={() => setHighlighted((h: boolean) => !h)}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
            >
                {highlighted ? (
                <>
                    <span style={{ fontSize: 15 }}>★</span> Highlighted
                </>
                ) : (
                <>
                    <span style={{ fontSize: 15 }}>☆</span> Highlight
                </>
                )}
            </button>

            <div style={tagStyle}>FEATURED PROFILE</div>
        </div>
    </div>
    );
};

export default ProfileCard;

// ─── Demo Application ─── //

export function App(): React.ReactElement {
    // console.log(profiles); //
    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "48px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            <div style={{ textAlign: "center", marginBottom: 12 }}>
                <h1
                    style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#1f2937",
                        margin: 0,
                    }}
                >
                    ProfileCard Component
                </h1>
                <p
                    style={{
                        fontSize: 14,
                        color: "#6b7280",
                        marginTop: 6,
                    }}
                >
                    Hover to elevate · Click <strong>Highlight</strong> to toggle dynamic
                    styling
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
                {profiles.map((p: ProfileData) => (
                    <ProfileCard key={p.name} {...p} />
                ))}
            </div>

            <div
                style={{
                    marginTop: 24,
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
                <strong style={{ color: "#374151" }}>Props API</strong>
                <br />
                <code>name</code> — display name · <code>bio</code> — short description
                · <code>avatarUrl</code> — image URL or null (falls back to initials) ·{" "}
                <code>accentColor</code> — theme color per card
            </div>
        </div>
    );
}