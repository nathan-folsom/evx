import { ChildType, TextChild } from "./types";
import { state, State } from "./State";

export default function Text(input: string | State<string, any> | State<number, any>): TextChild {
  if (typeof input === "string") {
    return {
      __childType: ChildType.Text,
      state: state(input, () => ""),
    }
  }
  const output = state(input.get() + "", (next: string | number) => next + "");
  input.addChangeListener(output.dispatchEvent);
  return {
    __childType: ChildType.Text,
    state: output
  }
}
