type ChangeListener<T> = (nextState: T) => void;
type Reducer<Event, State> = (event: Event, previous: State) => State;

export class State<State, Event> {
  internal: State;
  listeners: ChangeListener<State>[] = [];

  constructor(initial: State, private reducer: Reducer<Event, State>) {
    this.internal = initial
  }

  dispatchEvent = (event: Event) => {
    this.internal = this.reducer(event, this.internal);
    this.listeners.forEach(l => l(this.internal));
  }

  addChangeListener = (listener: ChangeListener<State>) => {
    this.listeners.push(listener);
  }

  get = () => this.internal;
}

export function state<S, E>(initial: S, reducer: Reducer<E, S>) {
  return new State(initial, reducer);
}
