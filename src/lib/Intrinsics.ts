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
  const appendChildren = (children: Children, getParentOffset: () => number) => {
    const childNodeCounts: number[] = [];
    children.forEach((child, i) => {
      const getOffset = () =>
        getParentOffset() + childNodeCounts.slice(0, i).reduce((total, current) => total + current, 0);
      const insertChild = (child: Node) => {
        const insertionIndex = getOffset();
        return insertionIndex === el.children.length
          ? el.append(child)
          : el.insertBefore(el.children[insertionIndex], child);
      };
      switch (child.__childType) {
        case ChildType.Element:
          childNodeCounts.push(1);
          insertChild(child.element);
          break;
        case ChildType.Text:
          childNodeCounts.push(1);
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
          const startIndex = children.indexOf(child) + getOffset();
          const onChildren = (children: Children) => {
            while (childNodeCounts[i] > 0) {
              el.children[startIndex].remove();
              childNodeCounts[i] -= 1;
            }
            childNodeCounts[i] = children.length;
            appendChildren(
              children,
              () => getOffset()
            );
          }
          const initialChildren = child.state.get();
          childNodeCounts.push(initialChildren.length);
          onChildren(initialChildren);
          child.state.addChangeListener(onChildren);
      }
    })
  }
  appendChildren(children || [], () => 0);
  return {
    __childType: ChildType.Element,
    element: el,
  }
}
