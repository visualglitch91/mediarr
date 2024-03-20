import PromptDialog from "$components/PromptDialog";
import useModal from "./useModal";

export function usePrompt() {
  const mount = useModal();

  function prompt({
    title,
    fields,
    onConfirm,
  }: {
    title: string;
    fields: string[];
    onConfirm: (values: string[]) => void;
  }) {
    mount((props) => (
      <PromptDialog
        {...props}
        sx={{ "& .MuiDialog-paper": { minWidth: 400 } }}
        title={title}
        fields={fields}
        onConfirm={(values) => {
          props.onClose();
          onConfirm(values);
        }}
      />
    ));
  }

  return prompt;
}
