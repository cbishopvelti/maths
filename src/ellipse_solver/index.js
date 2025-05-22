import React, { useEffect, useRef, useState } from 'react';
import { getContext, render } from '../app/render';
import { drawAxis } from '../app/utils';
import { Link, useParams } from 'react-router-dom';
import { random, flatten, round, includes, reduce, map, isNumber, range } from 'lodash';
import { calculatePoints, renderPoints } from '../week1/utils';
// import { lusolve } from 'mathjs';
import nerdamer, {solveEquations, diff} from 'nerdamer'; // solveEquations will be replaced for the main 5-equation system
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
// import { solve } from '../week2/utils'; // Assuming this was an old import
const { solve } = require('./gaussian_elimination.js'); // Our new solver
import { e } from 'mathjs';
import Algibrite from 'algebrite';
import { solver3 } from './solution3';
// import { greeting, logGreeting } from 'Lib';

nerdamer.set('SOLUTIONS_AS_OBJECT', true)

// https://en.wikipedia.org/wiki/Eccentricity_(mathematics)
const solver2 = (ctx, opts, args) => {
  // nerdamer.set("MAX_SOLVE_DEPTH", 10_000);
  const x1 = args.x1;
  const y1 = args.y1
  const m1 = args.m1
  const x2 = args.x2;
  const y2 = args.y2
  const m2 = args.m2

  // nerdamer.set("suppress_errors", true)
  // A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + E*${y1} = 1
  const eq1_expr = nerdamer(`A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + F*${y1} = 1`)
  const eq2_expr = nerdamer(`(-(2*A*${x1} + B*${y1} + D) / (B*${x1} + 2*C*${y1} + F)) = ${m1}`)
  const eq3_expr = nerdamer(`A*${x2**2} + B*${x2*y2} + C*${y2**2} + D*${x2} + F*${y2} = 1`)
  const eq4_expr = nerdamer(`(-(2*A*${x2} + B*${y2} + D) / (B*${x2} + 2*C*${y2} + F)) = ${m2}`)
  const eq5_expr = nerdamer(`e = sqrt((2 * sqrt((A-C)^2 + B^2)) / ( sqrt((A-C)^2 + B^2) + abs(A+C) ))`)
  // const eq5_expr = nerdamer(`A*${x3**2} + B*${x3*y3} + C*${y3**2} + D*${x3} + F*${y3} = 1`)

  // 2Ax    + By + Bx(dy/dx) + 2Cy(dy/dx) + D + F(dy/dx) = 0
  // (2x₁)A + (m₁x₁ + y₁)B   + (2m₁y₁)C   + D + (m₁)F = 0
  // https://aistudio.google.com/prompts/1oqsDCBVrlM8xl0LThVBA3fk4HzBvSDkn
  nerdamer.set('SOLUTIONS_AS_OBJECT', true); // Kept for other nerdamer uses if any

  // Define a helper function to calculate eccentricity directly from coefficients
  const calculateEccentricity = (A, B, C) => {
    if (A === undefined || B === undefined || C === undefined) return Infinity;
    const term1 = (A - C) ** 2 + B ** 2;
    const term2 = Math.sqrt(term1);
    const term3 = Math.abs(A + C);
    if (term2 + term3 === 0) return Infinity; // Avoid division by zero
    const eSquared = (2 * term2) / (term2 + term3);
    return Math.sqrt(eSquared);
  };

  // Iterate over F values to find the one that minimizes eccentricity
  const ef = reduce(range(-10, 10, 0.01), (acc, F_val) => {
    // For each F_val, construct and solve the system for A, B, C, D
    const matrix = [
      [x1 ** 2, x1 * y1, y1 ** 2, x1, 1 - F_val * y1],
      [-2 * x1, -y1 - m1 * x1, -2 * m1 * y1, -1, F_val * m1],
      [x2 ** 2, x2 * y2, y2 ** 2, x2, 1 - F_val * y2],
      [-2 * x2, -y2 - m2 * x2, -2 * m2 * y2, -1, F_val * m2]
    ];

    const solutionABCD = solve(matrix); // Our numerical solver

    if (solutionABCD && solutionABCD.length === 4) {
      const [sA, sB, sC, sD] = solutionABCD;
      const currentEccentricity = calculateEccentricity(sA, sB, sC);

      if (isNumber(currentEccentricity) && currentEccentricity < acc.e) {
        return {
          e: currentEccentricity,
          F: F_val,
          A: sA, B: sB, C: sC, D: sD // Store coeffs for this F
        };
      }
    }
    return acc;
  }, { e: Infinity, F: 0, A: 0, B: 0, C: 0, D: 0 });

  let resObj = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  if (ef.e !== Infinity) {
    resObj = {
      F: ef.F,
      A: ef.A,
      B: ef.B,
      C: ef.C,
      D: ef.D
    };
  } else {
    console.error("Solver2: Could not find a valid F to minimize eccentricity.");
  }
  
  // The following parts involving symbolic differentiation (eq5b, yfn)
  // and plotting of that derivative (points for yfn) are commented out,
  // as they depended on A,B,C,D being symbolic expressions of F from nerdamer.solveEquations.
  // Re-implementing symbolic differentiation is outside the current scope.

  /*
  const results_symbolic = solveEquations([ // This was the original call
    eq1_expr.toString(),
    eq2_expr.toString(),
    eq3_expr.toString(),
    eq4_expr.toString()
  ], ['A', 'B', 'C', 'D']);

  const eq5a = eq5_expr
    .sub('A', results_symbolic.A)
    .sub('B', results_symbolic.B)
    .sub('C', results_symbolic.C)
    .sub('D', results_symbolic.D);

  // Plotting the eccentricity function e(F) itself (yfn2, points2)
  // This might still be possible if we construct yfn2 by evaluating calculateEccentricity
  // for a range of F values, rather than from a symbolic expression.
  // For now, to keep changes focused, this is also commented out.
  
  const yfn2 = nerdamer(`sqrt(${eq5a.symbol.RHS.toString()})`).buildFunction(('F'))
  const yb = (x) => [
    yfn2(x)
  ]
  const points2 = calculatePoints(yb);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'green'
  }, [
    ...points2
  ]);

  const eq5b = diff(eq5a.symbol.RHS, 'F')
  const eq5c = nerdamer(`y=${eq5b.toString()}`)

  const yfn = eq5b.buildFunction(['F']);
  const y = (x) => [
    yfn(x)
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'red'
  }, [
    ...points
  ]);
  */

  const eq = nerdamer(`A*x^2 + B*x*y + C*y^2 + D*x + F*y = 1`, resObj)
  const eqy = eq.solveFor('y')
  const yfns = map(eqy, (eqy) => eqy.buildFunction())
  const yfin = (x) => map(yfns, (fns) => fns(x))
  const points3 = calculatePoints(yfin);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [
    ...points3
  ]);

  const m1eq = nerdamer(`y = m*x + c`, {m: m1, x: x1, y: y1})
  const m1c = m1eq.solveFor('c')[0].valueOf();
  const m1y = (x) => [
    x * m1 + m1c
  ]
  const m1points = calculatePoints(m1y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [
    ...m1points
  ]);

  const m2eq = nerdamer(`y = m*x + c`, {m: m2, x: x2, y: y2})
  const m2c = m2eq.solveFor('c')[0].valueOf();
  const m2y = (x) => [
    x * m2 + m2c
  ]
  const m2points = calculatePoints(m2y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [
    ...m2points
  ]);
}
// https://math.stackexchange.com/questions/1885315/equation-for-an-ellipse-from-2-points-and-their-tangents
// https://math.stackexchange.com/questions/2204258/roundest-ellipse-with-specified-tangents
const solver = (ctx, opts, args) => {
  // const x1 = 2;
  // const y1 = 1.5;
  // const m1 = 1;

  // const x2 = 2;
  // const y2 = -1.5;
  // const m2 = -1;

  // const x3 = -2;
  // const y3 = -1.5;

  // const x4 = -2;
  // const y4 = 1.5;

  // const x5 = 2.6;
  // const y5 = 1;

  const x1 = args.x1;
  const y1 = args.y1
  const m1 = args.m1
  const x2 = args.x2;
  const y2 = args.y2
  const m2 = args.m2
  const e = 0.5
  const x3 = args.x3;
  const y3 = args.y3

  console.time("gaussian_solve_001");
  // Construct the augmented matrix for the system of 5 linear equations
  // Variables: [A, B, C, D, F]
  const matrix = [
    [x1**2, x1*y1, y1**2, x1, y1, 1], // Eq1: A*x1^2 + B*x1*y1 + C*y1^2 + D*x1 + F*y1 = 1
    [-2*x1, -y1 - m1*x1, -2*m1*y1, -1, -m1, 0], // Eq2: A*(-2*x1) + B*(-y1 - m1*x1) + C*(-2*m1*y1) + D*(-1) + F*(-m1) = 0
    [x2**2, x2*y2, y2**2, x2, y2, 1], // Eq3: A*x2^2 + B*x2*y2 + C*y2^2 + D*x2 + F*y2 = 1
    [-2*x2, -y2 - m2*x2, -2*m2*y2, -1, -m2, 0], // Eq4: A*(-2*x2) + B*(-y2 - m2*x2) + C*(-2*m2*y2) + D*(-1) + F*(-m2) = 0
    [x3**2, x3*y3, y3**2, x3, y3, 1]  // Eq5: A*x3^2 + B*x3*y3 + C*y3^2 + D*x3 + F*y3 = 1
  ];

  const solution = solve(matrix);
  let results = {};

  if (solution && solution.length === 5) {
    results = {
      A: solution[0],
      B: solution[1],
      C: solution[2],
      D: solution[3],
      F: solution[4]
    };
  } else {
    console.error("Gaussian elimination did not find a unique solution for the 5 equations.", solution);
    // Fallback or error handling:
    // Potentially, we could try nerdamer here if our solver fails, or just let it be empty.
    // For now, an empty results object will likely cause downstream errors,
    // which will indicate failure.
    results = { A: 0, B: 0, C: 0, D: 0, F: 0 }; // Default to avoid crashes, but this is not a solution
  }
  console.timeEnd("gaussian_solve_001");

  // The existing nerdamer call for comparison or fallback (can be removed later):
  // console.time("nerdamer_solve_001");
  // const eq1_expr_str = `A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + F*${y1} = 1`;
  // const eq2_expr_str = `A*(${-2*x1}) + B*(${-y1 - m1*x1}) + C*(${-2*m1*y1}) + D*(-1) + F*(${-m1}) = 0`;
  // const eq3_expr_str = `A*${x2**2} + B*${x2*y2} + C*${y2**2} + D*${x2} + F*${y2} = 1`;
  // const eq4_expr_str = `A*(${-2*x2}) + B*(${-y2 - m2*x2}) + C*(${-2*m2*y2}) + D*(-1) + F*(${-m2}) = 0`;
  // const eq5_expr_str = `A*${x3**2} + B*${x3*y3} + C*${y3**2} + D*${x3} + F*${y3} = 1`;
  // const nerdamerResults = solveEquations([eq1_expr_str, eq2_expr_str, eq3_expr_str, eq4_expr_str, eq5_expr_str]);
  // console.timeEnd("nerdamer_solve_001");
  // console.log("Nerdamer results:", nerdamerResults);
  // console.log("Custom solve results:", results);


  const eq = nerdamer(`A*x^2 + B*x*y + C*y^2 + D*x + F*y = 1`, results)
  const eqy = eq.solveFor('y')
  const yfns = map(eqy, (eqy) => eqy.buildFunction())
  const y = (x) => map(yfns, (fns) => fns(x))
  const points = calculatePoints(y);

  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [
    ...points
  ]);

  const m1eq = nerdamer(`y = m*x + c`, {m: m1, x: x1, y: y1})
  const m1c = m1eq.solveFor('c')[0].valueOf();
  const m1y = (x) => [
    x * m1 + m1c
  ]
  const m1points = calculatePoints(m1y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [
    ...m1points,
    {
      x: x3,
      y: y3,
      text: `/(${x3},${y3})`,
      i: "res"
    }
  ]);

  const m2eq = nerdamer(`y = m*x + c`, {m: m2, x: x2, y: y2})
  const m2c = m2eq.solveFor('c')[0].valueOf();
  const m2y = (x) => [
    x * m2 + m2c
  ]
  const m2points = calculatePoints(m2y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [
    ...m2points
  ]);

}

const localRender = (ctx, opts, args) => {

  drawAxis(ctx, opts)

  // includes(opts.parts,'2') && part2(ctx, opts);
  // solver(ctx, opts, args)
  includes(opts.parts, '1') && solver(ctx, opts, args);
  includes(opts.parts, '2') && solver2(ctx, opts, args)
  includes(opts.parts, '3') && solver3(ctx, opts, args)
}

export const EllipseSolver = () => {
  const { part } = useParams();
  const [ parts, setParts ] = useState([
    // '1',
    // '2',
    '3'
  ]);

  const canvasRef = useRef(null)
  const [renderCount, setRenderCount] = useState(0);

  const [args, setArgs] = useState({
    x1: 2,
    y1: 2,
    m1: -1.5,
    x2: -2,
    y2: 2,
    m2: 1,
    x3: 0,
    y3: -4
  });

  const opts = {
    width: 600,
    height: 600,
    scale: 50,
    scaleY: -1,
    // offsetY: -8,
    // offsetX: -2,
    // axisOffsetY: 7,
    part,
    parts
  }
  let ctx;

  const argn = reduce(args, (acc, arg, key) => {
    if (isNumber(arg)) {
      return {
        ...acc,
        values: {
          ...acc.values,
          [key]: arg
        }
      }
    }
    const x = parseFloat(arg)
    if (isNaN(x)) {
      return { ...acc, fine: false}
    }
    return {
      ...acc,
      values: {
        ...acc.values,
        [key]: x
      }
    }
  }, { fine: true, values: {} })

  useEffect(() => {
    if (canvasRef?.current && argn.fine) {
      ctx = getContext(canvasRef?.current, opts)
      localRender(ctx, opts,args)
    }
  }, [canvasRef?.current])
  if (canvasRef?.current && argn.fine) {
    ctx = getContext(canvasRef?.current, opts)
    localRender(ctx, opts, argn.values)
  }

  const onChange = (id) => (e) => {
    const { checked } = e.target;
    if (checked) {
      setParts([...parts, id]);
    } else {
      setParts(parts.filter((part) => part !== id));
    }
  }

  return (
    <div style={{
      display: "flex",
      // height: "300px"
    }}>
      <div style={{
        display: "inline-block",
        alignItems: "flex-start"
      }}>
        <nav>
          <ul style={{
            listStyle: "none",
            display: "flex",
            gap: "15px"
          }}>
            <li>
              <label htmlFor="part1">part 1</label>
              <input
                type="checkbox"
                id="part1"
                checked={includes(parts, '1')}
                onChange={(a) => onChange('1')(a)} />
            </li>
            <li>
              <label htmlFor="part2">part 2</label>
              <input
                type="checkbox"
                id="part2"
                checked={includes(parts, '2')}
                onChange={(a) => onChange('2')(a)} />
            </li>
            <li>
              <label htmlFor="part3">part 3</label>
              <input
                type="checkbox"
                id="part3"
                checked={includes(parts, '3')}
                onChange={(a) => onChange('3')(a)} />
            </li>
          </ul>
          <a target="_blank" rel="noreferrer" style={{marginLeft: '40px'}} href="https://github.com/cbishopvelti/maths/blob/master/src/ellipse_solver/index.js">The code</a>
        </nav>
        <canvas ref={canvasRef} width={opts.width} height={opts.height} />
      </div>
      <div>
        <div>
          <label style={{display: "inline"}}>x1:</label>
          <input
            value={args.x1}
            onChange={(e) => setArgs({
              ...args,
              x1: e.target.value
            })} />
          &nbsp;
          <label style={{display: "inline"}}>y1:</label>
          <input
            value={args.y1}
            onChange={(e) => setArgs({
              ...args,
              y1: e.target.value
            })} />
        </div>
        <div>
          <label style={{display: "inline"}}>m1:</label>
          <input
            value={args.m1}
            onChange={(e) => setArgs({
              ...args,
              m1: e.target.value
            })} />
        </div>
        <div>
          <div>
            <label style={{display: "inline"}}>x2:</label>
            <input
              value={args.x2}
              onChange={(e) => setArgs({
                ...args,
                x2: e.target.value
              })} />
            &nbsp;
            <label style={{display: "inline"}}>y2:</label>
            <input
              value={args.y2}
              onChange={(e) => setArgs({
                ...args,
                y2: e.target.value
              })} />
          </div>
          <div>
            <label style={{display: "inline"}}>m2:</label>
            <input
              value={args.m2}
              onChange={(e) => setArgs({
                ...args,
                m2: e.target.value
              })} />
          </div>
        </div>
        {includes(parts, '1') && <div>
          <div>
            <label style={{ display: "inline" }}>x3:</label>
            <input
              value={args.x3}
              onChange={(e) => setArgs({
                ...args,
                x3: e.target.value
              })} />
            &nbsp;
            <label style={{ display: "inline" }}>y3:</label>
            <input
              value={args.y3}
              onChange={(e) => setArgs({
                ...args,
                y3: e.target.value
              })} />
          </div>
        </div>}
        <div>
          <h3>Questions:</h3>
          <p>
            <a href="https://en.wikipedia.org/wiki/Eccentricity_(mathematics)#:~:text=semi%2Dminor%20axis.-,General%20form%5Bedit%5D,-When%20the%20conic">Eccentricity determinant?</a>
          </p>
          <p>
            Better way of finding controll point with minimum Eccentricity: <a href="https://math.stackexchange.com/questions/2204258/roundest-ellipse-with-specified-tangents">link</a>
          </p>
        </div>

      </div>

    </div>
  );
};
