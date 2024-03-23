import classNames from "classnames";

export default function Button({
  size = "md",
  type = "secondary",
  slim = false,
  disabled = false,
  href,
  target = "_self",
  children,
  onClick,
  onFocus,
  onMouseOver,
  onMouseLeave,
  onBlur,
}: {
  size?: "md" | "sm" | "lg" | "xs";
  type?: "primary" | "secondary" | "tertiary";
  slim?: boolean;
  disabled?: boolean;
  href?: string;
  children?: React.ReactNode;
  target?: string;
  onClick?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onMouseOver?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}) {
  const buttonClasses = classNames(
    "flex items-center gap-1 font-medium select-none cursor-pointer selectable transition-all flex-shrink-0",
    {
      "bg-white text-zinc-900 font-extrabold backdrop-blur-lg rounded-xl":
        type === "primary",
      "hover:bg-rose-400 focus-within:bg-rose-400 hover:border-rose-400 focus-within:border-rose-400":
        type === "primary" && !disabled,
      "text-zinc-200 bg-zinc-600 bg-opacity-20 backdrop-blur-lg rounded-xl":
        type === "secondary",
      "focus-visible:bg-zinc-200 focus-visible:text-zinc-800 hover:bg-zinc-200 hover:text-zinc-800":
        (type === "secondary" || type === "tertiary") && !disabled,
      "rounded-full": type === "tertiary",

      "py-2 px-6 sm:py-3 sm:px-6": size === "lg" && !slim,
      "py-2 px-6": size === "md" && !slim,
      "py-1 px-4": size === "sm" && !slim,
      "py-1 px-4 text-sm": size === "xs" && !slim,

      "p-2 sm:p-3": size === "lg" && slim,
      "p-2": size === "md" && slim,
      "p-1": size === "sm" && slim,
      "p-1 text-sm": size === "xs" && slim,

      "opacity-50": disabled,
      "cursor-pointer": !disabled,
    }
  );

  return (
    <button
      className={buttonClasses}
      onClick={(event) => {
        if (href) {
          window.open(href, target)?.focus();
        } else {
          onClick?.(event);
        }
      }}
      onFocus={onFocus}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onBlur={onBlur}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
