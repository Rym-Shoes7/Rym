import { useEffect, useRef, useState } from "react";

export default function VideoLoader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);

  function finish() {
    setFading(true);
    setTimeout(onDone, 700);
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => finish());
    v.addEventListener("ended", finish);
    const safety = setTimeout(finish, 8000);
    return () => {
      v.removeEventListener("ended", finish);
      clearTimeout(safety);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#1C1C1C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.7s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dg3xhjzlf/video/upload/0620_hocomx.mp4"
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
