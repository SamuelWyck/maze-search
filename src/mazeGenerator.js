class MazeGenerator {
    constructor(width, height, emptySymbol, wallSymbol) {
        this.width = width;
        this.height = height;
        this.evenWidth = width % 2 === 0;
        this.emptySymbol = emptySymbol;
        this.wallSymbol = wallSymbol;
    };

    generateMaze() {
        const grid = this.#generateStartingGrid();

        const visited = new Set();

        let startRow = null;
        let startCol = null;
        while (startRow == null || startCol === null) {
            let row = this.#randInt(0, grid.length);
            let col = this.#randInt(0, grid[0].length);
            if (grid[row][col] === this.wallSymbol) {
                continue;
            }
            startRow = row;
            startCol = col;
        }
        const firstPathLength = this.#randInt(1, grid.length / 2);

        this.#generatePaths(grid, startRow, startCol, firstPathLength, visited);
        
        return grid;
    };

    #generatePaths(grid, row, col, pathLength, visited) {
        const rowValid = 0 <= row && row < grid.length;
        const colValid = 0 <= col && col < grid[0].length;
        if (!rowValid || !colValid) {
            return false;
        }
        if (pathLength === 0) {
            return false;
        }
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return false;
        }

        visited.add(key);

        let neighbors = [
            [row - 2, col, [row - 1, col]], [row + 2, col, [row + 1, col]],
            [row, col - 2, [row, col - 1]], [row, col + 2, [row, col + 1]]
        ];
        let firstNeighbor = true;

        while (neighbors.length > 0) {
            const neighborIndex = this.#randInt(0, neighbors.length);
            const [nRow, nCol, wallPos] = neighbors[neighborIndex];
            const newPathLength = (firstNeighbor) ? pathLength - 1 : this.#randInt(1, grid.length / 2);
            if (this.#generatePaths(grid, nRow, nCol, newPathLength, visited)) {
                const [wallRow, wallCol] = wallPos;
                grid[wallRow][wallCol] = this.emptySymbol;
                firstNeighbor = false;
            }

            neighbors = [...neighbors.slice(0, neighborIndex), ...neighbors.slice(neighborIndex + 1)];
        };

        return true;
    };

    #generateStartingGrid() {
        const grid = [];
        let rowCount = 0;
        let colCount = 0;
        for (let row = 0; row < this.height; row += 1) {
            rowCount += 1;
            const gridRow = [];
            for (let col = 0; col < this.width; col += 1) {
                colCount += 1
                const symbol = (rowCount % 2 !== 0 && colCount % 2 !== 0) ? this.emptySymbol : this.wallSymbol;
                gridRow.push(symbol);
            }
            grid.push(gridRow);
        }
        return grid;
    };

    #randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    };
};



module.exports = MazeGenerator;