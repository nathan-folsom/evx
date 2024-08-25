import { renderChildren } from "./renderChildren";
import { state } from "./State";
import { ChildType, TextChild } from "./types";

describe("renderChildren util", () => {
  it("should render text node", () => {
    const parent = document.createElement("div");
    const content = "text content";
    const child: TextChild = {
      __childType: ChildType.Text,
      state: state(content, (v: string) => v),
    }
    renderChildren(parent, [child]);
  });
  it("should render element node", () => {
    const parent = document.createElement("div");
  });
  it("should render if node", () => {
    const parent = document.createElement("div");
  });
})
