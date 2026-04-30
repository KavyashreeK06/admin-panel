"use client";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: 0.3,
      }} />

      {/* Accent glow */}
      <div style={{
        position: "absolute",
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,255,71,0.08) 0%, transparent 70%)",
        top: "20%", left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: "56px 48px",
        width: 420,
        textAlign: "center",
      }}>
        {/* Logo mark */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.25em",
          color: "var(--accent)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>
          AlmostCrackd
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 8,
          color: "var(--text)",
        }}>
          Admin<br />Panel
        </h1>

        <p style={{
          color: "var(--text-muted)",
          fontSize: 13,
          marginBottom: 40,
          fontFamily: "'DM Mono', monospace",
        }}>
          Superadmin access only
        </p>

        {error === "unauthorized" && (
          <div style={{
            background: "rgba(255,71,87,0.1)",
            border: "1px solid rgba(255,71,87,0.3)",
            color: "#ff4757",
            padding: "12px 16px",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            marginBottom: 24,
            textAlign: "left",
          }}>
            ⚠ Access denied. Superadmin privileges required.
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: "var(--accent)",
            color: "#0a0a0f",
            fontFamily: "'DM Mono', monospace",
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "opacity 0.2s, transform 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.99)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid var(--border)",
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.1em",
        }}>
          RESTRICTED ACCESS — AUTHORIZED PERSONNEL ONLY
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
