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
        this.startCell = null;
        this.goalCell = null;
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

                if (newClassStr === this.startClassStr) {
                    this.startCell = cell;
                } else if (newClassStr === this.goalClassStr) {
                    this.goalCell = cell;
                }
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
        this.goalCell = null;
        this.startCell = null;
    };

    setCell(row, col, classStr) {
        const cell = this.cells[row][col];
        this.#removeCellClasses(cell);
        cell.classList.add(classStr);

        if (classStr === this.goalClassStr && cell !== this.goalCell) {
            const oldGoalCell = this.goalCell;
            this.goalCell = cell;
            if (oldGoalCell !== null) {
                this.#removeCellClasses(oldGoalCell);
                oldGoalCell.classList.add(this.emptyClassStr);
            }
        } else if (classStr === this.startClassStr) {
            const oldStartCell = this.startCell;
            this.startCell = cell;
            if (oldStartCell !== null) {
                this.#removeCellClasses(oldStartCell);
                oldStartCell.classList.add(this.emptyClassStr);
            }
        }
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