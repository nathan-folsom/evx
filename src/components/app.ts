import { Div } from "../lib/Intrinsics";
import Text from "../lib/Text";
import Counter from "./Counter";

export default function App() {
  return (
    Div({}, [
      Div({}, [Text("Count")]),
      Counter()
    ])
  )
}
