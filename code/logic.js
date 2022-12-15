import { HORIZONTAL, VERTICAL, isAllStraightConnect, Location, LineMatch, TripleLineMatch, DoubleLineMatch } from "./finals.js";
import { findData } from "./checker.js";

//Match if are next to each other
let areNeighbours = (one, two) => {
    if (one.loc[0] === two.loc[0] &&
        Math.abs(one.loc[1] -
            two.loc[1]) === 1)
        return new LineMatch(new Location(one.loc[0], one.loc[1]),
            new Location(two.loc[0], two.loc[1]));
    if (one.loc[1] === two.loc[1] &&
        Math.abs(one.loc[0] -
            two.loc[0]) === 1)
        return new LineMatch(new Location(one.loc[0], one.loc[1]),
            new Location(two.loc[0], two.loc[1]));
    return 0;
}

//Match by straight line
let doSingleMatch = (one, two, oneCheck = false, twoCheck = false) => {
    if (one.loc[0] === two.loc[0]) {
        if (one.loc[1] > two.loc[1]) {
            for (let z = two.loc[1] + (twoCheck ? 0 : 1);
                z < one.loc[1] + (oneCheck ? 1 : 0);
                z++)
                if (available(one.loc[0], z))
                    return 0;
            return new LineMatch(new Location(one.loc[0], one.loc[1]),
                new Location(two.loc[0], two.loc[1]));
        }
        if (one.loc[1] < two.loc[1]) {
            for (let z = one.loc[1] + (oneCheck ? 0 : 1);
                z < two.loc[1] + (twoCheck ? 1 : 0);
                z++)
                if (available(one.loc[0], z))
                    return 0;
            return new LineMatch(new Location(one.loc[0], one.loc[1]),
                new Location(two.loc[0], two.loc[1]));
        }
    }
    if (one.loc[1] === two.loc[1]) {
        if (one.loc[0] > two.loc[0]) {
            for (let z = two.loc[0] + (twoCheck ? 0 : 1);
                z < one.loc[0] + (oneCheck ? 1 : 0);
                z++)
                if (available(z, one.loc[1]))
                    return 0;
            return new LineMatch(new Location(one.loc[0], one.loc[1]),
                new Location(two.loc[0], two.loc[1]));
        }
        if (one.loc[0] < two.loc[0]) {
            for (let z = one.loc[0] + (oneCheck ? 0 : 1);
                z < two.loc[0] + (twoCheck ? 1 : 0);
                z++)
                if (available(z, one.loc[1]))
                    return 0;
            return new LineMatch(new Location(one.loc[0], one.loc[1]),
                new Location(two.loc[0], two.loc[1]));
        }
    }
    return 0;
}

//Match with two right angle
let doTripleMatch = (one, two) => {
    // Horizon 2 points
    for (let z = -1;
        z <= VERTICAL;
        z++) {
        let oneAttach =
            { loc: [one.loc[0], z] };
        let twoAttach =
            { loc: [two.loc[0], z] };
        let trueMatch =
            checks(one, oneAttach, twoAttach, two);
        if (trueMatch instanceof
            TripleLineMatch)
            return trueMatch;
    }
    // Vertical 2 points
    for (let z = -1;
        z <= HORIZONTAL;
        z++) {
        let oneAttach =
            { loc: [z, one.loc[1]] };
        let twoAttach =
            { loc: [z, two.loc[1]] };
        let trueMatch =
            checks(one, oneAttach, twoAttach, two);
        if (trueMatch instanceof
            TripleLineMatch)
            return trueMatch;
    }
    return 0;
}

let exactElements = (one, two) => {
    return one.imgId ===
        two.imgId;
}

//Match with one right angle
let doDoubleMatch = (one, two) => {
    let oneAttach =
        { loc: [one.loc[0], two.loc[1]] };
    let twoAttach =
        { loc: [two.loc[0], one.loc[1]] };
    let aimOne =
        doSingleMatch(oneAttach, one, true, false);
    let aimTwo =
        doSingleMatch(oneAttach, two, true, false);
    if (isAllStraightConnect(aimOne, aimTwo))
        return new DoubleLineMatch(aimOne,
            aimTwo);
    let secondJointToFirst =
        doSingleMatch(twoAttach, one, true, false);
    let twoTwoMatch =
        doSingleMatch(twoAttach, two, true, false);
    if (isAllStraightConnect(secondJointToFirst, twoTwoMatch))
        return new DoubleLineMatch(secondJointToFirst,
            twoTwoMatch);
    return 0;
}

let legalConnect = (one, two) => {
    if (!available(one.loc[0], one.loc[1]) || !available(two.loc[0], two.loc[1]))
        return 0;
    if (!exactElements(one, two))
        return 0;
    let neighbours = areNeighbours(one, two);
    if (neighbours
        instanceof LineMatch)
        return neighbours;
    let singleMatch = doSingleMatch(one, two);
    if (singleMatch
        instanceof LineMatch)
        return singleMatch;
    let doubleMatch = doDoubleMatch(one, two);
    if (doubleMatch
        instanceof DoubleLineMatch)
        return doubleMatch;
    let tripleMatch = doTripleMatch(one, two);
    if (tripleMatch
        instanceof TripleLineMatch)
        return tripleMatch;
    return 0;
}

let available = (x, y) => {
    return findData(x, y) != null
        && findData(x, y).imgId != null;
}

let checks = (one, oneAttach, twoAttach, two) => {
    let oneOneMatch =
        doSingleMatch(one, oneAttach, false, true);
    let oneTwoMatch =
        doSingleMatch(oneAttach, twoAttach, true, true);
    let twoTwoMatch =
        doSingleMatch(twoAttach, two, true, false);
    if (isAllStraightConnect(oneOneMatch, oneTwoMatch, twoTwoMatch))
        return new TripleLineMatch(oneOneMatch, oneTwoMatch, twoTwoMatch);
    return 0;
}

export { legalConnect, exactElements, doSingleMatch, doDoubleMatch, doTripleMatch, available };
