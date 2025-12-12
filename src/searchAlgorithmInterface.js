const DisplayBoard = require("./displayBoard.js");
const AlgorithmManger = require("./algorithmManger.js");
const MazeGenerator = require("./mazeGenerator.js");



class SearchAlgorithmInterface {
    constructor() {
        const boardWidth = 19;
        const boardHeight = 19;
        this.emptySymbol = "O";
        this.wallSymbol = "W";
        this.goalSymbol = "G";
        this.startSymbol = "S";
        this.visitedSymbol = "visited";
        this.shortestPathSymbol = "path";
        this.boardDiv = document.querySelector(".board");

        this.algorithmManager = new AlgorithmManger(
            boardWidth, 
            boardHeight,
            this.emptySymbol,
            this.wallSymbol,
            this.startSymbol,
            this.goalSymbol
        );
        this.display = new DisplayBoard(
            boardWidth,
            boardHeight,
            this.emptySymbol,
            this.wallSymbol,
            this.startSymbol,
            this.goalSymbol,
            this.visitedSymbol,
            this.shortestPathSymbol,
            this.boardDiv
        );
        this.mazeGenerator = new MazeGenerator(
            boardWidth, 
            boardHeight, 
            this.emptySymbol, 
            this.wallSymbol, 
            this.startSymbol, 
            this.goalSymbol
        );

        this.#randomizeGrid();

        this.breadthFirstSearch = true;
        this.running = false;
        this.speeds = [500, 250, 100, 0]; //speed in miliseconds
        this.speedIndex = 0;
        this.reversePlay = false;

        this.searchPath = null;
        this.searchPathIndex = 0;
        this.directPath = null;
        this.history = [];

        this.scrubBtnsCallBack = this.scrubBtnsCallBack.bind(this);
        this.autoPlay = this.autoPlay.bind(this);
        this.initializeInterface();
    };

    #generateSearch() {
        let searchPath = null;
        let directPath = null;
        if (this.breadthFirstSearch) {
            [searchPath, directPath] = this.algorithmManager.breadthFirstSearch();
        } else {
            [searchPath, directPath] = this.algorithmManager.depthFirstSearch();
        }
        this.searchPath = searchPath;
        this.directPath = directPath;
        this.searchPathIndex = 0;
    };

    #randomizeGrid() {
        const maze = this.mazeGenerator.generateMaze();
        this.display.setBoard(maze);
        this.algorithmManager.setBoard(maze);
    };

    scrubBtnsCallBack(event) {
        const target = (event.target.matches("button")) ? event.target : event.target.parentElement;
        if (!target.matches("button")) {
            return;
        }

        if (target.matches(".back-btn")) {
            if (!this.algorithmManager.validStart()) {
                return;
            }
            if (this.running) {
                this.running = false;
                return;
            }
            this.#undoSearchStep();
        } else if (target.matches(".speed-btn")) {
            this.speedIndex += 1;
            if (this.speedIndex === this.speeds.length) {
                this.speedIndex = 0;
                this.reversePlay = !this.reversePlay;
            }

        } else if (target.matches(".play-pause-btn")) {
            if (!this.algorithmManager.validStart()) {
                return;
            }
            if (this.reversePlay && this.history.length === 0) {
                return;
            }

            if (this.searchPath === null || this.directPath == null) {
                this.#generateSearch();
            }
            if (this.running) {
                this.running = false;
            } else {
                this.running = true;
                this.autoPlay();
            }
        } else if (target.matches(".forward-btn")) {
            if (!this.algorithmManager.validStart()) {
                return;
            }
            if (this.running) {
                this.running = false;
                return;
            }
            if (this.searchPath === null || this.directPath == null) {
                this.#generateSearch();
            }

            this.#showVisitedCell();
        }
    };

    #undoSearchStep() {
        if (this.history.length === 0) {
            return;
        }

        this.searchPathIndex -= 1;
        const undoFunction = this.history.pop();
        undoFunction();
    };

    #showVisitedCell() {
        this.searchPathIndex += 1;
        if (this.searchPathIndex > this.searchPath.length) {
            this.searchPathIndex -= 1;
            return;
        }
        if (this.searchPathIndex === this.searchPath.length) {
            this.#showShortestPath();
            return;
        }

        const position = this.searchPath[this.searchPathIndex];
        const [row, col] = position;
        this.display.setCell(row, col, this.visitedSymbol);

        const undoSymbol = (this.searchPathIndex === this.searchPath.length - 1) ? this.goalSymbol : this.emptySymbol;
        const undoFunction = () => {
            this.display.setCell(row, col, undoSymbol);
        };
        this.history.push(undoFunction);
    };

    #showShortestPath() {
        for (let position of this.directPath) {
            const [row, col] = position;
            this.display.setCell(row, col, this.shortestPathSymbol);
        }

        const undoFunction = () => {
            for (let position of this.directPath) {
                const [row, col] = position;
                this.display.setCell(row, col, this.visitedSymbol);
            }
        };
        this.history.push(undoFunction);
    };

    autoPlay() {
        if (this.reversePlay) {
            this.searchPathIndex -= 1;
            const undoFunction = this.history.pop();
            undoFunction();
        } else {
            this.#showVisitedCell();
        }

        const stopPlaying = this.searchPathIndex === this.searchPath.length || this.searchPathIndex === 0;
        if (stopPlaying) {
            this.running = false;
        }

        if (this.running) {
            setTimeout(this.autoPlay, this.speeds[this.speedIndex]);
        }
    };

    initializeInterface() {
        const scrubBtnsDiv = document.querySelector(".search-movement");
        scrubBtnsDiv.addEventListener("click", this.scrubBtnsCallBack);
    };
};



module.exports = SearchAlgorithmInterface;