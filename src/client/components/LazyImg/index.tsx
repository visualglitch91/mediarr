import classNames from "classnames";
import { useEffect, useState } from "react";

export default function LazyImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div
      className={classNames(
        "transition-opacity duration-300",
        { "opacity-0": !loaded, "opacity-100": loaded },
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <slot />
    </div>
  );
}
