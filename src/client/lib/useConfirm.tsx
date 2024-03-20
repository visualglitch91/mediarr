import ConfirmDialog, { ConfirmConfigProps } from "$components/ConfirmDialog";
import useModal from "$lib/useModal";

export type useConfirmConfig = Pick<
  ConfirmConfigProps,
  | "title"
  | "description"
  | "color"
  | "confirmLabel"
  | "cancelLabel"
  | "extraButtons"
  | "onConfirm"
>;

export default function useConfirm() {
  const mount = useModal();

  return function confirm(confirmProps: useConfirmConfig) {
    return mount((dialogProps) => (
      <ConfirmDialog {...confirmProps} {...dialogProps} />
    ));
  };
}
