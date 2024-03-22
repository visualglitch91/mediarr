import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "$lib/useModal";
import NavBar from "$components/NavBar";
import Discovery from "$pages/Discovery";
import Person from "$pages/Person";
import Movie from "$pages/Movie";
import Series from "$pages/Series";
import Genre from "$pages/Genre";
import Network from "$pages/Network";
import Movies from "$pages/Movies";
import AllSeries from "$pages/AllSeries";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <NavBar />
        <div className="min-h-screen">
          <Switch>
            <Route path="/" component={Discovery} />
            <Route path="/person/:tmdbId" component={Person} />
            <Route path="/movie/:tmdbId" component={Movie} />
            <Route path="/series/:tmdbId" component={Series} />
            <Route path="/genre/:genre" component={Genre} />
            <Route path="/network/:network" component={Network} />
            <Route path="/movies" component={Movies} />
            <Route path="/series" component={AllSeries} />
          </Switch>
        </div>
      </ModalProvider>
    </QueryClientProvider>
  );
}
