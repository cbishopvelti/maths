import React, { useEffect, useRef, useState } from 'react';
import { getContext, render } from '../app/render';
import { drawAxis } from '../app/utils';
import { calculatePoints, calculateLinePoints, renderPoints, renderText} from './utils';
import { Link, useParams } from 'react-router-dom';
import { random, flatten, round } from 'lodash';

const part1 = (ctx, opts) => {
  drawAxis(ctx, opts)
  // x^2 + (y-0.5)^2 = 0.25
  // (y - 0.5)^2 = 0.25 - x^2
  // y - 0.5 = Math.sqrt(0.25 - x^2)
  // y = Math.sqrt(0.25 - x^2) + 0.5

  let y = (x) => [
    Math.sqrt(0.25 - Math.pow(x, 2)) + 0.5,
    -Math.sqrt(0.25 - Math.pow(x, 2)) + 0.5,
  ];

  const points = calculatePoints(y)

  points.push({
    x: 0,
    y: 0.6,
    i: 'result',
    text: '+-Math.sqrt(0.25 - Math.pow(x, 2)) + 0.5'
  })

  renderPoints(ctx, opts, points)
}

const part2 = (ctx, opts) => {
  // (x-0.5)^2 + (y-0.5)^2 = 0.25
  drawAxis(ctx, opts)
  let y = (x) => [
    Math.sqrt(0.25 - Math.pow(x - 0.5, 2)) + 0.5,
    -Math.sqrt(0.25 - Math.pow(x - 0.5, 2)) + 0.5,
  ];

  const points = calculatePoints(y)

  points.push({
    x: 0,
    y: 1.1,
    i: 'result',
    text: '+-Math.sqrt(0.25 - Math.pow(x - 0.5, 2)) + 0.5'
  })

  renderPoints(ctx, opts, points)
}

const part3 = (ctx, opts) => {
  // (y-6)^2 + (x - 4)^2 = 9
  // y = Math.sqrt(9 - Math.pow(x - 4, 2)) + 6
  opts.scale = 20;
  let y = (x) => [
    Math.sqrt(9 - Math.pow(x - 4, 2)) + 6,
    -Math.sqrt(9 - Math.pow(x - 4, 2)) + 6,
  ];
  drawAxis(ctx, opts);
  const points = calculatePoints(y)

  points.push({
    x: 2,
    y: 10,
    i: 'result',
    text: 'y = 9, y = 3'
  })

  renderPoints(ctx, opts, points)
}

const part4 = (ctx, opts) => {
  opts.scale = 26;

  drawAxis(ctx, opts);

  // R
  const points = calculateLinePoints([{x: 5, y: 7}, {x: 6, y: 5}])
  const r = Math.sqrt(Math.pow(6 - 5, 2) + Math.pow(5 - 7, 2))
  renderPoints(ctx, {...opts, strokeStyle: 'gray'}, points)
  renderText(ctx, {...opts, strokeStyle: 'gray'}, {
    x: 5.5,
    y: 6,
    text: round(r, 2)
  })
  // EO R

  // CIRCLE
  // (x - 6)^2 + (y - 5)^2 = 5
  let y = (x) => [
    Math.sqrt(5 - Math.pow(x - 6, 2)) + 5,
    -Math.sqrt(5 - Math.pow(x - 6, 2)) + 5
  ];
  const points2 = calculatePoints(y)
  renderPoints(ctx, opts, points2)

  //dy/dx = 5-7 / 6-5 = -2x = -1 = 1/2
  // 7 = (1/2) * 5 + c = 7 - (1/2 * 5) = 4.5
  // y = 1/2x + 4.5
  const y2 = (x) => [(1/2) * x + 4.5];
  const points3 = calculatePoints(y2)
  renderPoints(ctx, opts, points3)
  renderText(ctx, opts, {
    x: 4,
    y: 9,
    text: 'y = (1/2)x + 4.5'
  })


  const point = flatten(points2)[random(0, points2.length - 1)];
  const m = -1 / ((5 - point.y) / (6 - point.x));
  const c = point.y - (m * point.x);
  let y3 = (x) => [m * x + c];
  const points4 = calculatePoints(y3)
  renderPoints(ctx, {...opts, strokeStyle: 'purple'}, points4)
  renderText(ctx, {...opts, strokeStyle: 'purple'}, {
    x: point.x,
    y: point.y,
    text: `y = ${round(m, 2)}x + ${round(c, 2)}`
  })

}

const part5 = (ctx, opts) => {
  opts.scale = 50;
  drawAxis(ctx, opts);

  const lps = calculateLinePoints([{x: -50, y: 1}, {x: 50, y: 1}]);
  renderPoints(ctx, opts, lps);


  // A
  // (x + 2)^2 + (y + 1)^2 = 4
  let y = (x) => [
    Math.sqrt(4 - Math.pow((x + 2), 2)) - 1,
    -Math.sqrt(4 - (x + 2) ** 2) - 1
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, opts, points);

  const angle = 2 * Math.atan(2 / 3);
  const m = Math.sin(angle) / Math.cos(angle)
  // 1 = (1 * m) + c;
  // 1 - (1 * m) = c;
  const c = 1 - (1 * m);
  let y2 = (x) => [
    (m * x) + c
  ]
  const points2 = calculatePoints(y2);
  renderPoints(ctx, opts, points2);
  const yb = 1 - (Math.sin(angle) * 3);
  const xb = 1 - (Math.cos(angle) * 3);
  renderText(ctx, opts, {
    x: xb,
    y: yb,
    text: `(${round(xb, 2)}, ${round(yb, 2)})`
  })

  // B
  let opts2 = {
    ...opts,
    strokeStyle: 'purple'
  }
  // (x + 0.5)^2 + (y - 1)^2 = 4
  let y3 = (x) => [
    Math.sqrt(0.25 - Math.pow((x + 2), 2)) +0.5,
    -Math.sqrt(0.25 - (x + 2) ** 2) + 0.5
  ]
  const points3 = calculatePoints(y3);
  renderPoints(ctx, opts2, points3);

  const angle2 = 2 * Math.atan(0.5 / 3);
  const m2 = Math.sin(angle2) / Math.cos(angle2)
  // 1 = (1 * m) + c;
  // 1 - (1 * m) = c;
  const c2 = 1 - (1 * m2);
  let y4 = (x) => [
    (m2 * x) + c2
  ]
  const points4 = calculatePoints(y4);
  renderPoints(ctx, opts2, points4);
  const yb2 = 1 - (Math.sin(angle2) * 3);
  const xb2 = 1 - (Math.cos(angle2) * 3);
  renderText(ctx, opts2, {
    x: xb2,
    y: yb2 - 0.3,
    text: `(${round(xb2, 2)}, ${round(yb2, 2)})`
  })

}

const localRender = (ctx, opts) => {
  opts.part === '1' && part1(ctx, opts);
  opts.part === '2' && part2(ctx, opts);
  opts.part === '3' && part3(ctx, opts);
  opts.part === '4' && part4(ctx, opts);
  opts.part === '5' && part5(ctx, opts);
}

export const Week1 = () => {
  const { part } = useParams();

  const canvasRef = useRef(null)
  const [renderCount, setRenderCount] = useState(0);
  const opts = {
    width: 600,
    height: 600,
    scale: 200,
    scaleY: -1,
    part
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


  return (
    <div>
      <nav>
        <ul style={{
          listStyle: "none", /* Remove default bullets */
          display: "flex",    /* Make the ul a flex container */
          gap: "15px" /* Adjust space as needed */
        }}>
          <li><Link to="/week1/1">Part 1</Link></li>
          <li><Link to="/week1/2">Part 2</Link></li>
          <li><Link to="/week1/3">Part 3</Link></li>
          <li><Link to="/week1/4">Part 4</Link></li>
          <li><Link to="/week1/5">Part 5</Link></li>
        </ul>
      </nav>
      <canvas ref={canvasRef} width={opts.width} height={opts.height} />
    </div>
  );
};
