import If from "../lib/If";
import { Button, Div } from "../lib/Intrinsics";
import { state } from "../lib/State";
import Text from "../lib/Text";

export default function Counter() {
  const count = state(0, (action: "increment" | "decrement", s) => {
    switch (action) {
      case "increment":
        return s + 1;
      case "decrement":
        return s - 1;
    }
  })
  const show = state(false, (count: number) => count > 2);
  count.addChangeListener((count) => show.dispatchEvent(count));

  console.log("render counter")
  return (
    Div({}, [
      Button({ onclick: () => count.dispatchEvent("decrement") }, [Text("-")]),
      If({ show }, () => [Div({}, [Text("Count is > 2")])]),
      Button({ onclick: () => count.dispatchEvent("increment") }, [Text("+")]),
      Text(count),
    ])
  );
}
