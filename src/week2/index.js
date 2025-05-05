import React, { useEffect, useRef, useState } from 'react';
import { getContext, render } from '../app/render';
import { drawAxis } from '../app/utils';
import { calculatePoints, calculateLinePoints, renderPoints, renderText} from '../week1/utils';
import { Link, useParams } from 'react-router-dom';
import { random, flatten, round, includes } from 'lodash';
import { solve, solve2 } from './utils';



const part1 = (ctx, opts) => {

  let t1y = (x) => [
    2*x + 4,
    -0.5 * x + 10
  ];
  const points = calculatePoints(t1y);
  const intersection = solve(2, 4, -0.5, 10);
  points.push({
    ...intersection,
    i: 'result',
    text: `P:(${round(intersection.x, 2)}, ${round(intersection.y, 2)})`
  });

  renderPoints(ctx, opts, points)
  return intersection;
}

const part2 = (ctx, opts) => {
  const angleFromHorizontalL1 = Math.atan(2);
  const angleFromHorizontalL2 = Math.atan(-0.5);
  const diffAngle = (angleFromHorizontalL1 + angleFromHorizontalL2) / 2;

  const intersection = solve(2, 4, -0.5, 10);

  const m1 = Math.tan(diffAngle);
  // 2x + 4
  // 0.5x + 10
  // y = m1 x + c
  // c = y - mx

  const m2 = -1 / m1;

  const c1 = intersection.y - m1 * intersection.x;
  const c2 = intersection.y - m2 * intersection.x;

  let y = (x) => [
    m1 * x + c1,
    m2 * x + c2
  ];
  const points = calculatePoints(y);
  points.push({
    x: 3,
    y: 9.2,
    i: 'result1',
    text: `c = ${round(m1, 2)}x + ${round(c1, 2)}`,
  });
  points.push({
    x: 3,
    y: 7.5,
    i: 'result2',
    text: `c = ${round(m2, 2)}x + ${round(c2, 2)}`,
  });
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'blue',
  }, points)
}

const part3 = (ctx, opts,) => {


  let points = [];
  points.push({
    x: 2,
    y: 8,
    i: '0'
  })
  points.push({
    x: 2,
    y: 9,
    i: '0'
  })

  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple',
  }, points)

  // x = 2
  // y = 0.33x + 8
  // y = 2/3 + 8

  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'purple',
  }, [
    {
      x: 2,
      y: (2/3) + 8,
      i: 'result1',
      text: `Q:(2, ${round((2/3) + 8, 2)})`
    }
  ]);

  // const points2 = calculatePoints((x) => [8.67]);
  // renderPoints(
  //   ctx,
  //   {...opts, strokeStyle: 'gray'},
  //   points2
  // );
}

const getR = () => {
  const Q = { x: 2, y: (2/3) + 8 };
  const P = solve(2, 4, -0.5, 10);

  const R = {
    x: ((Q.x - P.x) * (3/2)) + P.x,
    y: ((Q.y - P.y) * (3/2)) + P.y
  }
  return R;
}

const part4 = (ctx, opts) => {
  const R = getR();
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'green',
  }, [{
    ...R,
    text: `R:(${round(R.x, 2)}, ${round(R.y, 2)})`
  }])
}

const getS = () => {
  const Q = { x: 2, y: (2/3) + 8 };
  const P = solve(2, 4, -0.5, 10);

  const S = {
    x: ((Q.x - P.x) * (2)) + P.x,
    y: ((Q.y - P.y) * (2)) + P.y
  }
  return S;
}

const part5 = (ctx, opts) => {
  const S = getS();
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'yellowgreen',
  }, [{
    ...S,
    text: `S:(${round(S.x, 2)}, ${round(S.y, 2)})`
  }])
}

const part6 = (ctx, opts) => {
  const center = getR();
  const P = solve(2, 4, -0.5, 10);
  const newP = {
    x: P.x - center.x,
    y: P.y - center.y
  }

  // newP.y = newP.x * 2 + c;
  // newP.y - newP.x * 2 = c;
  // c = -1


  // y = 2x - 1
  // y = -0.5x + 0.5

  // (ellipse) x**2 / a**2 + y**2 / b**2 = 1
  // (1) (-1)**2 = a**2 * 2**2 + b**2
  // (2) 0.5**2 = a**2 * (-0.5)**2 + b**2
  // a**2 = 0.2, b**2 = 0.2
  const {a_sq, b_sq} = solve2(2, -1, -0.5, 0.5);


  // (x - center.x)**2 / a_sq + (y - center.y)**2 / b_sq = 1
  // (y - center.y)**2 / a_sq = 1 - (x - center.x)**2 / b_sq
  // (y - center.y)**2 = a_sq - ((x - center.x)**2 * a_sq) / b_sq
  // y - center.y = Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq)
  // y = Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq) + center.y

  let y = (x) => [
    Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq) + center.y,
    - Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq) + center.y
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'orange'
  }, [...points, {
    x: center.x - 1.2,
    y: center.y - 0.6,
    i: 'result',
    text: `(x - center.x)**2 / a_sq + (y - center.y)**2 / b_sq = 1`
  }]);
}

const part7 = (ctx, opts) => {
  const center = getS();
  const P = solve(2, 4, -0.5, 10);
  const newP = {
    x: P.x - center.x,
    y: P.y - center.y
  }

  // newP.y = newP.x * 2 + c;
  // newP.y - newP.x * 2 = c;
  // c = -1.3333333333333

  // newP.y - newP.x * -0.5 = c;
  // c = 0.666666666666667

  const {a_sq, b_sq} = solve2(2, -1.33333333, -0.5, 0.66666667);

  // y = 2x - 1.3333333333333
  // y = -0.5x + 0.666666666666667


  // (x - center.x)**2 / a_sq + (y - center.y)**2 / b_sq = 1

  let y = (x) => [
    Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq) + center.y,
    - Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq) + center.y
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'black'
  }, [...points, {
    x: center.x - 1.2,
    y: center.y - 0.8,
    i: 'result',
    text: `(x - center.x)**2 / a_sq + (y - center.y)**2 / b_sq = 1`
  }]);
}


// Copied from part7
const part8 = (ctx, opts) => {
  const center = {
    ...getS(),
    y: getS().y - 0.1
  };
  const P = solve(2, 4, -0.5, 10);
  const newP = {
    x: P.x - center.x,
    y: P.y - center.y
  }
  const c1 = newP.y - (newP.x * 2)
  const c2 = newP.y - newP.x * -0.5

  const {a_sq, b_sq} = solve2(2, c1, -0.5, c2);

  let y = (x) => [
    Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq) + center.y,
    - Math.sqrt(a_sq - ((x - center.x)**2 * a_sq) / b_sq) + center.y
  ]
  const points = calculatePoints(y);
  renderPoints(ctx, {
    ...opts,
    strokeStyle: 'black'
  }, [...points, {
    x: center.x - 1.2,
    y: center.y - 0.8,
    i: 'result',
    text: `(x - center.x)**2 / a_sq + (y - center.y)**2 / b_sq = 1`
  }]);
}

const localRender = (ctx, opts) => {

  drawAxis(ctx, opts)

  includes(opts.parts,'1') && part1(ctx, opts);
  includes(opts.parts,'2') && part2(ctx, opts);
  includes(opts.parts,'3') && part3(ctx, opts);
  includes(opts.parts,'4') && part4(ctx, opts);
  includes(opts.parts,'5') && part5(ctx, opts);
  includes(opts.parts,'6') && part6(ctx, opts);
  includes(opts.parts,'7') && part7(ctx, opts);
  includes(opts.parts,'8') && part8(ctx, opts);
}

export const Week2 = () => {
  const { part } = useParams();
  const [ parts, setParts ] = useState(['1', /* '2', '3', '4', '5' */ /*, '6', '7' */ '8']);

  const canvasRef = useRef(null)
  const [renderCount, setRenderCount] = useState(0);
  const opts = {
    width: 600,
    height: 600,
    scale: 150,
    scaleY: -1,
    offsetY: -8,
    offsetX: -2,
    axisOffsetY: 7,
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
          <li>
            <label htmlFor="part4">part 4</label>
            <input
              type="checkbox"
              id="part4"
              checked={includes(parts, '4')}
              onChange={(a) => onChange('4')(a)} />
          </li>
          <li>
            <label htmlFor="part5">part 5</label>
            <input
              type="checkbox"
              id="part5"
              checked={includes(parts, '5')}
              onChange={(a) => onChange('5')(a)} />
          </li>
          <li>
            <label htmlFor="part6">part 6</label>
            <input
              type="checkbox"
              id="part6"
              checked={includes(parts, '6')}
              onChange={(a) => onChange('6')(a)} />
          </li>
          <li>
            <label htmlFor="part7">part 7</label>
            <input
              type="checkbox"
              id="part7"
              checked={includes(parts, '7')}
              onChange={(a) => onChange('7')(a)} />
          </li>
          <li>
            <label htmlFor="part8">part 8</label>
            <input
              type="checkbox"
              id="part8"
              checked={includes(parts, '8')}
              onChange={(a) => onChange('8')(a)} />
          </li>
        </ul>
      </nav>
      <canvas ref={canvasRef} width={opts.width} height={opts.height} />
    </div>
  );
};
