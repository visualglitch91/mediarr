import classNames from "classnames";

export default function CardPlaceholder({
  index = 0,
  size = "md",
  orientation = "landscape",
}: {
  index?: number;
  size?: "dynamic" | "md" | "lg";
  orientation?: "portrait" | "landscape";
}) {
  return (
    <div
      style={{ animationDelay: `${(index * 100) % 2000}ms` }}
      className={classNames(
        "rounded-xl overflow-hidden shadow-lg placeholder shrink-0",
        {
          "aspect-video": orientation === "landscape",
          "aspect-[2/3]": orientation === "portrait",
          "w-44": size === "md" && orientation === "portrait",
          "h-44": size === "md" && orientation === "landscape",
          "w-60": size === "lg" && orientation === "portrait",
          "h-60": size === "lg" && orientation === "landscape",
          "w-full": size === "dynamic",
        }
      )}
    />
  );
}
