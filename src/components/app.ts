import { Div } from "../lib/Intrinsics";
import Counter from "./Counter";

export default function App() {
  return (
    Div({}, [
      Div({}, ["Count"]),
      Counter()
    ])
  )
}
