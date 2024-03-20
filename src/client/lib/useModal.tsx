import { createContext, useContext, useState } from "react";
import useMountEffect from "./useMountEffect";

type Renderer = (
  dialogProps: {
    open: boolean;
    onClose: () => void;
    TransitionProps: {
      onExited: () => void;
    };
  },
  unmount: () => void
) => React.ReactNode;

const ModalContext = createContext<((renderer: Renderer) => () => void) | null>(
  null
);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<Record<string, React.ReactNode>>({});

  function unmountByKey(key: string) {
    setModals((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function mount(renderer: Renderer) {
    const key = Date.now().toString();
    const unmount = () => unmountByKey(key);

    let onClose: () => void;
    let canClose = false;

    function Modal() {
      const [open, setOpen] = useState(false);

      onClose = () => {
        if (canClose) {
          setOpen(false);
        }
      };

      useMountEffect(() => {
        setOpen(true);
        setTimeout(() => {
          canClose = true;
        }, 500);
      });

      return (
        <>
          {renderer(
            {
              open,
              onClose,
              TransitionProps: { onExited: unmount },
            },
            unmount
          )}
        </>
      );
    }

    setModals((prev) => {
      return {
        ...prev,
        [key]: <Modal key={key} />,
      };
    });

    return () => {
      onClose?.();
    };
  }

  return (
    <ModalContext.Provider value={mount}>
      {Object.values(modals)}
      {children}
    </ModalContext.Provider>
  );
}

//eslint-disable-next-line react-refresh/only-export-components
export default function useModal() {
  const mount = useContext(ModalContext);

  if (!mount) {
    throw new Error("Must be used inside a ModalProvider");
  }

  return mount;
}
