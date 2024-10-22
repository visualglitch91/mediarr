import classNames from "classnames";
import Dialog from "@mui/material/Dialog";
import { ChevronLeftIcon, Cross2Icon } from "@radix-ui/react-icons";
import Slot, { Slots } from "$components/Slot";
import IconButton from "$components/IconButton";

export interface DialogBaseControlProps {
  open?: boolean;
  onClose?: () => void;
  onExited?: () => void;
}

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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{ onExited }}
      PaperProps={{
        sx: {
          background: "#33333388",
          color: "white",
          width: "90vw",
          maxWidth: 500,
        },
        className: "backdrop-blur-xl",
      }}
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
    </Dialog>
  );
}
