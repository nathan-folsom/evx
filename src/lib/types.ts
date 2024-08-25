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
  If,
}



