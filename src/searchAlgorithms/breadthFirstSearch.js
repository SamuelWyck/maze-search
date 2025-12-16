const Deque = require("../deque/deque.js");



class BreadthFirstSearch {
    constructor(wallSymbol, goalSymbol) {
        this.wallSymbol = wallSymbol;
        this.goalSymbol = goalSymbol;
    };

    breadthFirstPath(grid, startRow, startCol) {
        const visited = new Set([JSON.stringify([startRow, startCol])]);
        const queue = new Deque([[startRow, startCol]]);
        const path = [];

        while (queue.length !== 0) {
            const position = queue.popLeft();
            path.push(position);
            const [row, col] = position;
            const symbol = grid[row][col];
            if (symbol === this.goalSymbol) {
                return path;
            }

            const neighbors = [
                [row - 1, col], [row + 1, col],
                [row, col - 1], [row, col + 1]
            ];

            for (let neighbor of neighbors) {
                const [nRow, nCol] = neighbor;
                const rowValid = 0 <= nRow && nRow < grid.length;
                const colValid = 0 <= nCol && nCol < grid[0].length;
                if (!rowValid || !colValid) {
                    continue;
                }
                const key = JSON.stringify(neighbor);
                const symbol = grid[nRow][nCol];
                if (visited.has(key) || symbol === this.wallSymbol) {
                    continue;
                }
                visited.add(key);
                queue.push(neighbor);
            }
        };

        return path;
    };

    shortestDistance(grid, startRow, startCol) {
        const visited = new Set(JSON.stringify([startRow, startCol]));
        const startDistance = 0;
        const queue = new Deque([[startRow, startCol, startDistance]]);

        while (queue.length !== 0) {
            const [row, col, distance] = queue.popLeft();
            const symbol = grid[row][col];
            if (symbol === this.goalSymbol) {
                return distance;
            }

            const neighbors = [
                [row - 1, col], [row + 1, col],
                [row, col - 1], [row, col + 1]
            ];
            for (let neighbor of neighbors) {
                const [nRow, nCol] = neighbor;
                const rowValid = 0 <= nRow && nRow < grid.length;
                const colValid = 0 <= nCol && nCol < grid[0].length;
                if (!rowValid || !colValid) {
                    continue;
                }
                const key = JSON.stringify(neighbor);
                const symbol = grid[nRow][nCol];
                if (symbol === this.wallSymbol || visited.has(key)) {
                    continue;
                }
                visited.add(key);
                queue.push([nRow, nCol, distance + 1]);
            }
        }

        return -1;
    };
};



module.exports = BreadthFirstSearch;