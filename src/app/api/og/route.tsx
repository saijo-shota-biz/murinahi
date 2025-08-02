import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "ムリな日カレンダー";
  const subtitle = searchParams.get("subtitle") || "逆転の発想で日程調整";

  try {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fef2f2 0%, #fdf2f8 50%, #fff7ed 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "linear-gradient(135deg, #ef4444, #ec4899)",
            borderRadius: "50%",
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            background: "linear-gradient(135deg, #ec4899, #f97316)",
            borderRadius: "50%",
            opacity: 0.1,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
            padding: "80px",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          {/* Main title */}
          <h1
            style={{
              fontSize: title.length > 15 ? "64px" : "80px",
              fontWeight: "900",
              background: "linear-gradient(135deg, #ef4444, #ec4899)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: "1.1",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#374151",
              lineHeight: "1.3",
              maxWidth: "800px",
              margin: 0,
            }}
          >
            {subtitle}
          </p>

          {/* Brand tagline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "2px",
                background: "#d1d5db",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              無料 | 登録不要 | 完全匿名
            </span>
            <div
              style={{
                width: "60px",
                height: "2px",
                background: "#d1d5db",
              }}
            />
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#ef4444",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1f2937",
            }}
          >
            murinahi.vercel.app
          </span>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback simple image
    return new ImageResponse(
      <div
        style={{
          fontSize: 64,
          background: "linear-gradient(135deg, #ef4444, #ec4899)",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>{title}</div>
        <div style={{ fontSize: 32 }}>{subtitle}</div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
