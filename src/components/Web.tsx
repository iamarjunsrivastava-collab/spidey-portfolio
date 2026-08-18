import webAsset from "@/assets/web.png.asset.json";

export function Web({
  className = "",
  opacity = 0.06,
  rotate = 0,
}: {
  className?: string;
  opacity?: number;
  rotate?: number;
}) {
  return (
    <img
      src={webAsset.url}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none absolute ${className}`}
      style={{ opacity, transform: `rotate(${rotate}deg)` }}
    />
  );
}
