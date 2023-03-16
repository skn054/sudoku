
let button = document.getElementById("generate-sudoku");
let solve = document.getElementById("solve");
var arr = [[], [], [], [], [], [], [], [], []];
let N = 9;
let K = 40;
let board = [[], [], [], [], [], [], [], [], []];


class Sudoku {
  // Constructor

  constructor(N, K, board) {
    this.N = N;
    this.K = K;

    // Compute square root of N
    const SRNd = Math.sqrt(N);
    this.SRN = Math.floor(SRNd);
    this.mat = board;
   
  }

  // Sudoku Generator
  fillValues() {
    // Fill the diagonal of SRN x SRN matrices
    this.fillDiagonal();

    // Fill remaining blocks
    this.fillRemaining(0, this.SRN);

    // Remove Randomly K digits to make game
    this.removeKDigits();
  }

  // Fill the diagonal SRN number of SRN x SRN matrices
  fillDiagonal() {
    for (let i = 0; i < this.N; i += this.SRN) {
      // for diagonal box, start coordinates->i==j
      this.fillBox(i, i);
    }
  }

  // Returns false if given 3 x 3 block contains num.
  unUsedInBox(rowStart, colStart, num) {
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        if (this.mat[rowStart + i][colStart + j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  // Fill a 3 x 3 matrix.
  fillBox(row, col) {
    let num = 0;
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        while (true) {
          num = this.randomGenerator(this.N);
          if (this.unUsedInBox(row, col, num)) {
            break;
          }
        }
        this.mat[row + i][col + j] = num;
      }
    }
  }

  // Random generator
  randomGenerator(num) {
    return Math.floor(Math.random() * num + 1);
  }

  // Check if safe to put in cell
  checkIfSafe(i, j, num) {
    return (
      this.unUsedInRow(i, num) &&
      this.unUsedInCol(j, num) &&
      this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
    );
  }

  // check in the row for existence
  unUsedInRow(i, num) {
    for (let j = 0; j < this.N; j++) {
      if (this.mat[i][j] === num) {
        return false;
      }
    }
    return true;
  }

  // check in the row for existence
  unUsedInCol(j, num) {
    for (let i = 0; i < this.N; i++) {
      if (this.mat[i][j] === num) {
        return false;
      }
    }
    return true;
  }

  // A recursive function to fill remaining
  // matrix
  fillRemaining(i, j) {
    // Check if we have reached the end of the matrix
    if (i === this.N - 1 && j === this.N) {
      return true;
    }

    // Move to the next row if we have reached the end of the current row
    if (j === this.N) {
      i += 1;
      j = 0;
    }

    // Skip cells that are already filled
    if (this.mat[i][j] !== 0) {
      return this.fillRemaining(i, j + 1);
    }

    // Try filling the current cell with a valid value
    for (let num = 1; num <= this.N; num++) {
      if (this.checkIfSafe(i, j, num)) {
        this.mat[i][j] = num;
        if (this.fillRemaining(i, j + 1)) {
          return true;
        }
        this.mat[i][j] = 0;
      }
    }

    // No valid value was found, so backtrack
    return false;
  }

  // Print sudoku
  printSudoku() {
    for (let i = 0; i < this.N; i++) {
      console.log(this.mat[i].join(" "));
    }
  }

  // Remove the K no. of digits to
  // complete game
  removeKDigits() {
    let count = this.K;

    while (count !== 0) {
      // extract coordinates i and j
      let i = Math.floor(Math.random() * this.N);
      let j = Math.floor(Math.random() * this.N);
      if (this.mat[i][j] !== 0) {
        count--;
        this.mat[i][j] = 0;
      }
    }

    return;
  }
}



for (var i = 0; i < 9; i++) {
  for (var j = 0; j < 9; j++) {
    arr[i][j] = document.getElementById(i * 9 + j);
  }
}

function setColor() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      arr[i][j].style.color = "green";
      
    }
  }
}

function resetColor(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== 0) {
        arr[i][j].style.color = "black";
        arr[i][j].style.backgroundColor = "#dce3ed";
        
      }
    }
  }
}
function changeBoard(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] != 0) {
        arr[i][j].innerText = board[i][j];
      } else arr[i][j].innerText = "";
    }
  }
}

button.onclick = function () {
  // Driver code
  board = Array.from(
    {
      length: N,
    },
    () =>
      Array.from(
        {
          length: N,
        },
        () => 0
      )
  );
  let sudoku = new Sudoku(N, K, board);
  sudoku.fillValues();
  sudoku.printSudoku();
  setColor();
  resetColor(board);
  changeBoard(board);
};

function solveBoard(board, start, end) {
  if (start >= 9) return true;
  if (end >= 9) {
    // start = start + 1;
    return solveBoard(board, start + 1, 0);
  }
  if (board[start][end] !== 0) return solveBoard(board, start, end + 1);

  for (let num = 1; num <= 9; num++) {
    if (isSafe(board, start, end, num)) {
      board[start][end] = num;
      if (solveBoard(board, start, end + 1)) {
        return true;
      } else {
        board[start][end] = 0;
      }
    }
  }
  return false;
}

function isSafe(board, i, j, num) {
  for (let col = 0; col < 9; col++) {
    if (board[i][col] === num) return false;
  }
  for (let row = 0; row < 9; row++) {
    if (board[row][j] === num) return false;
  }
  let srow = Math.floor((i/3)) * 3;
  let scol = Math.floor((j/3)) * 3;

  // var srow = i - (i % 3);
  // var scol = j - (j % 3);

  for (let r = srow; r < srow + 3; r++) {
    for (c = scol; c < scol + 3; c++) {
      if (board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

solve.addEventListener("click", () => {
  console.log("hello");
  if (board[0][0] == undefined) {
    alert("puzzle cannot be blank");
  } else {
    if (solveBoard(board, 0, 0)) changeBoard(board);
    else alert("cannot solve sudoku");
  }

});
