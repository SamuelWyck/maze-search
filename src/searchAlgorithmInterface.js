require("./styles/interface.css");
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
        this.playClass = "play";
        this.pauseClass = "pause";
        this.playPauseBtn = document.querySelector(".play-pause-btn");
        this.speedBtn = document.querySelector(".speed-btn");
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

        this.speedBtnClassMap = {};
        this.speedBtnClassMap[false] = {500: "one", 250: "two", 100: "five", 0: "max"};
        this.speedBtnClassMap[true] = {500: "-one", 250: "-two", 100: "-five", 0: "-max"};

        this.searchPath = null;
        this.searchPathIndex = 0;
        this.directPath = null;
        this.history = [];

        this.scrubBtnsCallBack = this.scrubBtnsCallBack.bind(this);
        this.editBtnsCallBack = this.editBtnsCallBack.bind(this);
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

    editBtnsCallBack(event) {
        const target = (event.target.matches("button")) ? event.target : event.target.parentElement;
        if (!target.matches("button")) {
            return;
        }

        if (target.matches(".bfs-btn")) {
            if (this.breadthFirstSearch) {
                return;
            }

            if (this.searchPath !== null) {
                this.display.clearSearchPath(this.searchPath);
            }
            this.#resetSearch();
            this.breadthFirstSearch = true;

        } else if (target.matches(".dfs-btn")) {
            if (!this.breadthFirstSearch) {
                return;
            }

            if (this.searchPath !== null) {
                this.display.clearSearchPath(this.searchPath);
            }
            this.#resetSearch();
            this.breadthFirstSearch = false;

        } else if (target.matches(".randomize-btn")) {
            this.#resetSearch();
            this.#randomizeGrid();

        } else if (target.matches("edit-btn")) {

        }
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
                this.#togglePlayPauseBtnClass();
                return;
            }

            this.#undoSearchStep();

        } else if (target.matches(".speed-btn")) {
            this.speedIndex += 1;
            if (this.speedIndex === this.speeds.length) {
                this.speedIndex = 0;
                this.reversePlay = !this.reversePlay;
            }
            this.#setSpeedBtnClass();

        } else if (target.matches(".play-pause-btn")) {
            if (!this.algorithmManager.validStart()) {
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
            this.#togglePlayPauseBtnClass();

        } else if (target.matches(".forward-btn")) {
            if (!this.algorithmManager.validStart()) {
                return;
            }
            if (this.running) {
                this.running = false;
                this.#togglePlayPauseBtnClass();
                return;
            }

            if (this.searchPath === null || this.directPath == null) {
                this.#generateSearch();
            }
            this.#showVisitedCell();
        }
    };

    #togglePlayPauseBtnClass() {
        this.playPauseBtn.classList.toggle(this.playClass);
        this.playPauseBtn.classList.toggle(this.pauseClass);
    };

    #setSpeedBtnClass() {
        const speedBtnClasses = ["one", "two", "five", "max", "-one", "-two", "-five", "-max"];
        this.speedBtn.classList.remove(...speedBtnClasses);
        const currentSpeed = this.speeds[this.speedIndex];
        const newClass = this.speedBtnClassMap[this.reversePlay][currentSpeed];
        this.speedBtn.classList.add(newClass);
    };

    #resetSearch() {
        this.speedIndex = 0;
        this.#setSpeedBtnClass();
        this.reversePlay = false;
        this.searchPath = null;
        this.searchPathIndex = 0;
        this.directPath = null;
        this.history = [];
        if (this.running) {
            this.#togglePlayPauseBtnClass();
            this.running = false;
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
        if (!this.running) {
            return;
        }

        if (this.reversePlay) {
            this.#undoSearchStep();
        } else {
            this.#showVisitedCell();
        }

        const stopPlaying = this.searchPathIndex === this.searchPath.length || this.searchPathIndex === 0;
        if (stopPlaying) {
            this.running = false;
            this.#togglePlayPauseBtnClass();
        }

        if (this.running) {
            setTimeout(this.autoPlay, this.speeds[this.speedIndex]);
        }
    };

    initializeInterface() {
        const scrubBtnsDiv = document.querySelector(".search-movement");
        scrubBtnsDiv.addEventListener("click", this.scrubBtnsCallBack);

        const editBtnsDiv = document.querySelector(".search-controls");
        editBtnsDiv.addEventListener("click", this.editBtnsCallBack);
    };
};



module.exports = SearchAlgorithmInterface;