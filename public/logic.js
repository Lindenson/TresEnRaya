//игра
let turn = "X";
let counter = 0;
let stopPlaying = false;

class Figure {
    constructor(letter = "", figure) {
        this.letter = letter;
        this.figure = figure;
    }
}
let matrix = [
    [new Figure(), new Figure(), new Figure()],
    [new Figure(), new Figure(), new Figure()],
    [new Figure(), new Figure(), new Figure()],
];

//проверка победителя
function checkWinner() {
    let checkSum = turn.repeat(3); // "XXX" or "OOO"

    //check row
    for (let i = 0; i < 3; i++) {
        let sum = matrix[0][i].letter + matrix[1][i].letter + matrix[2][i].letter;
        if (sum === checkSum) {
            return [[0, i],[1, i],[2, i]];
        }
    }
    //check column
    for (let i = 0; i < 3; i++) {
        let sum = matrix[i][0].letter + matrix[i][1].letter + matrix[i][2].letter;
        if (sum === checkSum) {
            return [[i, 0],[i, 1],[i, 2]];
        }
    }

    //check 1st diagonal
    let sum = "";
    for (let i = 0; i < 3; i++) {
        sum = sum + matrix[i][i].letter;
    }
    if (sum === checkSum) {
        return [[0, 0],[1, 1],[2, 2]];
    }

    //check 2st diagonal
    sum = "";
    for (let i = 0; i < 3; i++) {
        sum = sum + matrix[2 - i][i].letter;
    }
    if (sum === checkSum) {
        return [[0, 2],[1, 1],[2, 0]];
    }
    return null;
}

function move(col, row) {
    if (stopPlaying) return; // game over
    if (matrix[col][row]?.letter) return; // cell is busy

    matrix[col][row].letter = turn;
    counter++;

    let winner = checkWinner();
    if (winner || counter > 8) {
        stopPlaying = true;
        showFinalMessage(winner);
    }

    if (turn === "X") {
        matrix[col][row].figure = createXFalling(col, row);
        turn = "O";
    } else {
        matrix[col][row].figure = createOFalling(col, row);
        turn = "X";
    }

    if (winner) {
        demonstrateWinner(winner);
    }
}

function demonstrateWinner(winner) {
        let figures = winner.map(w => {
            let [col, row] = w;
            return matrix[col][row].figure;
        })
        makeFiguresJump(figures)
}

function showFinalMessage(winner) {
    if (winner) {
        createFallingText(`${turn} won!`);
    }
    else  {
        createFallingText(` Draw!`);
    }
}


