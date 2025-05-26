import { range, reduce, findIndex, isEqual, fill, sortBy, reverse, dropWhile,
  drop, initial, zipWith, last, sum} from "lodash";



export const Week5 = () => {

  let A = [
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3]
  ]
  const m = 3;
  const n = 4;

  let h = 0;
  let k = 0;

  console.log("001", A);
  while (h < m && k < n) {
    // i_max := argmax (i = h ... m, abs(A[i, k]))
    const {i_max} = reduce(range(h, m - 1), (acc, i) => {
      if (Math.abs(A[i][k]) > acc.max_val) {
        return {
          i_max: i,
          max_val: Math.abs(A[i][k])
        }
      } else {
        return acc
      }
    }, {i_max: 0, max_val: 0})
    if (A[i_max, k] == 0) {
      k = k + 1;
    } else {
      // swap rows(h, i_max)
      const r1 = A[i_max];
      const r2 = A[h];
      A[h] = r1
      A[i_max] = r2;

      for (let i = h + 1; i < m; i++) {
        let f = A[i][k] / A[h][k];
        /* Fill with zeros the lower part of pivot column: */
        A[i][k] = 0
        for (let j = k + 1; j < n; j++) {
          A[i][j] = A[i][j] - A[h][j] * f
        }
      }
      h = h + 1;
      k = k + 1;
    }
  }

  const rows = reverse(sortBy(A, (row) => {
    return row.filter((item ) => item === 0).length
  }))
  const results = reduce(rows, (acc, row, i) => {
    console.log("----------------------------------", i)
    let row2 = dropWhile(row, (item) => item === 0)
    drop(initial(row2))
    const result = (last(row2) - sum(zipWith(drop(initial(row2)), acc.results, (a, b) => a*b))) / row2[0]

    return {results: [result, ...acc.results]}

  }, {results: []})
  console.log("003", results)

  return <div>
    Week5
  </div>
}
