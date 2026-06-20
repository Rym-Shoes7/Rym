import { useEffect, useRef, useState } from "react";

export default function VideoLoader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const doneRef = useRef(false);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(onDone, 800);
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const showSkip = setTimeout(() => setCanSkip(true), 2000);
    const safety = setTimeout(finish, 12000);

    v.addEventListener("ended", finish);
    v.addEventListener("error", finish);

    v.muted = true;
    v.play().catch(() => {
      clearTimeout(safety);
      setTimeout(finish, 3000);
    });

    return () => {
      clearTimeout(showSkip);
      clearTimeout(safety);
      v.removeEventListener("ended", finish);
      v.removeEventListener("error", finish);
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
        transition: "opacity 0.8s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dg3xhjzlf/video/upload/vc_h264,ac_none/0620_hocomx.mp4"
        muted
        playsInline
        autoPlay
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {canSkip && (
        <button
          onClick={finish}
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "#fff",
            padding: "10px 22px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            letterSpacing: "0.1em",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}
        >
          SKIP →
        </button>
      )}
    </div>
  );
}
