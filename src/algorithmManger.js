const BreadthFirstSearch = require("./searchAlgorithms/breadthFirstSearch.js");
const DepthFirstSearch = require("./searchAlgorithms/depthFirstSearch.js");



class AlgorithmManger {
    constructor(width, height) {
        this.wallSymbol = "W";
        this.goalSymbol = "G";
        this.startSymbol = "S";
        this.emptySymbol = "O";

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
            this.board[row][col] = this.emptySymbol;
            this.startRow = row;
            this.startCol = col;
            return;
        }

        if (symbol === this.goalSymbol) {
            this.board[this.goalRow][this.goalCol] = this.emptySymbol;
        }
        this.board[row][col] = symbol;
    };
};



module.exports = AlgorithmManger;