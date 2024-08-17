import { Children, ChildType, IfChild } from "./Intrinsics";
import { state, State } from "./State";

export default function If({ show }: { show: State<boolean, any> }, children: () => Children): IfChild {
  const output = state(show.get() ? children() : [], (show: boolean) => {
    return show ? children() : [];
  });
  show.addChangeListener((show) => output.dispatchEvent(show));
  return {
    __childType: ChildType.If,
    state: output,
  };
}
