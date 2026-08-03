export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex justify-center bg-background px-6">
      <div className="flex w-full max-w-xs flex-col items-center">
        {/* Loader */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Glow */}
          <div className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/20 blur-2xl" />

          {/* Ring */}
          <div className="absolute h-24 w-24 rounded-full border border-primary/20" />

          {/* Spinner */}
          <div className="absolute h-24 w-24 animate-spin rounded-full border-[3px] border-transparent border-t-primary border-r-primary" />

          {/* Center */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-xl">
            <div className="h-3 w-3 animate-ping rounded-full bg-primary" />
          </div>
        </div>

        {/* Text */}
        <h3 className="mt-8 text-lg font-semibold">
          {text}
        </h3>

        <p className="mt-1 text-center text-sm text-muted-foreground">
          Please wait ...
        </p>

        {/* Fake Progress */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[loading_1.6s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
}