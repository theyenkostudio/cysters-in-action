import { cn } from "@/lib/cn";

/** Small uppercase label above a heading. Colour is inherited unless `accent`. */
export function Eyebrow({
  children,
  accent = true,
  className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-eyebrow-sm uppercase md:text-eyebrow",
        accent && "text-accent",
        className,
      )}
    >
      {children}
    </div>
  );
}
