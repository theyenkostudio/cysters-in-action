import Link from "next/link";
import { cn } from "@/lib/cn";

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** The quiet underlined uppercase link used instead of a loud button. */
export function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-link-sm uppercase underline underline-offset-[5px] md:text-link",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Same look, for use inside a parent that is already a link. */
export function TextLinkLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-link-sm uppercase underline underline-offset-[5px] md:text-link",
        className,
      )}
    >
      {children}
    </span>
  );
}
