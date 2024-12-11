// sudoku.js
export function generateSudoku() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
}

function fillBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) {
                            return true;
                        }
                        board[row][col] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isSafe(board, row, col, num) {
    // Check row
    if (board[row].includes(num)) return false;
    // Check column
    for (let r = 0; r < 9; r++) {
        if (board[r][col] === num) return false;
    }
    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function createPuzzle(board, difficulty = 'medium') {
    const levels = { easy: 36, medium: 46, hard: 56 }; // Numbers to remove
    const cellsToRemove = levels[difficulty] || levels.medium;

    const puzzle = board.map(row => [...row]);

    let removed = 0;
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            const backup = puzzle[row][col];
            puzzle[row][col] = 0;

            if (!hasUniqueSolution(puzzle)) {
                puzzle[row][col] = backup; // Undo removal
            } else {
                removed++;
            }
        }
    }
    return puzzle;
}

function hasUniqueSolution(board) {
    // Implement a solver and count solutions
    let solutionCount = 0;

    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafe(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) {
                                solutionCount++;
                                if (solutionCount > 1) return false; // Stop if more than one solution
                            }
                            board[row][col] = 0; // Backtrack
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve(board.map(row => [...row]));
    return solutionCount === 1;
}

