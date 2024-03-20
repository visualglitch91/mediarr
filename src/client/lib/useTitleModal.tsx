import { navigate } from "wouter/use-location";
import { TitleId } from "./types";

export default function useTitleModal() {
  return ({ id, type }: TitleId) => {
    navigate(`/${type}/${id}`);
  };
}
