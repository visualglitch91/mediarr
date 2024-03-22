import { ChevronLeftIcon, Cross2Icon } from "@radix-ui/react-icons";
import Slot, { Slots } from "$components/Slot";
import IconButton from "$components/IconButton";
import { useState } from "react";
import { useOnClickOutside } from "$lib/useOnClickOutside";

export default function DialogBase({
  title,
  slots,
  children,
  onBack,
  onClose,
}: {
  title?: string;
  slots?: Slots<"header">;
  children?: React.ReactNode;
  onBack?: () => void;
  onClose: () => void;
}) {
  const [dialogEl, setDialogEl] = useState<HTMLDivElement | null>(null);

  useOnClickOutside(dialogEl, onClose);

  return (
    <>
      <div className="fixed inset-0 bg-stone-950 bg-opacity-80 z-20" />
      <div
        className={
          "fixed inset-0 justify-center items-center z-20 overflow-hidden flex transition-opacity reltaive"
        }
      >
        <div
          ref={setDialogEl}
          className="max-w-3xl self-start mt-[10vh] bg-[#33333388] backdrop-blur-xl rounded overflow-hidden flex flex-col flex-1 mx-4 sm:mx-16 lg:mx-24 drop-shadow-xl"
        >
          <div className="flex text-zinc-200 items-center p-3 px-5 gap-4 border-b border-zinc-700">
            <Slot slots={slots} name="header">
              {onBack && (
                <div
                  className={
                    "flex-1 flex items-center gap-1 cursor-pointer text-zinc-300 hover:text-zinc-200"
                  }
                >
                  <IconButton onClick={onBack}>
                    <ChevronLeftIcon width={20} height={20} />
                  </IconButton>
                </div>
              )}
              <h1 className="font-medium">{title}</h1>
            </Slot>
            <IconButton onClick={onClose}>
              <Cross2Icon width={20} height={20} />
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
