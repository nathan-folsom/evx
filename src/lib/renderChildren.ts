import { Children, ChildType } from "./types";

export function renderChildren(el: HTMLElement, children: Children, getParentOffset: () => number = () => 0) {
  const childNodeCounts: number[] = [];
  children.forEach((child, i) => {
    const getOffset = () =>
      getParentOffset() + childNodeCounts.slice(0, i).reduce((total, current) => total + current, 0);
    const insertChild = (child: Node) => {
      const insertionIndex = getOffset();
      return insertionIndex === el.childNodes.length
        ? el.append(child)
        : el.insertBefore(el.childNodes[insertionIndex], child);
    };
    switch (child.__childType) {
      case ChildType.Element:
        childNodeCounts.push(1);
        insertChild(child.element);
        break;
      case ChildType.Text:
        childNodeCounts.push(1);
        const node = document.createTextNode(child.state.get() + "");
        insertChild(node);
        child.state.addChangeListener((next) => {
          node.textContent = next;
        })
        break;
      case ChildType.If:
        const startIndex = i + getOffset();
        const initialChildren = child.state.get();
        childNodeCounts.push(initialChildren.length);
        renderChildren(el, initialChildren, () => getOffset());
        child.state.addChangeListener(children => {
          while (childNodeCounts[i] > 0) {
            el.childNodes[startIndex].remove();
            childNodeCounts[i] -= 1;
          }
          childNodeCounts[i] = children.length;
          renderChildren(el, children, () => getOffset());
        });
    }
  })
  }
