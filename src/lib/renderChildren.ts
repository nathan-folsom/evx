import { Children, ChildType } from "./types";

export function renderChildren(el: HTMLElement, children: Children, getParentOffset: () => number = () => 0) {
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
