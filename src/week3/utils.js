export const solveEllipseParametersFromTwoPoints = (x1, y1, x2, y2) => {

  // --- Pre-calculate Squares ---
  const x1sq = x1 * x1;
  const y1sq = y1 * y1;
  const x2sq = x2 * x2;
  const y2sq = y2 * y2;

  // --- Solve the Linear System for A = 1/a² and B = 1/b² ---
  // A = (y2² - y1²) / (x1² * y2² - y1² * x2²)
  // B = (x1² - x2²) / (x1² * y2² - y1² * x2²)

  const determinant = x1sq * y2sq - y1sq * x2sq;

  const numA = x1sq - x2sq;
  const numB = y2sq - y1sq;

  const A = numA / determinant;
  const B = numB / determinant;

  // --- Calculate a and b ---
  const aSquared = 1 / A;
  const bSquared = 1 / B;

  const a = Math.sqrt(aSquared);
  const b = Math.sqrt(bSquared);

  return { a: a, b: b };
}
