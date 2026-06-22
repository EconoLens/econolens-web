import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EconoLens - Global Economics Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0d2137 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "80px 100px",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#c9a84c",
            marginBottom: 24,
          }}
        >
          Economics Intelligence
        </div>
        <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-3px", marginBottom: 20, lineHeight: 1 }}>
          EconoLens
        </div>
        <div style={{ fontSize: 30, opacity: 0.75, fontWeight: 400, maxWidth: 680, lineHeight: 1.4 }}>
          World-class economics research, news, and data — made accessible.
        </div>
        <div style={{ marginTop: 48, fontSize: 20, opacity: 0.5, letterSpacing: "1px" }}>
          www.econolens.co.in
        </div>
      </div>
    ),
    { ...size }
  );
}
