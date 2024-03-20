import { useRef, useEffect } from "react";

export default function useLatestRef<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
