import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

export default function UICarousel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [{ fadeLeft, fadeRight }, setState] = useState({
    fadeLeft: false,
    fadeRight: false,
  });

  function updateScrollPosition() {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const scrollX = element.scrollLeft;
    const maxScrollX = element.scrollWidth - element.clientWidth;

    setState({
      fadeLeft: scrollX > 10,
      fadeRight: scrollX < maxScrollX - 10,
    });
  }

  useEffect(() => {
    updateScrollPosition();
  }, []);

  return (
    <div
      className={classNames(
        className,
        "overflow-x-scroll scrollbar-hide relative p-1"
      )}
      style={{
        maskImage: `linear-gradient(to right, transparent 0%, ${
          fadeLeft ? "" : "black 0%, "
        }black 5%, black 95%, ${
          fadeRight ? "" : "black 100%, "
        }transparent 100%)`,
      }}
      onScroll={updateScrollPosition}
      ref={elementRef}
    >
      {children}
    </div>
  );
}
