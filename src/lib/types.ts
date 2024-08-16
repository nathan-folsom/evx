export interface Component {
  html: HTML,
}


type IntrinsicAttributes = {
  div: CommonAttributes & {},
  span: CommonAttributes & {},
}

type CommonAttributes = {
  className?: string;
  children?: HTML[];
}



