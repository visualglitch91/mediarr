import classNames from "classnames";

export default function IconButton({
  className,
  disabled,
  children,
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={classNames(
        "text-zinc-300 hover:text-zinc-50 p-1 flex items-center justify-center selectable rounded-sm flex-shrink-0",
        {
          "opacity-30 cursor-not-allowed pointer-events-none": disabled,
          "cursor-pointer": !disabled,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
