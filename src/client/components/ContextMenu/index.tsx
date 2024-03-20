import { useState } from "react";
import Slot, { Slots } from "$components/Slot";

export default function ContextMenu({
  heading,
  slots,
  children,
  position = "fixed",
}: {
  heading?: string;
  slots?: Slots<"title" | "menu">;
  children?: React.ReactNode;
  position?: "absolute" | "fixed";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </div>

      {open && (
        <div
          className={`${position} z-50 my-2 px-1 py-1 bg-zinc-800 bg-opacity-50 rounded-lg backdrop-blur-xl flex flex-col w-max`}
        >
          <Slot slots={slots} name="title">
            {heading && (
              <h2 className="text-xs text-zinc-200 opacity-60 tracking-wide font-semibold px-3 py-1 line-clamp-1 text-left">
                {heading}
              </h2>
            )}
          </Slot>
          <div className="flex flex-col gap-0.5" onClick={() => close()}>
            <Slot slots={slots} name="menu" />
          </div>
        </div>
      )}
    </>
  );
}
