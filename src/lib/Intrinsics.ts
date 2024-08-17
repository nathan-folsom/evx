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
  const component = Component("button", children);
  if (onclick) {
    component.element.onclick = onclick;
  }
  return component;
}

function Component(tag: keyof HTMLElementTagNameMap, children?: Children): ElementChild {
  const el = document.createElement(tag);
  const textNodes = new Map<State<any, any>, Text>();
  const appendChildren = (children: Children, insertChild: (node: Node) => void) => {
    children.forEach(child => {
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
          const startIndex = el.children.length;
          const prev: ChildNode[] = [];
          const onChildren = (children: Children) => {
            prev.forEach(node => node.remove());
            if (startIndex === el.children.length) {
              appendChildren(children, node => {
                el.append(node);
                prev.push(el.children[el.children.length - 1]);
              });
            } else {
              const referenceNode = el.children[startIndex];
              let offset = 0;
              appendChildren(children, node => {
                offset += 1;
                el.insertBefore(node, referenceNode);
                prev.push(el.children[startIndex + offset]);
              })
            }
          }
          onChildren(child.state.get());
          child.state.addChangeListener(onChildren);
      }
    })
  }
  appendChildren(children || [], node => el.append(node));
  return {
    __childType: ChildType.Element,
    element: el,
  }
}
