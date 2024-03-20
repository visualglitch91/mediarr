import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "$lib/useModal";
import Discovery from "$pages/Discovery";
import Person from "$pages/Person";
import Movie from "$pages/Movie";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Switch>
          <Route path="/" component={Discovery} />
          <Route path="/person/:tmdbId" component={Person} />
          <Route path="/movie/:tmdbId" component={Movie} />
        </Switch>
      </ModalProvider>
    </QueryClientProvider>
  );
}
