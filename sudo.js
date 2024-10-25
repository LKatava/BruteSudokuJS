document.addEventListener('DOMContentLoaded', () => {
    let size = 9;
    let sudoku = Array.from({ length: size }, () => Array(size).fill('.'));
    let solving = false;

    function createTable() {
        let table = document.getElementById('sudoku-board');
        let tableBody = document.createElement('tbody');

        for (let row = 0; row < size; row++) {
            let tableRow = document.createElement('tr');

            for (let col = 0; col < size; col++) {
                let cell = document.createElement('td');
                cell.contentEditable = true;
                cell.textContent = sudoku[row][col];

                cell.addEventListener('input', function () {
                    let value = this.textContent;
                    if (value.match(/^[1-9]$/)) {
                        sudoku[row][col] = value;
                    } else {
                        this.textContent = sudoku[row][col];
                    }
                });

                tableRow.appendChild(cell);
            }

            tableBody.appendChild(tableRow);
        }

        table.appendChild(tableBody);
    }

    function printBoard(board) {
        let table = document.getElementById('sudoku-board');
        let rows = table.querySelectorAll('tr');

        for (let row = 0; row < size; row++) {
            let cells = rows[row].querySelectorAll('td');
            for (let col = 0; col < size; col++) {
                cells[col].textContent = board[row][col];
            }
        }
    }

    function isValid(board, row, col, num) {
        // Check the row
        for (let i = 0; i < size; i++) {
            if (board[row][i] == num) return false;
        }

        // Check the column
        for (let i = 0; i < size; i++) {
            if (board[i][col] == num) return false;
        }

        // Check the 3x3 box
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (board[r][c] == num) return false;
            }
        }

        return true;
    }

    function solveSudoku(board) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (board[row][col] == '.') {
                    for (let num = 1; num <= 9; num++) {
                        let numStr = num.toString();
                        if (isValid(board, row, col, numStr)) {
                            board[row][col] = numStr;
                            printBoard(board); // Update HTML board
                            return new Promise(resolve => {
                                setTimeout(() => {
                                    solveSudoku(board).then(resolve);
                                }, 500); // Delay for visualization
                            });
                        }
                    }
                    board[row][col] = '.';
                    printBoard(board); // Update HTML board
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(false);
                        }, 500); // Delay for visualization
                    });
                }
            }
        }
        return Promise.resolve(true);
    }

    function startSolving() {
        if (solving) return; // Prevent multiple simultaneous solves
        solving = true;
        let board = sudoku.map(row => row.slice()); // Copy the current board
        solveSudoku(board).then(() => {
            solving = false;
        });
    }

    createTable();

    document.getElementById('solve-button').addEventListener('click', startSolving);
});
