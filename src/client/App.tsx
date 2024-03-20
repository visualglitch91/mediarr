import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "$lib/useModal";
import Mediarr from "./Mediarr";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Mediarr />
      </ModalProvider>
    </QueryClientProvider>
  );
}
