class DepthFirstSearch {
    constructor(wallSymbol, goalSymbol) {
        this.goalSymbol = goalSymbol;
        this.wallSymbol = wallSymbol;
    };

    shortestPath(grid, startRow, startCol) {
        const visited = new Set();
        const memo = {};
        const shortestPath = this.#findShortestPath(grid, startRow, startCol, visited, memo);
        shortestPath.reverse();
        return shortestPath;
    };

    #findShortestPath(grid, row, col, visited, memo) {
        const rowValid = 0 <= row && row < grid.length;
        const colValid = 0 <= col && col < grid[0].length;
        if (!rowValid || !colValid) {
            return [];
        }     
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return [];
        }
        if (key in memo) {
            return memo[key];
        }
        const symbol = grid[row][col];
        if (symbol === this.wallSymbol) {
            return [];
        }
        const position = [row, col];
        if (symbol === this.goalSymbol) {
            return [position];
        }

        const neighbors = [
            [row - 1, col], [row + 1, col],
            [row, col - 1], [row, col + 1]
        ];

        visited.add(key);
        let minPath = [];
        for (let neighbor of neighbors) {
            const [nRow, nCol] = neighbor;
            const subPath = this.#findShortestPath(grid, nRow, nCol, visited, memo);
            if (subPath.length === 0) {
                continue
            }
            minPath = (minPath.length === 0 || subPath.length < minPath.length) ? subPath : minPath;
        }
        visited.delete(key);

        if (minPath.length > 0) {
            minPath.push(position);
        }
        memo[key] = minPath.slice();
        return minPath;
    };

    dfsPath(grid, startRow, startCol) {
        const path = [];
        const visited = new Set();
        this.#dsfPath(grid, startRow, startCol, visited, path);
        return path;
    };

    #dsfPath(grid, row, col, visited, path) {
        const rowValid = 0 <= row && row < grid.length;
        const colValid = 0 <= col && col < grid[0].length;
        if (!rowValid || !colValid) {
            return false;
        }
        const key = JSON.stringify([row, col]);
        if (visited.has(key)) {
            return false;
        }
        const symbol = grid[row][col];
        if (symbol === this.wallSymbol) {
            return false;
        }
        path.push([row, col]);
        if (symbol === this.goalSymbol) {
            return true;
        }

        visited.add(key);
        const neighbors = [
            [row - 1, col], [row + 1, col],
            [row, col - 1], [row, col + 1]
        ];

        for (let neighbor of neighbors) {
            const [nRow, nCol] = neighbor;
            if (this.#dsfPath(grid, nRow, nCol, visited, path)) {
                return true
            }
        }

        return false;
    };
};



module.exports = DepthFirstSearch;