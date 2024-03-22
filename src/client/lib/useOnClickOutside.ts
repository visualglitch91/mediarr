import { useEffect } from "react";
import useLatestRef from "./useLatestRef";

type EventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  element: T | null | undefined,
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = "mousedown"
): void {
  const propsRef = useLatestRef({ handler, element });

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent | FocusEvent) => {
      const { element, handler } = propsRef.current;
      const target = event.target as Node;

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected || !element) {
        return;
      }

      const isOutside = !element.contains(target);

      if (isOutside) {
        handler(event);
      }
    };

    window.addEventListener(eventType, handler);

    return () => {
      window.removeEventListener(eventType, handler);
    };
  }, [eventType, propsRef]);
}
