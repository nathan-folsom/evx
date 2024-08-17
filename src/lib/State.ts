type ChangeListener<T> = (nextState: T) => void;
type Reducer<Event, State> = (event: Event, previous: State) => State;
type UpdatePredicate<State> = (prev: State, next: State) => boolean;

export class State<State, Event> {
  internal: State;
  listeners: ChangeListener<State>[] = [];

  constructor(
    initial: State,
    private reducer: Reducer<Event, State>,
    private updatePredicate: UpdatePredicate<State>
  ) {
    this.internal = initial
  }

  dispatchEvent = (event: Event) => {
    const next = this.reducer(event, this.internal);
    if (this.updatePredicate(this.internal, next)) return;
    this.internal = next;
    this.listeners.forEach(l => l(this.internal));
  }

  addChangeListener = (listener: ChangeListener<State>) => {
    this.listeners.push(listener);
  }

  get = () => this.internal;
}

const DEFAULT_PREDICATE = <T>(a: T, b: T) => a === b;

export function state<S, E>(
  initial: S,
  reducer: Reducer<E, S>,
  updatePredicate: UpdatePredicate<S> = DEFAULT_PREDICATE
) {
  return new State(initial, reducer, updatePredicate);
}
