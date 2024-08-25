import If from "./If";
import { Div } from "./Intrinsics";
import { renderChildren } from "./renderChildren";
import { state } from "./State";
import Text from "./Text";

describe("renderChildren util", () => {
  it("should render text node", () => {
    const parent = document.createElement("div");
    const content = "text content";
    const child = Text(content);
    renderChildren(parent, [child]);
    expect(parent.childNodes[0].textContent).toEqual(content);
  });

  it("should render element node", () => {
    const parent = document.createElement("div");
    const child = Div({});
    renderChildren(parent, [child]);
    expect(parent.children[0]).toEqual(child.element);
  });

  it("should render if node with initial show = true", () => {
    const parent = document.createElement("div");
    const show = state(true, (v: boolean) => v);
    const child = Div({});
    renderChildren(parent, [If({ show }, () => [child])]);
    expect(parent.children[0]).toEqual(child.element);
  });

  it("should render if node with initial show = false", () => {
    const parent = document.createElement("div");
    const show = state(false, (v: boolean) => v);
    const child = Div({});
    renderChildren(parent, [If({ show }, () => [child])]);
    expect(parent.children.length).toEqual(0);
  });

  it("should render if node in correct order", () => {
    const parent = document.createElement("div");
    const show = state(false, (v: boolean) => v);
    const child = Div({});
    renderChildren(parent, [If({ show }, () => [child]), Div({})]);
    expect(parent.childNodes.length).toEqual(1);
    show.dispatchEvent(true);
    expect(parent.childNodes[0]).toEqual(child.element);
  })

  it("should unrender if node", () => {
    const parent = document.createElement("div");
    const show = state(true, (v: boolean) => v);
    const child = Div({});
    const child2 = Div({});
    renderChildren(parent, [child2, If({ show }, () => [child])]);
    show.dispatchEvent(false);
    expect(parent.childNodes[0]).toEqual(child2.element);
  })
})
