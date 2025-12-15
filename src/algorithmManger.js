const BreadthFirstSearch = require("./searchAlgorithms/breadthFirstSearch.js");
const DepthFirstSearch = require("./searchAlgorithms/depthFirstSearch.js");



class AlgorithmManger {
    constructor(width, height, emptySymbol, wallSymbol, startSymbol, goalSymbol) {
        this.emptySymbol = emptySymbol;
        this.wallSymbol = wallSymbol;
        this.startSymbol = startSymbol;
        this.goalSymbol = goalSymbol;

        this.bfs = new BreadthFirstSearch(this.wallSymbol, this.goalSymbol);
        this.dfs = new DepthFirstSearch(this.wallSymbol, this.goalSymbol);

        this.board = this.#createBoard(width, height);

        this.startRow = null;
        this.startCol = null;
        this.goalRow = null;
        this.goalCol = null;
    };

    #createBoard(width, height) {
        const board = [];
        for (let row = 0; row < height; row += 1) {
            const boardRow = [];
            for (let col = 0; col < width; col += 1) {
                boardRow.push(this.emptySymbol);
            }
            board.push(boardRow);
        }
        return board;
    };

    breadthFirstSearch() {
        if (this.startRow === null || this.startCol === null) {
            return null;
        }

        const bfsPath = this.bfs.breadthFirstPath(this.board, this.startRow, this.startCol);
        const shortestPath = this.dfs.shortestPath(this.board, this.startRow, this.startCol);
        return [bfsPath, shortestPath];
    };

    depthFirstSearch() {
        if (this.startRow === null || this.startCol === null) {
            return null;
        }

        const dfsPath = this.dfs.dfsPath(this.board, this.startRow, this.startCol);
        const shortestPath = this.dfs.shortestPath(this.board, this.startRow, this.startCol);
        return [dfsPath, shortestPath];
    };

    resetBoard() {
        for (let row = 0; row < this.board.length; row += 1) {
            for (let col = 0; col < this.board[row].length; col += 1) {
                this.board[row][col] = this.emptySymbol;
            }
        }
        this.startRow = null;
        this.startCol = null;
        this.goalRow = null;
        this.goalCol = null;
    };

    setBoard(board) {
        for (let row = 0; row < this.board.length; row += 1) {
            for (let col = 0; col < this.board[row].length; col += 1) {
                const newSymbol = board[row][col];
                if (newSymbol === this.startSymbol) {
                    this.startRow = row;
                    this.startCol = col;
                    this.board[row][col] = this.emptySymbol;
                    continue;
                }
                
                if (newSymbol === this.goalSymbol) {
                    this.goalRow = row;
                    this.goalCol = col;
                } 
                this.board[row][col] = newSymbol;
            }
        }
    };

    setCell(row, col, symbol) {
        if (symbol === this.startSymbol) {
            this.startRow = row;
            this.startCol = col;
            this.board[this.startRow][this.startCol] = this.emptySymbol;
            return;
        }
        if (symbol === this.goalSymbol) {
            if (this.goalRow !== null) {
                this.board[this.goalRow][this.goalCol] = this.emptySymbol;
            }
            this.goalRow = row;
            this.goalCol = col;
            this.board[this.goalRow][this.goalCol] = this.goalSymbol;
            return;
        }

        if (row === this.startRow && col === this.startCol) {
            this.startRow = null;
            this.startCol = null;
        } else if (row === this.goalRow && col === this.goalCol) {
            this.goalRow = null;
            this.goalCol = null;
        }
        this.board[row][col] = symbol;
    };

    validStart() {
        return this.startCol !== null && this.startRow !== null;
    };
};



module.exports = AlgorithmManger;