import React, { useEffect, useRef, useState } from 'react';
import { getContext, render } from '../app/render';
import { drawAxis } from '../app/utils';
import { Link, useParams } from 'react-router-dom';
import { random, flatten, round, includes } from 'lodash';
import { calculatePoints, renderPoints } from '../week1/utils';
import { solveEllipseParametersFromTwoPoints } from './utils.js';
// import { lusolve } from 'mathjs';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
import { solve } from '../week2/utils';
import { e } from 'mathjs';
import Algibrite from 'algebrite';

const part2 = (ctx, opts) => {
  // ELLIPSE
  //x**2/4 + y**2/9 = 1
  //y**2/9 = 1 - x**2 / 4
  //y**2 = 9*(1 - x**2 / 4)
  //y = Math.sqrt(9*(1 - x**2 / 4))
  const a_sq = 9;
  const a = Math.sqrt(a_sq);
  const b_sq = 4;
  const b = Math.sqrt(b_sq);
  let y = (x) => [
    Math.sqrt(a_sq*(1 - x**2 / b_sq)),
    -Math.sqrt(a_sq*(1 - x**2 / b_sq))
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'red'
  }, [...points]);

  // TANGENT
  // y = m*x + Math.sqrt(m**2 * a**2 + b**2)
  const m2 = 2;
  const l2_y = (x) => [
    m2*x + Math.sqrt((m2**2 * b**2) + a**2),
    m2*x - Math.sqrt((m2**2 * b**2) + a**2)
  ]
  const l2_points = calculatePoints(l2_y)
  renderPoints(ctx, {...opts, strokeStyle: 'red'}, l2_points)

  const m3 = -1/2;
  const l3_y = (x) => [
    m3*x + Math.sqrt((m3**2 * b**2) + a**2),
    m3*x - Math.sqrt((m3**2 * b**2) + a**2)
  ]
  const l3_points = calculatePoints(l3_y)
  renderPoints(ctx, {...opts, strokeStyle: 'red'}, l3_points)
}

const part3 = (ctx, opts) => {
  const center = { x: 8, y: 0 };
  const p1 = { x: 2, y: 4 };
  const p2 = {x: 6, y: 8}

  const p1b = {x: p1.x - center.x, y: p1.y - center.y}
  const p2b = {x: p2.x - center.x, y: p2.y - center.y}

  // x1**2 / a**2 + y1**2 / b**2 = 1
  // x2**2 / a**2 + y2**2 / b**2 = 1
  const { a, b } = solveEllipseParametersFromTwoPoints(p1b.x, p1b.y, p2b.x, p2b.y)
  const a_sq = a ** 2;
  const b_sq = b ** 2;

  const y = (x) => [
    Math.sqrt(a_sq*(1 - (x - center.x)**2 / b_sq)),
    - Math.sqrt(a_sq*(1 - (x - center.x)**2 / b_sq)),
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'green'
  }, [...points, {
    x: 6,
    y: 8,
    text: '/Point',
    fillStyle: 'blue'
  }, {
    x: 2,
    y: 4,
    text: '/Point',
    i: "point2",
    fillStyle: 'blue'
  }, {
    x: 1,
    y: -9.2,
    text: `y = Math.sqrt(${a_sq}*(1 - (x - ${center.x})**2 / ${round(b_sq, 2)}))`,
    i: "text",
    fillStyle: 'blue'
  }]);
}

const part4 = (ctx, opts) => {

  const p1 = {x: -1/2, y: 1/2}
  const p1_x_sq = p1.x ** 2;
  const p1_y_sq = p1.y ** 2;
  // const p1_x_sq = '(1/4)' // p1.x ** 2;
  // const p1_y_sq = '(1/4)' // p1.y ** 2;
  const m = 1;
  const m_sq = m ** 2;
  const c = 1;
  const c_sq = 1 ** 2;

  const y = (x) => [
    x + c
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [...points]);

  // (-1/2, 1/2)
  //
  // p1_x_sq / a_sq + p1_y_sq / b_sq = 1
  // c_sq = a_sq * m_sq + b_sq

  // const eq1 = `(${p1_x_sq} / a_sq) + (${p1_y_sq} / b_sq) = 1`;
  // const eq2 = `a_sq + b_sq = ${c_sq}`;
  const eq1_expr = nerdamer(`${p1_x_sq}/a_sq + ${p1_y_sq}/b_sq = 1`)
  const eq2_expr = nerdamer(`${m_sq} * a_sq + b_sq = ${c_sq}`)

  const b_sq_expr = eq2_expr.solveFor('b_sq');

  const eq1_substituted = eq1_expr.sub('b_sq', b_sq_expr[0])

  const a_sq_solutions = eq1_substituted.solveFor('a_sq');

  const a_sq_val = a_sq_solutions[0]
  const eq2_expr_substituted = eq2_expr.sub("a_sq", a_sq_val)
  const b_sq_solutions = eq2_expr_substituted.solveFor('b_sq');
  const b_sq_val = b_sq_solutions[0]

  const a_sq = a_sq_val.valueOf();
  const b_sq = b_sq_val.valueOf();


  // const solutions = nerdamer.solveEquations([eq1, eq2], ['asq', 'bsq']);


  const y2 = (x) => [
    Math.sqrt(a_sq*(1 - (x)**2 / b_sq)),
    - Math.sqrt(a_sq*(1 - (x)**2 / b_sq)),
  ]
  const points2 = calculatePoints(y2);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple'
  }, [
    ...points2,
    {
      ...p1,
      text: `/(${p1.x}, ${p1.y})`,
      fillStyle: 'purple'
    }
  ]);

}

const localRender = (ctx, opts) => {

  drawAxis(ctx, opts)

  includes(opts.parts,'2') && part2(ctx, opts);
  includes(opts.parts,'3') && part3(ctx, opts);
  includes(opts.parts,'4') && part4(ctx, opts);
}

export const Week3 = () => {
  const { part } = useParams();
  const [ parts, setParts ] = useState(['2']);

  const canvasRef = useRef(null)
  const [renderCount, setRenderCount] = useState(0);
  const opts = {
    width: 600,
    height: 600,
    scale: (includes(parts, '4')) ? 180 : 18,
    scaleY: -1,
    // offsetY: -8,
    // offsetX: -2,
    // axisOffsetY: 7,
    part,
    parts
  }
  let ctx;
  useEffect(() => {
    if (canvasRef?.current) {
      ctx = getContext(canvasRef?.current, opts)
      localRender(ctx, opts)
    }
  }, [canvasRef?.current])
  if (canvasRef?.current) {
    ctx = getContext(canvasRef?.current, opts)
    localRender(ctx, opts)
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
    <div>
      <nav>
        <ul style={{
          listStyle: "none", /* Remove default bullets */
          display: "flex",    /* Make the ul a flex container */
          gap: "15px" /* Adjust space as needed */
        }}>
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
          <li>
            <label htmlFor="part4">part 4</label>
            <input
              type="checkbox"
              id="part4"
              checked={includes(parts, '4')}
              onChange={(a) => onChange('4')(a)} />
          </li>
        </ul>
        <a target="_blank" rel="noreferrer" style={{marginLeft: '40px'}} href="https://github.com/cbishopvelti/maths/blob/master/src/week3/index.js">The code</a>
      </nav>
      <canvas ref={canvasRef} width={opts.width} height={opts.height} />
    </div>
  );
};
