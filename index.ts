import { fromJS as _fromJS } from 'immutable';

// some phantom types
type Immutable<T> = {
   [P in keyof T]: Immut<T[P]>;
};
class Path<T, U> { private _className = "Path"; }
class Immut<T> { private _className = "Immutable"; }

function getPath<T, U>(f: (x: T) => U): Path<T, U> {
  const path: any = [];
  const proxy = new Proxy({}, {
	 get: (target: {}, name: PropertyKey) => {
		path.push(name);
		return proxy;
	 }
  });
  f(proxy as T);
  return path as Path<T, U>;
}

function fromJS<T>(x: T): Immutable<T> {
  return _fromJS(x);
}

function getIn<T, U>(x: Immutable<T>, pf: (y: T) => U): Immutable<U> {
  return (x as any).getIn(getPath(pf));
}

function setIn<T, U>(x: Immutable<T>, pf: (y: T) => U, val: Immutable<U>): Immutable<T> {
  return (x as any).setIn(getPath(pf), val);
}

function updateIn<T, U>(x: Immutable<T>, pf: (y: T) => U, f: (z: Immutable<U>) => Immutable<U>): Immutable<T> {
  return (x as any).updateIn(getPath(pf), f);
}

type Rec = {
  a: {
	 b: number[],
	 d: {
		c: string[]
	 }
  }
};

const record = fromJS({a: {b: [3, 7, 14], d: {c: ["hello", "world"]}}}); // inferred as Immutable<Rec>

console.log("Doing some tests, see index.ts for what they mean\n---");

console.log(3 + getIn(record, x => x.a.b[1]))
// -> 10

// console.log(3 + getIn(record, x => x.a.b))
// -> Operator '+' cannot be applied to types '3' and 'Immutable<number[]>'

console.log(setIn(record, x => x.a.b[1], 1000));
// -> Map { "a": Map { "b": List [ 3, 1000, 14 ], "d": Map { "c": List [ "hello", "world" ] } } }

// console.log(setIn(record, x => x.a.b[1], "bad"));
// Type argument candidate '"bad"' is not a valid type argument because it is not a supertype of candidate 'number'.

console.log(updateIn(record, x => x.a.d.c, xs => setIn(xs, x => x[0], "ok")));
// -> Map { "a": Map { "b": List [ 3, 7, 14 ], "d": Map { "c": List [ "ok", "world" ] } } }
