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

        this.hiddenClass = "hidden";
        this.mazeEditClass = "editing";
        this.playPauseBtn = document.querySelector(".play-pause-btn");
        this.speedBtn = document.querySelector(".speed-btn");
        this.bfsBtn = document.querySelector(".bfs-btn");
        this.dfsBtn = document.querySelector(".dfs-btn");
        this.mazeWrapper = document.querySelector(".maze-wrapper");
        this.boardDiv = document.querySelector(".board");
        this.searchSpan = document.querySelector(".search-type");
        this.stepsSpan = document.querySelector(".total-steps");
        this.neededStepsSpan = document.querySelector(".needed-steps");
        this.efficiencySpan = document.querySelector(".efficiency");
        this.editModal = document.querySelector(".edit-modal");

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

        this.editing = false;
        this.editSymbol = null;
        this.editModalShowing = false;
        this.drawing = false;

        this.scrubBtnsCallBack = this.scrubBtnsCallBack.bind(this);
        this.editBtnsCallBack = this.editBtnsCallBack.bind(this);
        this.showSearchStats = this.showSearchStats.bind(this);
        this.editModalCallBack = this.editModalCallBack.bind(this);
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
        if (!target.matches("button") || this.editModalShowing) {
            return;
        }

        if (target.matches(".bfs-btn") && !this.editing) {
            if (this.breadthFirstSearch) {
                return;
            }

            if (this.searchPath !== null) {
                this.display.clearSearchPath(this.searchPath);
            }
            this.#resetSearch();
            this.breadthFirstSearch = true;
            this.#toggleSearchBtnsActiveClass();

        } else if (target.matches(".dfs-btn") && !this.editing) {
            if (!this.breadthFirstSearch) {
                return;
            }

            if (this.searchPath !== null) {
                this.display.clearSearchPath(this.searchPath);
            }
            this.#resetSearch();
            this.breadthFirstSearch = false;
            this.#toggleSearchBtnsActiveClass();

        } else if (target.matches(".randomize-btn") && !this.editing) {
            this.#resetSearch();
            this.clearSearchStats();
            this.#randomizeGrid();

        } else if (target.matches(".edit-btn")) {
            this.editModal.classList.remove(this.hiddenClass);
            this.editModalShowing = true;
            if (this.running) {
                this.running = false;
                this.#togglePlayPauseBtnClass();
            }
        }
    };

    scrubBtnsCallBack(event) {
        const target = (event.target.matches("button")) ? event.target : event.target.parentElement;
        if (!target.matches("button") || this.editing || this.editModalShowing) {
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

    editModalCallBack(event) {
        const target = (event.target.matches("button")) ? event.target : event.target.parentElement;
        if (target.matches(".exit-btn")) {
            this.editModal.classList.add(this.hiddenClass);
            this.editModalShowing = false;

        } else if (target.matches(".clear-btn")) {
            this.#resetSearch();
            this.display.clearBoard();
            this.algorithmManager.resetBoard();
            this.clearSearchStats();
            this.editModal.classList.add(this.hiddenClass);
            this.editModalShowing = false;

        } else if (target.matches(".wall-btn, .goal-btn, .start-btn, .empty-btn")) {
            if (this.searchPath !== null) {
                this.display.clearSearchPath(this.searchPath);
            }
            this.#resetSearch();
            this.clearSearchStats();
            this.editModal.classList.add(this.hiddenClass);
            this.mazeWrapper.classList.add(this.mazeEditClass);
            this.editSymbol = target.dataset.symbol;
            this.editing = true;
            this.editModalShowing = false;
        }
    };

    tileEditingCallBack(event) {
        const target = event.target;
        if (!target.matches(".cell")) {
            return;
        }
    };

    #togglePlayPauseBtnClass() {
        this.playPauseBtn.classList.toggle(this.playClass);
        this.playPauseBtn.classList.toggle(this.pauseClass);
    };

    #toggleSearchBtnsActiveClass() {
        this.bfsBtn.classList.toggle("active");
        this.dfsBtn.classList.toggle("active");
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
        this.reversePlay = false;
        this.#setSpeedBtnClass();
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
            setTimeout(this.showSearchStats(), 0);
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

    showSearchStats() {
        const searchType = (this.breadthFirstSearch) ? "Breadth First Search" : "Depth First Search";
        this.searchSpan.textContent = searchType;
        this.stepsSpan.textContent = this.searchPath.length;
        this.neededStepsSpan.textContent = (this.directPath.length !== 0) ? this.directPath.length : "N/A";

        const efficiency = Math.round((this.directPath.length / this.searchPath.length) * 10000) / 100;
        const efficiencyPercentage = (efficiency !== 0) ? `${efficiency}%`: "N/A"
        this.efficiencySpan.textContent = efficiencyPercentage;
    };

    clearSearchStats() {
        this.searchSpan.textContent = "";
        this.stepsSpan.textContent = "";
        this.neededStepsSpan.textContent = "";
        this.efficiencySpan.textContent = "";
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

    #editCell(cell) {
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);
        this.display.setCell(row, col, this.editSymbol);
        this.algorithmManager.setCell(row, col, this.editSymbol);
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

        this.editModal.addEventListener("click", this.editModalCallBack);

        document.addEventListener("contextmenu", (event) => {
            if (this.editing) {
                event.preventDefault();
                this.editing = false;
                this.drawing = false;
                this.mazeWrapper.classList.remove(this.mazeEditClass);
            }
        });

        this.boardDiv.addEventListener("mousedown", (event) => {
            if (!event.target.matches(".cell") || !this.editing || event.button !== 0) {
                return;
            }
            this.drawing = true;
            this.#editCell(event.target);
        });

        document.addEventListener("mouseup", (event) => {
            if (!this.editing || event.button !== 0) {
                return;
            }
            this.drawing = false;
        });

        this.boardDiv.addEventListener("mouseover", (event) => {
            if (!this.editing || !event.target.matches(".cell") || !this.drawing) {
                return;
            }
            this.#editCell(event.target);
        });

        this.boardDiv.addEventListener("dragstart", function(event) {
            event.preventDefault();
        })
    };
};



module.exports = SearchAlgorithmInterface;