import Victor, {fromAngle} from "victor";
import {
  getVectorFromAngleDegrees,
  drawPointWithDirection,
} from './utils';
import { createEllipse } from "./ellipse";

export const getContext = (canvas, opts) => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, opts.width, opts.height)
  return ctx;
}

export const render = (canvas, opts, cbs = []) => {
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, opts.width, opts.height)

  // const p0 = new Victor(50, 50);
  // const p0_angle_vec = getVectorFromAngleDegrees(0);
  const p0 = Victor.fromObject({x: 100, y: 100});
  const p0_angle_vec = Victor.fromObject({x: 1, y: 0});
  drawPointWithDirection(ctx, p0, p0_angle_vec)

  // const p1 = new Victor(50, 180);
  // const p1_angle_vec = getVectorFromAngleDegrees(-10);
  const p1 = Victor.fromObject({x: 100, y: 200});
  const p1_angle_vec = Victor.fromObject({x: -1, y: -0.5});
  drawPointWithDirection(ctx, p1, p1_angle_vec);


  const result = createEllipse(p0, p0_angle_vec, p1, p1_angle_vec)
  // console.log("002", result)

  // // ctx.fillRect(0, 0, 400, 400)
  // ctx.beginPath();
  // ctx.ellipse(result.centerX, result.centerY, result.xAxis, result.yAxis, result.rotation, 0, Math.PI * 2);
  // ctx.ellipse(200, 200, 180, 100, Math.PI/8, 0, Math.PI * 2);
  ctx.stroke();

  cbs.map((cb) => {
    cb(ctx);
  })

  return ctx;
}
