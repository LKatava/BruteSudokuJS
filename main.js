document.addEventListener('DOMContentLoaded', () => {
  let size = 9;
  let sudoku = Array.from({ length: size }, () => Array(size).fill(''));

  function createTable() {
      let table = document.createElement('table');
      let tableBody = document.createElement('tbody');

      for (let row = 0; row < size; row++) {
          let tableRow = document.createElement('tr');

          for (let col = 0; col < size; col++) {
              let cell = document.createElement('td');
              cell.textContent = sudoku[row][col] || '';

              cell.addEventListener('click', function () {
                  let insertedValue = prompt("Enter a number between 1 and 9:");
                  let numValue = parseInt(insertedValue);

                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 9) {
                      sudoku[row][col] = insertedValue;
                      cell.textContent = insertedValue;
                      validateBoard();
                  } else {
                      alert("Please enter a valid number between 1 and 9.");
                  }
              });

              tableRow.appendChild(cell);
          }

          tableBody.appendChild(tableRow);
      }

      table.appendChild(tableBody);
      document.body.appendChild(table);
  }

  function notInRow(arr, row) {
      let st = new Set();
      for (let i = 0; i < size; i++) {
          if (st.has(arr[row][i])) return false;
          if (arr[row][i] !== '') st.add(arr[row][i]);
      }
      return true;
  }

  function notInCol(arr, col) {
      let st = new Set();
      for (let i = 0; i < size; i++) {
          if (st.has(arr[i][col])) return false;
          if (arr[i][col] !== '') st.add(arr[i][col]);
      }
      return true;
  }

  function notInBox(arr, startRow, startCol) {
    let st = new Set();
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let curr = arr[startRow + row][startCol + col];
            if (curr !== '') {
                if (st.has(curr)) {
                    //console.log(`Duplicate ${curr} found in 3x3 submatrix starting at (${startRow}, ${startCol})`);
                    //console.log(`duplicate found at ${row}, ${col}`)
                    return false;
                }
                st.add(curr);
            }
        }
    }

    return true;
  }

  function isValid(arr, row, col, num) {
    num = num.toString();
    //console.log(`checking Number ${num} in row ${row} and col ${col}`)

    const subMatrixStartRow = row - row % 3;

    const subMatrixStartCol = col - col % 3;

    // Check 3x3 submatrix
    //console.log(`Checking 3x3 submatrix starting at (${subMatrixStartRow}, ${subMatrixStartCol})`);
    if (!notInBox(arr, subMatrixStartRow, subMatrixStartCol)) {
        return false;
    }

    // Check row
    else if (!notInRow(arr, row)) {
        //console.log(`Number ${num} is invalid in row ${row}`);
        return false;
    }

    // Check column
    else if (!notInCol(arr, col)) {
        //console.log(`Number ${num} is invalid in column ${col}`);
        return false;
    }

    return true;
  }


  function validateBoard() {
      let table = document.querySelector('table');
      let rows = table.querySelectorAll('tr');

      // Clear previous error highlights
      table.querySelectorAll('td').forEach(cell => cell.classList.remove('error-highlight'));

      for (let i = 0; i < size; i++) {
          let cells = rows[i].querySelectorAll('td');
          for (let j = 0; j < size; j++) {
              if (!isValid(sudoku, i, j, sudoku[i][j])) {
                  cells[j].classList.add('error-highlight');
              }
          }
      }
  }

  function updateTable() {
      let table = document.querySelector('table');
      let rows = table.querySelectorAll('tr');

      for (let i = 0; i < size; i++) {
          let cells = rows[i].querySelectorAll('td');
          for (let j = 0; j < size; j++) {
              cells[j].textContent = sudoku[i][j] || '';
          }
      }
  }

  function logMatrix(matrix) {
    console.log('Sudoku Matrix:');
    matrix.forEach(row => {
        console.log(row.join(' '));
    });
  }

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function solveSudoku() {
      console.log('Starting to solve Sudoku...');
      let solved = false;

      async function solve() {
          for (let row = 0; row < size; row++) {
              for (let col = 0; col < size; col++) {
                  if (sudoku[row][col] === '') {
                      //console.log(`Trying to solve cell (${row}, ${col})...`);
                      for (let num = 1; num <= 9; num++) {
                          if (isValid(sudoku, row, col, num.toString())) {
                              //console.log(`Placing ${num} in cell (${row}, ${col})`);
                              sudoku[row][col] = num.toString();
                              updateTable();
                              validateBoard();
                              await sleep(2000); // Pause for 200 milliseconds to show updates
                              if (await solve()) {
                                  return true; // Found a solution
                              } else {
                                  logMatrix(sudoku);
                                  console.log(`Backtracking from cell (${row}, ${col})`);
                                  sudoku[row][col] = ''; // Backtrack
                                  updateTable();
                                  validateBoard();
                                  logMatrix(sudoku);
                                  await sleep(2000); // Pause for 200 milliseconds to show updates
                              }
                          }
                      }
                      console.log(`No valid number for cell (${row}, ${col})`);
                      return false; // No valid number found for this cell
                  }
              }
          }
          solved = true;
          console.log('Sudoku solved!');
          return true; // All cells are filled, and the puzzle is solved
      }

      await solve();
      if (!solved) {
          console.log('No solution found.');
          alert('No solution found.');
      }
  }

  document.getElementById("solve-button").addEventListener('click', solveSudoku);

  createTable();
});
