export const mapUndefined = <P, Q> (projector: ((x: P) => Q)) : (x: P|undefined) => Q|undefined => {
    return x => x && projector(x);
}
export const pipe = <P, Q, R> (first: ((p: P) => Q), second: ((q: Q) => R)) => {
    return (p: P) => second(first(p));
}