import { Link } from "wouter";

export default function LinkAnchor({
  href,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & { href: string }) {
  return (
    <Link href={href}>
      <a {...props} />
    </Link>
  );
}
