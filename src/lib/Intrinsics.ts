import { State } from "./State";

export type Children = (ElementChild | TextChild | IfChild)[];

export type ElementChild = Child<ChildType.Element> & {
  element: HTMLElement,
}
export type TextChild = Child<ChildType.Text> & {
  state: State<string, any>,
}
export type IfChild = Child<ChildType.If> & {
  state: State<Children, any>
}
type Child<T extends ChildType> = {
  __childType: T
}

export enum ChildType {
  Element,
  Text,
  StatefulText,
  If,
}

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
  const textNodes = new Map<State<any, any>, Text>();
  const appendChildren = (children: Children, offset: number) => {
    children.forEach((child, i) => {
      console.log("offset", offset, "child index", i);
      console.log("child", child);
      const insertChild = (child: Node) => {
        const insertionIndex = offset + i;
        console.log("insert child", child);
        console.log("child element count", el.children.length);
        console.log("parent", el);
        return insertionIndex === el.children.length
          ? el.append(child)
          : el.insertBefore(el.children[insertionIndex], child);
      };
      switch (child.__childType) {
        case ChildType.Element:
          insertChild(child.element);
          break;
        case ChildType.Text:
          const node = document.createTextNode(child.state.get() + "");
          textNodes.set(child.state, node);
          insertChild(node);
          child.state.addChangeListener((next) => {
            const found = textNodes.get(child.state);
            if (found) {
              found.textContent = next + "";
            }
          })
          break;
        case ChildType.If:
          const startIndex = children.indexOf(child) + offset;
          let length = 0;
          const onChildren = (children: Children) => {
            while (length > 0) {
              el.children[startIndex].remove();
              length -= 1;
            }
            length = children.length;
            console.log("append if children", children);
            appendChildren(children, startIndex);
          }
          onChildren(child.state.get());
          child.state.addChangeListener(onChildren);
      }
    })
  }
  appendChildren(children || [], 0);
  return {
    __childType: ChildType.Element,
    element: el,
  }
}
