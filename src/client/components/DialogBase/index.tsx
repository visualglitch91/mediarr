import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useOnClickOutside } from "$lib/useOnClickOutside";
import useLatestRef from "$lib/useLatestRef";
import Slot, { Slots } from "$components/Slot";
import IconButton from "$components/IconButton";

export interface DialogBaseControlProps {
  open?: boolean;
  onClose?: () => void;
  onExited?: () => void;
}

const TRANSITION_DURATION = 100;
const docEl = document.documentElement;

export default function DialogBase({
  title,
  slots,
  children,
  disablePadding,
  onBack,
  controlProps: { open = false, onClose = () => {}, onExited = () => {} } = {},
}: {
  title?: string;
  slots?: Slots<"header" | "footer">;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  disablePadding?: boolean;
  onBack?: () => void;
  controlProps?: DialogBaseControlProps;
}) {
  const exitedTimeoutRef = useRef(0);
  const onExitedRef = useLatestRef(onExited);
  const [dialogEl, setDialogEl] = useState<HTMLDivElement | null>(null);

  useOnClickOutside(dialogEl, onClose);

  useEffect(() => {
    window.clearTimeout(exitedTimeoutRef.current);

    if (open) {
      const { scrollLeft, scrollTop } = docEl;
      const onScroll = () => docEl.scrollTo(scrollLeft, scrollTop);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    } else {
      exitedTimeoutRef.current = window.setTimeout(() => {
        onExitedRef.current();
      }, TRANSITION_DURATION);
    }
  }, [open, onExitedRef]);

  return (
    <div
      className="fixed w-full h-full"
      style={{
        zIndex: 100,
        opacity: open ? 1 : 0,
        transition: `opacity ${TRANSITION_DURATION}ms linear`,
      }}
    >
      <div className="absolute w-full h-full inset-0 bg-stone-950 bg-opacity-80" />
      <div className="inset-0 justify-center items-center z-20 overflow-hidden flex reltaive">
        <div
          ref={setDialogEl}
          data-modal="true"
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
            <div className="ml-auto">
              <IconButton onClick={onClose}>
                <Cross2Icon width={20} height={20} />
              </IconButton>
            </div>
          </div>
          <div
            className={classNames("flex-1 overflow-auto", {
              "py-6 px-5": !disablePadding,
            })}
          >
            {children}
          </div>
          {slots?.footer && (
            <div className="p-3 border-t border-zinc-700 flex justify-end items-center gap-4">
              {slots.footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
