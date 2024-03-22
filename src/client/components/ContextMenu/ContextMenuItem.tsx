import classNames from "classnames";

export default function ContextMenuItem({
  disabled,
  children,
  onClick,
}: {
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "text-sm font-medium tracking-wide px-3 py-1 hover:bg-zinc-200 hover:bg-opacity-10 rounded-md text-left cursor-pointer",
        { "opacity-75 pointer-events-none": disabled }
      )}
    >
      {children}
    </button>
  );
}
