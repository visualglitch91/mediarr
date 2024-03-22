import classNames from "classnames";

const colors = {
  orange: "rgba(211, 84, 0, 0.8)",
  green: "rgba(39, 174, 96, 0.8)",
  blue: "rgba(41, 128, 185, 0.8)",
  purple: "rgba(142, 68, 173, 0.8)",
  red: "rgba(192, 57, 43, 0.8)",
};

export default function TitleStatusBase({
  label,
  color,
  size = "sm",
}: {
  label: string;
  color: "orange" | "green" | "blue" | "purple" | "red";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={classNames("flex items-center", {
        "py-1 px-2 text-xs font-bold": size === "sm",
        "py-2 px-3 font-medium": size === "md",
        "py-3 px-4 font-medium": size === "lg",
      })}
      style={{ background: colors[color] }}
    >
      {label}
    </div>
  );
}
