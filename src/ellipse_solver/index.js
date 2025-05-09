import React, { useEffect, useRef, useState } from 'react';
import { getContext, render } from '../app/render';
import { drawAxis } from '../app/utils';
import { Link, useParams } from 'react-router-dom';
import { random, flatten, round, includes, reduce, map, isNumber } from 'lodash';
import { calculatePoints, renderPoints } from '../week1/utils';
// import { lusolve } from 'mathjs';
import nerdamer, {solveEquations} from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
import { solve } from '../week2/utils';
import { e } from 'mathjs';
import Algibrite from 'algebrite';
// import { greeting, logGreeting } from 'Lib';


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
  // const eq5_expr = nerdamer(`${e**2} = (2 * sqrt((A+C)^2 + B^2)) / ( sqrt((A+C)^2 + B^2) - abs(A+C) )`)
  const eq5_expr = nerdamer(`A*${x3**2} + B*${x3*y3} + C*${y3**2} + D*${x3} + F*${y3} = 1`)

  // WORKS
  // const eq1_expr = nerdamer(`A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + F*${y1} = 1`)
  // const eq2_expr = nerdamer(`A*${x2**2} + B*${x2*y2} + C*${y2**2} + D*${x2} + F*${y2} = 1`)
  // const eq3_expr = nerdamer(`A*${x3**2} + B*${x3*y3} + C*${y3**2} + D*${x3} + F*${y3} = 1`)
  // const eq4_expr = nerdamer(`A*${x4**2} + B*${x4*y4} + C*${y4**2} + D*${x4} + F*${y4} = 1`)
  // const eq5_expr = nerdamer(`A*${x5**2} + B*${x5*y5} + C*${y5**2} + D*${x5} + F *${y5} = 1`)

  console.time("001")
  const resultsArray = solveEquations([
    eq1_expr.toString(),
    eq2_expr.toString(),
    eq3_expr.toString(),
    eq4_expr.toString(),
    eq5_expr.toString(),
  ]/* , ['A', 'B', 'C', 'D', 'F'] */)
  console.timeEnd("001")

  const results = reduce(resultsArray, (acc, res) => {
    return {
      ...acc,
      [res[0]]: res[1]
    }
  }, { })

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
  solver(ctx, opts, args)
}

export const EllipseSolver = () => {
  const { part } = useParams();
  const [ parts, setParts ] = useState(['2']);

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
        <div>
          <div>
            <label style={{display: "inline"}}>x3:</label>
            <input
              value={args.x3}
              onChange={(e) => setArgs({
                ...args,
                x3: e.target.value
              })} />
            &nbsp;
            <label style={{display: "inline"}}>y3:</label>
            <input
              value={args.y3}
              onChange={(e) => setArgs({
                ...args,
                y3: e.target.value
              })} />
          </div>
        </div>

      </div>

    </div>
  );
};
