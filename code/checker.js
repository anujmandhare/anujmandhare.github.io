import { HORIZONTAL, VERTICAL } from "./finals.js";

let elementFinder = (finder) => {
    let data = [];
    let arr =
        document.querySelectorAll(finder);
    for (let q = 0;
        q < arr.length;
        q++) {
        data.push(arr.item(q));
    }
    return data;
}

let findData = (a, b) => {
    if (a < 0
        || a >= HORIZONTAL)
        return null;
    if (b < 0
        || b >= VERTICAL)
        return null;
    for (let q of elementFinder("td")) {
        if (q.loc[0] === a
            && q.loc[1] === b)
            return q;
    }
    return null;
}

export { findData, elementFinder };