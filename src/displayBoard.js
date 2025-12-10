require("./styles/displayBoard.css");
const createElement = require("./utils/createElement.js");



class DisplayBoard {
    constructor(width, height) {
        this.wallSymbol = "W";
        this.goalSymbol = "G";
        this.startSymbol = "S";
        this.emptySymbol = "O";
        this.boardDiv = document.querySelector(".board");
        this.cells = this.#fillBoard(width, height);
    };

    #fillBoard(width, height) {
        const cells = [];
        for (let row = 0; row < height; row += 1) {
            const cellRow = [];
            for (let col = 0; col < width; col += 1) {
                const cell = this.#createCell(row, col, this.emptySymbol);
                this.boardDiv.appendChild(cell);
                cellRow.push(cell);
            }
            cells.push(cellRow);
        }
        return cells;
    };

    #createCell(row, col, symbol) {
        const cell = createElement("div", null, "cell", symbol);
        cell.dataset.row = row;
        cell.dataset.col = col;
        return cell;
    };
};



module.exports = DisplayBoard;