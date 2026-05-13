import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(160deg, #F7E9D7 0%, #F3D3C4 55%, #E5B89D 100%)",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: "14px solid rgba(154, 79, 56, 0.15)",
            borderRadius: "120px",
            color: "#7F3F2B",
            display: "flex",
            fontFamily: "Georgia",
            fontSize: 220,
            fontWeight: 700,
            height: 360,
            justifyContent: "center",
            width: 360,
          }}
        >
          A
        </div>
      </div>
    ),
    size,
  );
}
