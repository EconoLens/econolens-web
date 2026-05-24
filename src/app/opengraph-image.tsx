import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EconoLens - India Economics Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: "-2px", marginBottom: 16 }}>
          EconoLens
        </div>
        <div style={{ fontSize: 32, opacity: 0.85, fontWeight: 400, maxWidth: 700, textAlign: "center" }}>
          India Economics News & AI-Powered Research
        </div>
        <div style={{ marginTop: 40, fontSize: 22, opacity: 0.6 }}>
          www.econolens.co.in
        </div>
      </div>
    ),
    { ...size }
  );
}
