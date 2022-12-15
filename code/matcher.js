import { FONT, SPACE, LineMatch, TripleLineMatch, DoubleLineMatch } from "./finals.js";

let drawing = document.querySelector("#drawboard");
let data = drawing.getContext("2d");

//Drawing connection line
let connecter = (a, b) => {
    data.beginPath();
    data.strokeStyle = "green";
    data.moveTo(findMiddle(a.x), findMiddle(a.y) + 20);
    data.lineWidth = 2;
    data.lineTo(findMiddle(b.x), findMiddle(b.y) + 20);
    data.stroke();
    data.closePath();
}

let deleteMatch = () => {
    data.clearRect(0, 0, drawing.width, drawing.height);
}

let createMatch = (connect) => {
    data.save();
    if (connect
        instanceof LineMatch)
        simpleMatch(connect);
    if (connect
        instanceof DoubleLineMatch) {
        simpleMatch(connect.one);
        simpleMatch(connect.two);
    }
    if (connect
        instanceof TripleLineMatch) {
        simpleMatch(connect.one);
        simpleMatch(connect.two);
        simpleMatch(connect.three);
    }
}

let simpleMatch = (connect) => {
    connecter(connect.one, connect.two);
}

let findMiddle = (data) => {
    return ((FONT + SPACE)
        * (data + 1)
        + FONT / 2
        + SPACE / 2);
}

export { createMatch, deleteMatch };
