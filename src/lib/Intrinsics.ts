import { renderChildren } from "./renderChildren";
import { Children, ChildType, ElementChild } from "./types";


type DivAttributes = {};
export function Div({ }: DivAttributes, children?: Children) {
  return Component("div", children);
}

type ButtonAttributes = Partial<Pick<HTMLButtonElement, "onclick">>;
export function Button({ onclick }: ButtonAttributes, children?: Children) {
  console.log("render button")
  const component = Component("button", children);
  if (onclick) {
    component.element.onclick = onclick;
  }
  return component;
}

function Component(tag: keyof HTMLElementTagNameMap, children?: Children): ElementChild {
  const el = document.createElement(tag);
  renderChildren(el, children || [], () => 0);
  return {
    __childType: ChildType.Element,
    element: el,
  }
}
