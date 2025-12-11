require("./styles/displayBoard.css");
const createElement = require("./utils/createElement.js");



class DisplayBoard {
    constructor(
        width, 
        height, 
        emptyClassStr, 
        wallClassStr,
        startClassStr, 
        goalClassStr, 
        visitedClassStr, 
        shortestPathClassStr,
        boardDiv
    ) {
        this.emptyClassStr = emptyClassStr;
        this.wallClassStr = wallClassStr;
        this.startClassStr = startClassStr;
        this.goalClassStr = goalClassStr;
        this.visitedClassStr = visitedClassStr;
        this.shortestPathClassStr = shortestPathClassStr;
        this.boardDiv = boardDiv;
        this.cells = this.#fillBoard(width, height);
    };

    #fillBoard(width, height) {
        const cells = [];
        for (let row = 0; row < height; row += 1) {
            const cellRow = [];
            for (let col = 0; col < width; col += 1) {
                const cell = this.#createCell(row, col, this.emptyClassStr);
                this.boardDiv.appendChild(cell);
                cellRow.push(cell);
            }
            cells.push(cellRow);
        }
        return cells;
    };

    #createCell(row, col, classStr) {
        const cell = createElement("div", null, "cell", classStr);
        cell.dataset.row = row;
        cell.dataset.col = col;
        return cell;
    };

    setBoard(board) {
        for (let row = 0; row < this.cells.length; row += 1) {
            for (let col = 0; col < this.cells[row].length; col += 1) {
                const newClassStr = board[row][col];
                const cell = this.cells[row][col];
                this.#removeCellClasses(cell);
                cell.classList.add(newClassStr);
            }
        }
    };

    clearBoard() {
        for (let row = 0; row < this.cells.length; row += 1) {
            for (let col = 0; col < this.cells[row].length; col += 1) {
                const cell = this.cells[row][col];
                this.#removeCellClasses(cell);
                cell.classList.add(this.emptyClassStr);
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
            this.emptyClassStr, 
            this.startClassStr, 
            this.goalClassStr, 
            this.wallClassStr, 
            this.visitedClassStr, 
            this.shortestPathClassStr
        );
    };
};



module.exports = DisplayBoard;