


export const solve = (m1, c1, m2, c2) => {
  // y = mx + c
  // m1x + c1 = m2x + c2
  // m1x - m2x = c2 - c1
  // x(m1 - m2) = c2 - c1
  // x = (c2 - c1) / (m1 - m2)
  const x = (c2 - c1) / (m1 - m2);

  const y = m1 * x + c1;
  return { x, y };
}

// c**2 = a**2 * m**2 + b**2
export const solve2 = (m1, c1, m2, c2) => {
  const c1_squared = Math.pow(c1, 2);
  const m1_squared = Math.pow(m1, 2);
  const c2_squared = Math.pow(c2, 2);
  const m2_squared = Math.pow(m2, 2);

  const diff_y_squared = c1_squared - c2_squared;
  const diff_x_squared = m1_squared - m2_squared;

  const b_squared = diff_y_squared / diff_x_squared;

  const a_squared = c1_squared - b_squared * m1_squared;

  return {
    a_sq: a_squared,
    b_sq: b_squared
  };
}
