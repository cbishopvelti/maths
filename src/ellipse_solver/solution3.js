import nerdamer, {solveEquations, diff} from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
import { calculatePoints, renderPoints } from '../week1/utils';
import { map } from 'lodash';


const distance = (x1, y1, x2, y2) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

const findV = (x1, y1, m1, x2, y2, m2) => {
  const eq1 = nerdamer('y=m*x + c', {
    y: y1,
    x: x1,
    m: m1
  })
  const c1 = eq1.solveFor('c')[0].valueOf()
  const eq2 = nerdamer('y=m*x + c', {
    y: y2,
    x: x2,
    m: m2
  })
  const c2 = eq2.solveFor('c')[0].valueOf()

  const result = solveEquations([
    `y=${m1}*x + ${c1}`,
    `y=${m2}*x + ${c2}`
  ])

  return result;
}

export const solver3 = (ctx, opts, args) => {

  const x1 = args.x1;
  const y1 = args.y1
  const m1 = args.m1
  const x2 = args.x2;
  const y2 = args.y2
  const m2 = args.m2

  // nerdamer.set("suppress_errors", true)
  // A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + E*${y1} = 1
  const eq1_expr = nerdamer(`A*${x1**2} + B*${x1*y1} + C*${y1**2} + D*${x1} + F*${y1} = 1`)
  // (2x₁)A + (m₁x₁ + y₁)B   + (2m₁y₁)C   + D + (m₁)F = 0
  // const eq2_expr = nerdamer(`(-(2*A*${x1} + B*${y1} + D) / (B*${x1} + 2*C*${y1} + F)) = ${m1}`)
  // -2*A*${x1} + B*${y1} + D = B*${m1 * x1} + 2*C*${m1+y1} + F*${m1}
  // -2*A*${x1} + B*${y1 - m1*x1} + D = 2*C*${m1*y1} + F*${m1}
  // -2*A*${x1} + B*${y1 - m1*x1} + D - 2*C*${m1*y1} - F*${m1} = 0
  const eq2_expr = nerdamer(`-2*A*${x1} + B*${y1 - m1*x1} + D - 2*C*${m1*y1} - F*${m1} = 0`)
  const eq3_expr = nerdamer(`A*${x2**2} + B*${x2*y2} + C*${y2**2} + D*${x2} + F*${y2} = 1`)
  // const eq4_expr = nerdamer(`(-(2*A*${x2} + B*${y2} + D) / (B*${x2} + 2*C*${y2} + F)) = ${m2}`)
  const eq4_expr = nerdamer(`-2*A*${x2} + B*${y2 - m2*x2} - 2*C*${m2*y2} + D - F*${m2} = 0`)

  const {x: Vx, y: Vy} = findV(x1, y1, m1, x2, y2, m2)

  // https://math.stackexchange.com/questions/2204258/roundest-ellipse-with-specified-tangents
  const Mx = x1 + (x2 - x1)/2
  const My = y1 + (y2 - y1)/2

  const AM = distance(x1, y1, Mx, My)
  const VM = distance(Vx, Vy, Mx, My)
  const MD = (AM**2 + AM*Math.sqrt( AM**2 + VM**2 )) / VM
  const MV = distance(Mx, My, Vx, Vy)


  const Dx = ((Mx - Vx) / MV) * (MV + MD) + Vx
  const Dy = ((My - Vy) / MV) * (MV + MD) + Vy

  const eq5_expr = nerdamer(`A*${Dx**2} + B*${Dx*Dy} + C*${Dy**2} + D*${Dx} + F*${Dy} = 1`)

  console.time("002")
  const results = solveEquations([
    eq1_expr.toString(),
    eq3_expr.toString(),
    eq2_expr.toString(),
    eq4_expr.toString(),
    eq5_expr.toString(),
  ]/* , ['A', 'B', 'C', 'D', 'F'] */)
  console.timeEnd("002")

  console.log("002", results)

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


}
