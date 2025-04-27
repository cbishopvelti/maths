import { renderPoints } from "../week1/utils";
import { flatten } from "lodash";


export const drawPointWithDirection = (canvasCtx, point, point_direction_vector, options) => {
      // --- Default configuration ---
      const config = {
        pointRadius: 4,
        pointColor: 'blue',
        lineColor: 'blue',
        lineWidth: 1,
        lineLength: 64, // Default desired visual length for the direction line
        arrowheadLength: 8, // Length of the sides of the arrowhead
        arrowheadAngle: 30,
        ...options // Allow users to override defaults
    };

    // --- Draw the point (as a filled circle) ---
    canvasCtx.beginPath();
    canvasCtx.arc(point.x, point.y, config.pointRadius, 0, Math.PI * 2); // Full circle
    canvasCtx.fillStyle = config.pointColor;
    canvasCtx.fill();

    // --- Calculate direction properties ---
    const dx = point_direction_vector.x;
    const dy = point_direction_vector.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    // Avoid division by zero and don't draw line/arrow if vector is zero
    if (magnitude < 0.00001) { // Use a small epsilon for floating point checks
        console.warn("drawPointWithDirection: Direction vector has zero length.");
        return;
    }

    // Normalize the direction vector
    const normX = dx / magnitude;
    const normY = dy / magnitude;

    // Determine the length of the main line segment
    let actualLineLength;
    if (config.lineLength !== null && config.lineLength !== undefined) {
        actualLineLength = config.lineLength;
    } else {
        // Use the vector's magnitude if lineLength isn't specified
        // You might want a scaling factor here depending on your use case
        actualLineLength = magnitude;
        // Example scaling: const scaleFactor = 1; actualLineLength = magnitude * scaleFactor;
    }

    // Calculate the end point of the *main line segment* (before the arrowhead)
    const lineEndX = point.x + normX * actualLineLength;
    const lineEndY = point.y + normY * actualLineLength;

    // --- Draw the main direction line ---
    canvasCtx.beginPath();
    canvasCtx.moveTo(point.x, point.y); // Start at the center of the point
    canvasCtx.lineTo(lineEndX, lineEndY); // Draw line to the calculated end point
    canvasCtx.strokeStyle = config.lineColor;
    canvasCtx.lineWidth = config.lineWidth;
    canvasCtx.stroke();

    // --- Draw the arrowhead ---
    const angle = Math.atan2(dy, dx); // Angle of the direction vector
    const angleRad = config.arrowheadAngle * (Math.PI / 180); // Convert arrowhead angle to radians

    // Calculate the points for the arrowhead barbs
    // The barbs point backwards from the line end point
    const angle1 = angle + Math.PI - angleRad; // Angle for the first barb
    const angle2 = angle + Math.PI + angleRad; // Angle for the second barb

    const barb1X = lineEndX + config.arrowheadLength * Math.cos(angle1);
    const barb1Y = lineEndY + config.arrowheadLength * Math.sin(angle1);

    const barb2X = lineEndX + config.arrowheadLength * Math.cos(angle2);
    const barb2Y = lineEndY + config.arrowheadLength * Math.sin(angle2);

    // Draw the arrowhead segments
    canvasCtx.beginPath(); // Start a new path for the arrowhead
    canvasCtx.moveTo(barb1X, barb1Y);
    canvasCtx.lineTo(lineEndX, lineEndY);
    canvasCtx.lineTo(barb2X, barb2Y);
    // Use the same style as the line
    canvasCtx.strokeStyle = config.lineColor;
    canvasCtx.lineWidth = config.lineWidth;
    canvasCtx.stroke();
}

/**
 * Creates a 2D unit vector object {x, y} from an angle given in radians.
 * The angle is measured counter-clockwise from the positive X axis.
 * 0 radians points right -> {x: 1, y: 0}
 * PI/2 radians points up -> {x: 0, y: 1}
 * PI radians points left -> {x: -1, y: 0}
 * 3*PI/2 radians points down -> {x: 0, y: -1}
 *
 * @param {number} angleInRadians The angle in radians.
 * @returns {{x: number, y: number}} An object with x and y components of the unit vector.
 */
export function getVectorFromAngleRadians(angleInRadians) {
  return {
    x: Math.cos(angleInRadians),
    y: Math.sin(angleInRadians)
  };
}

/**
 * Creates a 2D unit vector object {x, y} from an angle given in degrees.
 * The angle is measured counter-clockwise from the positive X axis.
 * 0 degrees points right -> {x: 1, y: 0}
 * 90 degrees points up -> {x: 0, y: 1}
 * 180 degrees points left -> {x: -1, y: 0}
 * 270 degrees points down -> {x: 0, y: -1}
 *
 * @param {number} angleInDegrees The angle in degrees.
 * @returns {{x: number, y: number}} An object with x and y components of the unit vector.
 */
export function getVectorFromAngleDegrees(angleInDegrees) {
  // Convert degrees to radians for Math.cos/sin
  const angleInRadians = angleInDegrees * (Math.PI / 180);
  return {
    x: Math.cos(angleInRadians),
    y: Math.sin(angleInRadians)
  };
}

// https://math.stackexchange.com/questions/2204258/roundest-ellipse-with-specified-tangents?rq=1

// ELLIPSE
// Assuming vec2 helper functions are available (add, sub, scale, cross, dot, lenSq, len, normalize)
// Define them inline if necessary. Example:
const vec2 = {
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
  sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
  scale: (v, s) => ({ x: v.x * s, y: v.y * s }),
  cross: (v1, v2) => v1.x * v2.y - v1.y * v2.x,
  dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
  lenSq: (v) => v.x * v.x + v.y * v.y,
  len: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
  normalize: (v, tolerance = 1e-10) => {
      const l = Math.sqrt(v.x * v.x + v.y * v.y);
      if (l < tolerance) return { x: 0, y: 0 }; // Return zero vector if too small
      return { x: v.x / l, y: v.y / l };
  }
};


// --- Helper: Solve 2x2 Linear System ---
const solve2x2 = (a11, a12, a21, a22, b1, b2, tolerance = 1e-10) => {
  const det = a11 * a22 - a12 * a21;
  if (Math.abs(det) < tolerance) {
      return null;
  }
  const invDet = 1.0 / det;
  const x = invDet * (a22 * b1 - a12 * b2);
  const y = invDet * (-a21 * b1 + a11 * b2);
  return { x, y };
};

// --- Helper: Solve 3x3 Linear System (Cramer's Rule) ---
const det3x3 = (m) => {
  // Check if m is a valid 3x3 array
  if (!m || m.length !== 3 || !m[0] || m[0].length !== 3 || !m[1] || m[1].length !== 3 || !m[2] || m[2].length !== 3) {
      console.error("det3x3: Invalid matrix input", m);
      return NaN; // Indicate error
  }
  try {
      return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
             m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
             m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  } catch (e) {
      console.error("det3x3: Error during calculation", e, m);
      return NaN;
  }
}


const solve3x3 = (A, b, tolerance = 1e-10) => {
  const detA = det3x3(A);

  if (isNaN(detA)) { // Check if det3x3 failed
      console.error("solve3x3: Failed to calculate main determinant.");
      return null;
  }

  if (Math.abs(detA) < tolerance) {
      // console.warn("solve3x3: Determinant near zero:", detA);
      return null; // Singular
  }

  const invDet = 1.0 / detA;

  // Create matrices for Cramer's rule carefully
  const Ax = [ [b[0], A[0][1], A[0][2]], [b[1], A[1][1], A[1][2]], [b[2], A[2][1], A[2][2]] ];
  const Ay = [ [A[0][0], b[0], A[0][2]], [A[1][0], b[1], A[1][2]], [A[2][0], b[2], A[2][2]] ];
  const Az = [ [A[0][0], A[0][1], b[0]], [A[1][0], A[1][1], b[1]], [A[2][0], A[2][1], b[2]] ];

  const detAx = det3x3(Ax);
  const detAy = det3x3(Ay);
  const detAz = det3x3(Az);

  if (isNaN(detAx) || isNaN(detAy) || isNaN(detAz)) {
      console.error("solve3x3: Failed to calculate Cramer determinant(s).");
      return null;
  }

  const x = invDet * detAx;
  const y = invDet * detAy;
  const z = invDet * detAz;

  return [x, y, z];
}


/**
* Creates an ellipse definition which passes through points p1 and p2
* with specified tangent vectors at those points.
*
* @param {{x: number, y: number}} p1 First point on the ellipse.
* @param {{x: number, y: number}} v1 Tangent vector at p1. Should not be zero vector.
* @param {{x: number, y: number}} p2 Second point on the ellipse.
* @param {{x: number, y: number}} v2 Tangent vector at p2. Should not be zero vector.
* @returns {{centerX: number, centerY: number, xAxis: number, yAxis: number, rotation: number} | null}
*          The ellipse parameters or null if calculation fails (e.g., degenerate input).
*/
export const createEllipse = (p1_in, v1_in, p2_in, v2_in) => {


  // return {
  //     centerX: C.x,
  //     centerY: C.y,
  //     xAxis: xAxis,
  //     yAxis: yAxis,
  //     rotation: rotation,
  // };
  return null;
};

const getXAxisLabels = opts => {
  let points = []
  for (let i = -50; i <= 50; i++) {
    if (i === 0) continue;
    points.push([
      { x: i, y: 0, i },
      { x: i, y: 0.1, i, text: i }
    ]);
  }

  return flatten(points);
}

const getYAxisLabels = opts => {
  let points = []
  for (let i = -50; i <= 50; i++) {
    if (i === 0) continue;
    points.push([
      { x: 0, y: i, i: `y${i}` },
      { x: 0.1, y: i, i: `y${i}`, text: `${i}` }
    ]);
  }

  return flatten(points);
}

export const drawAxis = (ctx, opts) => {
  // Xaxis
  renderPoints(
    ctx,
    {
      ...opts,
      strokeStyle: 'blue',
      offsetY: (opts.offsetY || 0) + (opts.axisOffsetY || 0)
    },
    [
      ...getXAxisLabels(opts),
      ...[{
        x: 50,
        y: 0,
        i: 'xaxis',
      }, {
        x: -50,
        y: 0,
        i: 'xaxis',
      }]
    ]
  );
  // Yaxis
  renderPoints(
    ctx,
    {
      ...opts,
      strokeStyle: 'blue',
    },
    [
      ...getYAxisLabels(opts),
      ...[{
        x: 0,
        y: 50,
        i: 'yaxis',
      }, {
        x: 0,
        y: -50,
        i: 'yaxis',
      }]
    ]
  );




  ctx.strokeStyle = 'blue';
  // Y Axis
  // ctx.moveTo(opts.width / 2, 0);
  // ctx.lineTo(opts.width / 2, opts.height);



  // X Axis
  // ctx.moveTo(0, opts.height / 2);
  // ctx.lineTo(opts.width, opts.height / 2);

  ctx.stroke();
};
