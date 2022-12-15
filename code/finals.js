const VERTICAL = 4;
const HORIZONTAL = 5;
const DIFFERENT = 30;
const FONT = 60;
const SPACE = 4;
const IMAGESIZE = 55;
const DELAY = 88;
const PAIR =
    (HORIZONTAL * VERTICAL) / 2;

class Attach {
    constructor() {
        this.loc
            = [-1, -1];
    }
}

class Location {
    constructor(a, b) {
        this.x = a;
        this.y = b;
    }
}

class LineMatch {
    constructor(a, b) {
        this.one = a;
        this.two = b;
    }
}

class DoubleLineMatch {
    constructor(a, b) {
        this.one = a;
        this.two = b;
    }
}

class TripleLineMatch {
    constructor(a, b, c) {
        this.one = a;
        this.two = b;
        this.three = c;
    }
}

let isAllStraightConnect = (...data) => {
    for (let a of data) {
        if (!(a
            instanceof LineMatch))
            return 0;
    }
    return 1;
}

export { VERTICAL, HORIZONTAL, DIFFERENT, PAIR, FONT, IMAGESIZE, SPACE, DELAY, Attach, Location, LineMatch, DoubleLineMatch, TripleLineMatch, isAllStraightConnect };
