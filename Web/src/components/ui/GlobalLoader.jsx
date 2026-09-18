import { Loader2 } from "lucide-react";

export default function GlobalLoader({
  width = "w-12",
  height = "h-12",
  className = "",
}) {
  return (
    <div
      className={`flex items-center justify-center min-h-[60vh] w-full ${className}`}
    >
      <Loader2
        className={`${width} ${height} animate-spin text-(--color-primary-600)`}
      />
    </div>
  );
}
