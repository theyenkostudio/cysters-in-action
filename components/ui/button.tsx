import { cn } from "@/lib/cn";

/** Filled plum button. The only loud element, used for form submits. */
export function Button({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "min-h-[52px] cursor-pointer bg-accent px-7 text-link uppercase text-accent-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
