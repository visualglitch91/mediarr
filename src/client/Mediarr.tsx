import { Route, Switch } from "wouter";
import Discovery from "$pages/Discovery";

export default function Mediarr() {
  return (
    <Switch>
      <Route path="/" component={Discovery} />
    </Switch>
  );
}
