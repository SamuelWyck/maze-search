const DisplayBoard = require("./displayBoard.js");
const AlgorithmManger = require("./algorithmManger.js");
const templates = require("./mazeTemplates.js");



class SearchAlgorithmInterface {
    constructor() {
        const boardWidth = 20;
        const boardHeight = 20;
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
            this.goalSymbol,
            this.startSymbol
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

        this.mazeTemplates = templates;
        this.templateIndex = 0;
        this.display.setBoard(this.mazeTemplates[this.templateIndex]);
        this.algorithmManager.setBoard(this.mazeTemplates[this.templateIndex]);

        this.breadthFirstSearch = true;
        this.running = false;
        this.speeds = [500, 250, 100, 0]; //speed in miliseconds
        this.speedIndex = 0;

        this.searchPath = null;
        this.searchPathIndex = 0;
        this.directPath = null;

        this.scrubBtnsCallBack = this.scrubBtnsCallBack.bind(this);
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

    scrubBtnsCallBack(event) {
        const target = (event.target.matches("button")) ? event.target : event.target.parentElement;
        if (!target.matches("button")) {
            return;
        }

        if (target.matches("back-btn")) {
            if (!this.algorithmManager.validStart()) {
                return;
            }
            if (this.searchPath === null || this.directPath == null) {
                this.#generateSearch();
            }
        } else if (target.matches("speed-btn")) {

        } else if (target.matches("play-pause-btn")) {
            if (!this.algorithmManager.validStart()) {
                return;
            }
            if (this.searchPath === null || this.directPath == null) {
                this.#generateSearch();
            }
        } else if (target.matches("forward-btn")) {
            if (!this.algorithmManager.validStart()) {
                return;
            }
            if (this.searchPath === null || this.directPath == null) {
                this.#generateSearch();
            }
        }
    };

    initializeInterface() {
        const scrubBtnsDiv = document.querySelector(".search-movement");
        scrubBtnsDiv.addEventListener("click", this.scrubBtnsCallBack);
    };
};



module.exports = SearchAlgorithmInterface;