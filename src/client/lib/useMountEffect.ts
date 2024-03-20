import { useEffect } from "react";

export default function useMountEffect(effect: () => void | (() => void)) {
  //eslint-disable-next-line
  useEffect(effect, []);
}
