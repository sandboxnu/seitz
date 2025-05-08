// interfaces for adding, removing, and moving elements in a collection.

interface AddEvent<T> {
  added: {
    newIndex: number;
    element: T;
  };
}

interface RemoveEvent<T> {
  removed: {
    oldIndex: number;
    element: T;
  };
}

interface MoveEvent<T> {
  moved: {
    newIndex: number;
    oldIndex: number;
    element: T;
  };
}

export type ChangeEvent<TAdd, TSelf> =
  | AddEvent<TAdd>
  | RemoveEvent<TSelf>
  | MoveEvent<TSelf>;
