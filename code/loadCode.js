import { VERTICAL, HORIZONTAL, DIFFERENT, PAIR, IMAGESIZE, FONT, SPACE, DELAY, LineMatch, TripleLineMatch, DoubleLineMatch } from "./finals.js";
import { deleteMatch, createMatch } from "./matcher.js";
import { elementFinder, findData } from "./checker.js";
import { doSingleMatch, available, doTripleMatch, doDoubleMatch, legalConnect } from "./logic.js";

let getArray = () => {
    let data = [];
    for (let q = 0;
        q < PAIR;
        q++) {
        data.push(q % DIFFERENT);
        data.push(q % DIFFERENT);
    }
    for (let q = data.length - 1;
        q > 0;
        q--) {
        let w = Math.floor(Math.random() * (q + 1));
        let tem = data[q];
        data[q] = data[w];
        data[w] = tem;
    }
    return data;
}

let createMatrix = () => {
    let data = document.createElement("table");
    data.style.borderSpacing = `${SPACE}px`;
    return data;
}

//Matrix Creation
let arrayToMat = (array, elements) => {
    let mat = [];
    for (let q = 0, k = -1;
        q < array.length;
        q++) {
        if (q % elements
            === 0) {
            k++;
            mat[k]
                = [];
        }
        mat[k].push(array[q]);
    }
    return mat;
}

let createField = () => {
    let data = document.createElement("td");
    data.style.width = `${FONT}px`;
    data.style.height = `${FONT}px`;
    return data;
}

//Creating table matrix for board
let table = () => {
    let table = createMatrix();
    let tablebody = document.createElement("tbody");
    let display = arrayToMat(getArray(), HORIZONTAL);
    for (let q = 0;
        q < VERTICAL;
        q++) {
        let trow = document.createElement("tr");
        for (let w = 0;
            w < HORIZONTAL;
            w++) {
            let tdata = createField();
            tdata.loc = [w, q];
            tdata.imgId = display[q][w];
            trow.appendChild(tdata);
        }
        tablebody.appendChild(trow);
    }
    table.appendChild(tablebody);
    return table;
}

//Generate image to display for each tile
let showData = (x, size) => {
    let data = document.createElement("img");
    let inner = undefined;
    if (x == null)
        return data;
    data.style.width = `${size}px`;
    data.style.height = `${size}px`;
    data.src = `icons/${x}.png`;
    data.draggable = false;
    return data;
}

//Rearrange the board for new game
let rearrange = () => {
    let tdArray = elementFinder("td");
    for (let q = tdArray.length - 1;
        q > 0;
        q--) {
        let w = Math.floor(Math.random() * (q + 1));
        let tem = tdArray[q];
        tdArray[q] = tdArray[w];
        tdArray[w] = tem;
    }
    document.querySelector("#gameboard").innerHTML = "";
    let table = createMatrix();
    let tablebody = document.createElement("tbody");
    let display = arrayToMat(tdArray, HORIZONTAL);
    for (let q = 0;
        q < VERTICAL;
        q++) {
        let trow = document.createElement("tr");
        for (let w = 0;

            w < HORIZONTAL; w++) {
            let tdata = createField();
            tdata.loc = [w, q];
            tdata.imgId = display[q][w].imgId;
            if (display[q][w].imgId
                == null)
                tdata.className = "hidden";
            trow.appendChild(tdata);
        }
        tablebody.appendChild(trow);
    }
    table.appendChild(tablebody);
    document.querySelector("#gameboard").appendChild(table);
}

let eventListenerForCells = () => {
    document.querySelectorAll("td").forEach((tdata) => {
        tdata.removeEventListener("click", tdata.currentEventListener);
        let event = () => {
            clicked(tdata.loc[0], tdata.loc[1]);
        };
        tdata.addEventListener("click", event);
        tdata.currentEventListener = event;
    });
}

let expiry = null;
let notify = (a, b) => {
    if (expiry != null)
        clearTimeout(expiry);
    popup(a);
    if (b)
        expiry = setTimeout(() => {
            disablePopup();
        });
}

//Display cells usign Images
let showCells = () => {
    document.querySelectorAll("td").forEach((tdata) => {
        tdata.innerHTML = "";
        tdata.appendChild(showData(tdata.imgId, IMAGESIZE));
    });
}

let popup = (a) => {
    let data = document.querySelector('#notification').innerHTML = a;
    let winner = document.querySelector('#winner');
    winner.appendChild(showData('winner0', 200));
}

let currentSelection = () => {
    let currentPosition = null;
    document.querySelectorAll("td").forEach((ele) => {
        if (ele.className.includes("current"))
            currentPosition = ele;
    });
    return currentPosition;
}

let disablePopup = () => {
    document.querySelector('#notification').innerHTML = "";
}

let clicked = (a, b) => {
    if (!available(a, b))
        return;
    if (checkFirst())
        checkSecond(a, b);
    else
        firstClicked(a, b);
}

let firstClicked = (a, b) => {
    findData(a, b).className = "current";
}

let checkSecond = (a, b) => {
    let f = currentSelection();
    let s = findData(a, b);
    if (f == null
        || s == null)
        return;
    if (f === s) {
        f.className = "";
        return;
    }
    let same = legalConnect(f, s);
    if (same instanceof LineMatch ||
        same instanceof DoubleLineMatch ||
        same instanceof TripleLineMatch) {
        matached(f, s, same);
    }
    else
        diff(f, s);
}

let matached = (f, s, x) => {
    createMatch(x);
    setTimeout(() => {
        delRm(f);
        delRm(s);
        deleteMatch();
        if (finishMatches()) {
            notify("Congrats winner!", false);
            showCells();
        }
        else {
            reset();
        }
    }, DELAY);
}

let diff = (f, s) => {
    f.className = "";
    s.className = "current";
}

let delRm = (x) => {
    x.className = "hidden";
    x.imgId = null;
}

let finishMatches = () => {
    let tdArray = elementFinder("td");
    for (let tdata of tdArray) {
        if (tdata.imgId != null
            || !tdata.className.includes("hidden"))
            return 0;
    }
    return 1;
}

let checkFirst = () => {
    let curr = false;
    document.querySelectorAll("td").forEach((ele) => {
        if (ele.className.includes("current"))
            curr = true;
    });
    return curr;
}

let findM = () => {
    let tdArray = elementFinder("td");
    for (let q of tdArray) {
        for (let w of tdArray) {
            if (legalConnect(q, w))
                return 1;
        }
    }
    return 0;
}

let reset = () => {
    while (!findM())
        rearrange();
    showCells();
    eventListenerForCells();
}

let start = () => {
    let data = document.querySelector("#gameboard");
    data.innerHTML = "";
    data.appendChild(table());

    data.style.width = `${HORIZONTAL * (FONT + SPACE) + SPACE}px`;
    data.style.height = `${VERTICAL * (FONT + SPACE) + SPACE}px`;

    let newData = document.querySelector("#drawboard");

    newData.style.width = `${(HORIZONTAL + 2) * (FONT + SPACE)}px`;
    newData.style.height = `${(VERTICAL + 2) * (FONT + SPACE)}px`;

    newData.width = (HORIZONTAL + 2)
        * (FONT + SPACE);
    newData.height = (VERTICAL + 2)
        * (FONT + SPACE);

    reset();
    disablePopup();
}

const view = () => {
    window.getArray = getArray;
    window.findData = findData;
    window.available = available;
    window.doSingleMatch = doSingleMatch;
    window.doDoubleMatch = doDoubleMatch;
    window.doTripleMatch = doTripleMatch;
    window.delRm = delRm;
    window.finishMatches = finishMatches;
    window.reset = reset;
    window.rearrange = rearrange;
    window.showCells = showCells;
    window.eventListenerForCells = eventListenerForCells;
    window.createMatch = createMatch;
    window.deleteMatch = deleteMatch;
}

start();
view();
