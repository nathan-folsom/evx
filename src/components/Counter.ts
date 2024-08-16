import { Button, Div } from "../lib/Intrinsics";
import { state } from "../lib/State";

export default function Counter() {
  const count = state(0, (action: "increment" | "decrement", s) => {
    switch (action) {
      case "increment":
        return s + 1;
      case "decrement":
        return s - 1;
    }
  })

  return (
    Div({}, [
      Button({ onclick: () => count.dispatchEvent("decrement") }, ["-"]),
      Button({ onclick: () => count.dispatchEvent("increment") }, ["+"]),
      count
    ])
  );
}
