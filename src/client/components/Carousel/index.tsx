import { useRef, useState } from "react";
import classNames from "classnames";
import useResizeObserver from "use-resize-observer";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import IconButton from "$components/IconButton";
import Slot, { Slots } from "$components/Slot";

export function CarouselPlaceholderItems() {
  return <span>Loading...</span>;
}

export default function Carousel({
  gradientFromColor = "from-stone-950",
  heading,
  scrollClassName = "",
  className = "",
  children,
  slots,
}: {
  gradientFromColor?: string;
  heading?: React.ReactNode;
  scrollClassName?: string;
  className?: string;
  children: React.ReactNode;
  slots?: Slots<"title">;
}) {
  const [scrollX, setScrollX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carousel = carouselRef.current;

  useResizeObserver({ ref: carouselRef });

  return (
    <div
      className={classNames("flex flex-col gap-4 group/carousel", className)}
    >
      <div
        className={"flex justify-between items-center gap-4 " + scrollClassName}
      >
        <Slot slots={slots} name="title">
          <div className="font-semibold text-xl">{heading}</div>
        </Slot>
        <div
          className={classNames(
            "flex gap-2 sm:opacity-0 transition-opacity sm:group-hover/carousel:opacity-100",
            {
              hidden:
                (carousel?.scrollWidth || 0) === (carousel?.clientWidth || 0),
            }
          )}
        >
          <IconButton
            onClick={() => {
              carousel?.scrollTo({
                left: scrollX - carousel?.clientWidth * 0.8,
                behavior: "smooth",
              });
            }}
          >
            <ChevronLeftIcon width={20} height={20} />
          </IconButton>
          <IconButton
            onClick={() => {
              carousel?.scrollTo({
                left: scrollX + carousel?.clientWidth * 0.8,
                behavior: "smooth",
              });
            }}
          >
            <ChevronRightIcon width={20} height={20} />
          </IconButton>
        </div>
      </div>

      <div className="relative">
        <div
          className={classNames(
            "flex overflow-x-scroll items-center overflow-y-visible gap-4 relative scrollbar-hide p-1",
            scrollClassName
          )}
          ref={carouselRef}
          tabIndex={-1}
          onScroll={() => setScrollX(carousel?.scrollLeft || scrollX)}
        >
          {children}
        </div>
        {scrollX > 50 && (
          <div
            className={
              "absolute inset-y-0 left-0 w-0 sm:w-16 md:w-24 bg-gradient-to-r " +
              gradientFromColor
            }
          />
        )}
        {carousel &&
          scrollX < carousel?.scrollWidth - carousel?.clientWidth - 50 && (
            <div
              className={
                "absolute inset-y-0 right-0 w-0 sm:w-16 md:w-24 bg-gradient-to-l " +
                gradientFromColor
              }
            />
          )}
      </div>
    </div>
  );
}
