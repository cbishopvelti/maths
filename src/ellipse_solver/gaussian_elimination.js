// Gaussian elimination algorithm to solve a system of linear equations.

/**
 * Solves a system of linear equations using Gaussian elimination.
 *
 * @param {number[][]} matrix - The augmented matrix representing the system of equations.
 *   Each inner array represents a row, and the last element of each row is the constant term.
 *   Example: [[a1, b1, c1, d1], [a2, b2, c2, d2], [a3, b3, c3, d3]] for a system of 3 equations
 *   with 3 variables.
 * @returns {number[] | null} An array representing the solution [x, y, z, ...].
 *   Returns null if the system has no unique solution (no solution or infinite solutions).
 */
function solve(matrix) {
  const numRows = matrix.length;
  if (numRows === 0) {
    return [];
  }
  const numCols = matrix[0].length; // Includes the augmented column

  // Perform forward elimination to get the matrix into row-echelon form
  for (let pivotRow = 0; pivotRow < numRows; pivotRow++) {
    // Find a pivot for the current column (pivotRow)
    let pivot = pivotRow;
    while (pivot < numRows && matrix[pivot][pivotRow] === 0) {
      pivot++;
    }

    if (pivot === numRows) {
      // No pivot found in this column below the current row.
      // This means the system might have no unique solution.
      // For now, we assume a unique solution exists as per problem context.
      // A more robust implementation would check if the remaining rows are all zeros
      // in the coefficient part. If a row is [0, 0, ..., 0, non-zero_constant],
      // then there is no solution. If a row is all zeros [0, 0, ..., 0, 0],
      // it indicates infinite solutions (if other rows are consistent).
      console.warn("System may not have a unique solution (pivot not found).");
      // Depending on requirements, could throw an error or return null here.
      // For this problem, we'll proceed assuming a unique solution might still be found
      // if back substitution works, or that input guarantees a unique solution.
      continue; // or handle appropriately
    }

    // Swap the current row with the pivot row if necessary
    if (pivot !== pivotRow) {
      [matrix[pivotRow], matrix[pivot]] = [matrix[pivot], matrix[pivotRow]];
    }

    // Normalize the pivot row (make the pivot element 1)
    const pivotValue = matrix[pivotRow][pivotRow];
    if (pivotValue === 0) {
        // This should ideally be caught by the pivot search, but as a safeguard:
        console.warn("Pivot value is zero after swap, system may not have a unique solution.");
        continue;
    }
    for (let j = pivotRow; j < numCols; j++) {
      matrix[pivotRow][j] /= pivotValue;
    }

    // Eliminate the variable from other rows
    for (let i = 0; i < numRows; i++) {
      if (i !== pivotRow) {
        const factor = matrix[i][pivotRow];
        for (let j = pivotRow; j < numCols; j++) {
          matrix[i][j] -= factor * matrix[pivotRow][j];
        }
      }
    }
  }

  // Perform back substitution to find the solution
  const solution = new Array(numRows).fill(0);
  for (let i = numRows - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < numRows; j++) { // numRows because solution has numRows variables
      sum += matrix[i][j] * solution[j];
    }
    // The last element of the row is the constant
    // matrix[i][i] should be 1 if forward elimination was successful for a unique solution
    if (matrix[i][i] === 0) {
        // If matrix[i][i] is 0 and matrix[i][numCols-1] (constant) is non-zero, no solution.
        // If matrix[i][i] is 0 and matrix[i][numCols-1] is zero, infinite solutions.
        console.warn("Back substitution issue: system may not have a unique solution.");
        // For this problem, we might assume matrix[i][i] is 1.
        // A robust solution would return null or throw an error.
        return null; // Or handle as per specific requirements for non-unique solutions
    }
    solution[i] = (matrix[i][numCols - 1] - sum) / matrix[i][i];
  }

  return solution;
}

// Example Usage (for testing purposes, can be removed or commented out)
/*
const m1 = [
  [2, 1, -1, 8],
  [-3, -1, 2, -11],
  [-2, 1, 2, -3]
];
const sol1 = solve(m1);
console.log("Solution 1:", sol1); // Expected: [2, 3, -1]

const m2 = [
  [1, 1, 1, 6],
  [0, 1, 2, 8],
  [0, 0, 1, 3]
];
const sol2 = solve(m2); // Matrix already in upper triangular form
console.log("Solution 2:", sol2); // Expected: [1, 2, 3]

const m3 = [ // No solution
    [1, 1, 1, 2],
    [0, 1, -3, 1],
    [0, 0, 0, 4]
];
// console.log("Attempting to solve m3 (no solution):", solve(JSON.parse(JSON.stringify(m3))));


const m4 = [ // Infinite solutions
    [1, 2, -1, 3],
    [0, 1, 2, 1],
    [0, 0, 0, 0]
];
// console.log("Attempting to solve m4 (infinite solutions):", solve(JSON.parse(JSON.stringify(m4))));
*/

// Export the function if using in a module system (e.g., Node.js or ES6 modules)
// For browser environments, this function will be available globally if the script is included.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { solve };
}
