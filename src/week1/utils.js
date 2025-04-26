import { groupBy, values, filter, cloneDeep, first, last } from 'lodash';

export const calculateLinePoints = ([start, end]) => {
  const points = [];

  points.push(start);
  points.push(end);

  return points;
}

export const calculatePoints = (y, opts = {
  step: 0.01,
  start: -50,
  end: 50
}) => {

  let points = y(opts.start).flatMap((y, i) => {
    return { x: opts.start, y, i };
  })

  for (let x = opts.start + opts.step; x <= opts.end; x += opts.step) {
    let ys = y(x);
    points = ys.reduce((acc, y, i) => {
      acc.push({ x, y, i });
      return acc;
    }, points);
  }

  points = filter(points, (({y}) => {
    return !isNaN(y)
  }));

  return points;
}

const scalePoints = (points, opts) => {
  const { width, height } = opts;
  const scaleX = (x) => (x + opts.offsetX) * opts.scale + (opts.width / 2);
  const scaleY = (y) => (y + opts.offsetY) * opts.scale
    * opts.scaleY
    + (opts.height / 2);

  points.forEach(point => {
    point.x = scaleX(point.x);
    point.y = scaleY(point.y);
  });
  return points;
}

export const renderText = (ctx, opts, point) => {
  ctx.beginPath();
  ctx.strokeStyle = opts.strokeStyle || 'red';
  ctx.fillStyle = opts.fillStyle || opts.strokeStyle || 'red';
  ctx.font = "16px serif";

  [point] = scalePoints([point], opts);

  ctx.fillText(point.text, point.x, point.y);
}


export const renderPoints = (ctx, opts, points) => {
  // Draw the function
  ctx.beginPath();
  ctx.strokeStyle = opts.strokeStyle || 'red';
  ctx.fillStyle = opts.fillStyle || opts.strokeStyle || 'red';
  ctx.lineWidth = 1;
  ctx.font = "16px serif";


  const toRender = values(groupBy(points, 'i'));
  // if(toRender.length >= 2 && toRender.length <= 3) { // complete circle
  //   toRender[0].unshift(first(toRender[1]))
  //   toRender[0].push(last(toRender[0]))
  // }
  
  toRender.map((points) => {
    points = scalePoints(cloneDeep(points), opts);

    ctx.moveTo(points[0].x, points[0].y);
    if(points[0].text) {
      ctx.fillText(points[0].text, points[0].x, points[0].y);
    }
    for(let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
      if(points[i].text) {
        ctx.fillText(points[i].text, points[i].x, points[i].y);
      }
    }
  })

  ctx.stroke();
};
