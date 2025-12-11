require("./styles/displayBoard.css");
const createElement = require("./utils/createElement.js");



class DisplayBoard {
    constructor(width, height) {
        this.wallSymbol = "W";
        this.goalSymbol = "G";
        this.startSymbol = "S";
        this.emptySymbol = "O";
        this.visitedSymbol = "visited";
        this.shortestPathSymbol = "path";
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

    setBoard(board) {
        for (let row = 0; row < this.cells.length; row += 1) {
            for (let col = 0; col < this.cells[row].length; col += 1) {
                const newSymbol = board[row][col];
                const cell = this.cells[row][col];
                this.#removeCellClasses(cell);
                cell.classList.add(newSymbol);
            }
        }
    };

    clearBoard() {
        for (let row = 0; row < this.cells.length; row += 1) {
            for (let col = 0; col < this.cells[row].length; col += 1) {
                const cell = this.cells[row][col];
                this.#removeCellClasses(cell);
                cell.classList.add(this.emptySymbol);
            }
        }
    };

    setCell(row, col, classStr) {
        const cell = this.cells[row][col];
        this.#removeCellClasses(cell);
        cell.classList.add(classStr);
    };

    #removeCellClasses(cell) {
        cell.classList.remove(
            this.emptySymbol, 
            this.startSymbol, 
            this.goalSymbol, 
            this.wallSymbol, 
            this.visitedSymbol, 
            this.shortestPathSymbol
        );
    };
};



module.exports = DisplayBoard;