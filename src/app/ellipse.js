// https://unacademy.com/content/jee/study-material/mathematics/equation-of-a-tangent-to-the-ellipse/#:~:text=Tangent%20to%20an%20ellipse,the%20tangents%20to%20the%20ellipse.
// https://math.stackexchange.com/questions/4898157/find-ellipses-constrained-by-2-points-and-their-respective-tangents-parametric
// https://math.stackexchange.com/questions/109890/how-to-find-an-ellipse-given-2-passing-points-and-the-tangents-at-them
// https://math.stackexchange.com/questions/252368/defining-constructing-an-ellipse
// https://math.stackexchange.com/questions/891085/determine-ellipse-from-two-points-and-direction-vectors-at-those-points/891647#891647
// https://en.wikipedia.org/wiki/Conic_section
// https://www.desmos.com/calculator/ccddljlfaq
export const createEllipse = (
  p1_in, // Vec2
  v1_in, // Vec2
  p2_in, // Vec2
  v2_in // Vec2
) => {

  // ax^{2}+\ bxy\ +\ cy^{2}\ +\ dx\ +\ fy\ +\ g=\ 1
  //y=mx+\sqrt{\left(m^{2}\left(\frac{1}{a}\right)\ +\ \left(\frac{1}{c}\right)\right)}

  const result = getMinEccentricity(p1_in, p2_in);
  console.log("001 result", result);


  // return {
  //     centerX: C.x,
  //     centerY: C.y,
  //     xAxis: xAxis,
  //     yAxis: yAxis,
  //     rotation: rotation,
  // };
  return null;
};

// https://math.stackexchange.com/questions/891085/determine-ellipse-from-two-points-and-direction-vectors-at-those-points/891647#891647
const getMinEccentricity = (p1_in, p2_in) => {
  console.log("002", p1_in.length(), p1_in.length()^2);
  const out = (2 * p1_in.dot(p2_in)) / (Math.pow(p1_in.length(), 2) + Math.pow(p2_in.length(), 2))
  return out;
}
