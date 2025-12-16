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
        this.symbolList = [
            this.emptyClassStr = emptyClassStr,
            this.wallClassStr = wallClassStr,
            this.startClassStr = startClassStr,
            this.goalClassStr = goalClassStr,
            this.visitedClassStr = visitedClassStr,
            this.shortestPathClassStr = shortestPathClassStr
        ];

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
        const removedClass = this.#removeCellClasses(cell);
        cell.classList.add(classStr);

        const searchPathEdit = classStr === this.visitedClassStr || classStr === this.shortestPathClassStr;

        if (classStr === this.goalClassStr && cell !== this.goalCell) {
            const oldGoalCell = this.goalCell;
            this.goalCell = cell;
            if (oldGoalCell !== null) {
                this.#removeCellClasses(oldGoalCell);
                oldGoalCell.classList.add(this.emptyClassStr);
            }
        } else if (classStr === this.startClassStr && cell !== this.startCell) {
            const oldStartCell = this.startCell;
            this.startCell = cell;
            if (oldStartCell !== null) {
                this.#removeCellClasses(oldStartCell);
                oldStartCell.classList.add(this.emptyClassStr);
            }
        } else if (cell === this.goalCell && !searchPathEdit && classStr !== this.goalClassStr) {
            this.goalCell = null;
        } else if (cell === this.startCell && !searchPathEdit && classStr !== this.startClassStr) {
            this.startCell = null;
        }

        return removedClass;
    };

    #removeCellClasses(cell) {
        let removedClass = null;
        for (let symbolClass of this.symbolList) {
            if (cell.classList.contains(symbolClass)) {
                removedClass = symbolClass;
                break;
            }
        }
        cell.classList.remove(removedClass);
        return removedClass;
    };

    clearSearchPath(searchPath, directPath) {
        for (let position of directPath) {
            const [row, col] = position;
            const cell = this.cells[row][col];

            let classStr = this.emptyClassStr;
            if (cell === this.startCell) {
                classStr = this.startClassStr;
            } else if (cell === this.goalCell) {
                classStr = this.goalClassStr;
            }
            this.setCell(row, col, classStr);
        }

        for (let position of searchPath) {
            const [row, col] = position;
            const cell = this.cells[row][col];

            let classStr = this.emptyClassStr;
            if (cell === this.startCell) {
                classStr = this.startClassStr;
            } else if (cell === this.goalCell) {
                classStr = this.goalClassStr;
            }
            this.setCell(row, col, classStr);
        }
    };
};



module.exports = DisplayBoard;