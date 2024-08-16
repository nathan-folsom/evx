import { State } from "./State";

type Children = (HTMLElement | string | State<string | number, any>)[];

type DivAttributes = {};
export function Div({ }: DivAttributes, children?: Children) {
  return Component("div", children);
}

type ButtonAttributes = Partial<Pick<HTMLButtonElement, "onclick">>;
export function Button({ onclick }: ButtonAttributes, children?: Children) {
  const component = Component("button", children);
  if (onclick) {
    component.onclick = onclick;
  }
  return component;
}

function Component(tag: keyof HTMLElementTagNameMap, children?: Children) {
  const el = document.createElement(tag);
  const textNodes = new Map<State<any, any>, Text>();
  children?.forEach(child => {
    if (child instanceof HTMLElement || typeof child === "string") {
      el.append(child);
    } else if (child instanceof State) {
      const node = document.createTextNode(child.get() + "");
      textNodes.set(child, node);
      el.append(node);
      child.addChangeListener((next) => {
        const found = textNodes.get(child);
        if (found) {
          found.textContent = next + "";
        }
      })
    }
  })
  return el;
}
