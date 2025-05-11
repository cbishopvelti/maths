import React, { useEffect, useRef, useState } from 'react';
import { getContext, render } from '../app/render';
import { drawAxis } from '../app/utils';
import { Link, useParams } from 'react-router-dom';
import { random, flatten, round, includes, reduce, map, isNumber, range } from 'lodash';
import { calculatePoints, renderPoints } from '../week1/utils';
// import { lusolve } from 'mathjs';
import nerdamer, {solveEquations, diff} from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
import { solve } from '../week2/utils';
import { e } from 'mathjs';
import Algibrite from 'algebrite';
// import { greeting, logGreeting } from 'Lib';

nerdamer.set('SOLUTIONS_AS_OBJECT', true)

// https://en.wikipedia.org/wiki/Eccentricity_(mathematics)
const solver2 = (ctx, opts, args) => {
  nerdamer.set("MAX_SOLVE_DEPTH", 10_000);
  const x1 = args.x1;
  const y1 = args.y1
  const m1 = args.m1
  const x2 = args.x2;
  const y2 = args.y2
  const m2 = args.m2
  const e = 0.5
  const x3 = args.x3;
  const y3 = args.y3
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
  nerdamer.set('SOLUTIONS_AS_OBJECT', true)

  const results = solveEquations([
    eq1_expr.toString(),
    eq2_expr.toString(),
    eq3_expr.toString(),
    eq4_expr.toString()
  ], ['A', 'B', 'C', 'D'])

  const eq5a = eq5_expr
    .sub('A', results.A)
    .sub('B', results.B)
    .sub('C', results.C)
    .sub('D', results.D)


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

  const ef = reduce(range(-10, 10, 0.01), (acc, F) => {
    const e = yfn2(F)
    if (e < acc.e) {
      return {
        e: e,
        F: F
      }
    }
    return acc;
  }, {e: 9999})

  const resObj = {
    F: ef.F,
    A: nerdamer(results.A).sub('F', ef.F).valueOf(),
    B: nerdamer(results.B).sub('F', ef.F).valueOf(),
    C: nerdamer(results.C).sub('F', ef.F).valueOf(),
    D: nerdamer(results.D).sub('F', ef.F).valueOf()
  }

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
  // nerdamer.set("suppress_errors", true)
  // A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + E*${y1} = 1
  const eq1_expr = nerdamer(`A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + F*${y1} = 1`)
  const eq2_expr = nerdamer(`(-(2*A*${x1} + B*${y1} + D) / (B*${x1} + 2*C*${y1} + F)) = ${m1}`)
  const eq3_expr = nerdamer(`A*${x2**2} + B*${x2*y2} + C*${y2**2} + D*${x2} + F*${y2} = 1`)
  const eq4_expr = nerdamer(`(-(2*A*${x2} + B*${y2} + D) / (B*${x2} + 2*C*${y2} + F)) = ${m2}`)
  const eq5_expr = nerdamer(`A*${x3**2} + B*${x3*y3} + C*${y3**2} + D*${x3} + F*${y3} = 1`)

  // WORKS
  // const eq1_expr = nerdamer(`A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + F*${y1} = 1`)
  // const eq2_expr = nerdamer(`A*${x2**2} + B*${x2*y2} + C*${y2**2} + D*${x2} + F*${y2} = 1`)
  // const eq3_expr = nerdamer(`A*${x3**2} + B*${x3*y3} + C*${y3**2} + D*${x3} + F*${y3} = 1`)
  // const eq4_expr = nerdamer(`A*${x4**2} + B*${x4*y4} + C*${y4**2} + D*${x4} + F*${y4} = 1`)
  // const eq5_expr = nerdamer(`A*${x5**2} + B*${x5*y5} + C*${y5**2} + D*${x5} + F *${y5} = 1`)

  console.time("001")
  const results = solveEquations([
    eq1_expr.toString(),
    eq2_expr.toString(),
    eq3_expr.toString(),
    eq4_expr.toString(),
    eq5_expr.toString(),
  ]/* , ['A', 'B', 'C', 'D', 'F'] */)
  console.timeEnd("001")

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
}

export const EllipseSolver = () => {
  const { part } = useParams();
  const [ parts, setParts ] = useState([
    '1',
    // '2'
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
