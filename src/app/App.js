import { useRef, useEffect, useState } from 'react';
import './App.css';
import '//unpkg.com/mathlive'
import { Routes, Route, Link } from 'react-router-dom';
import { render } from './render';
import { Week1 } from '../week1';
import { Week2 } from '../week2';
import { Week3 } from '../week3';
import { EllipseSolver } from '../ellipse_solver';
import { Notes } from '../week3/notes';
import { Week5 } from '../week5';

// const observerCallback: ResizeObserverCallback = (entries: ResizeObserverEntry[]) => {
//   window.requestAnimationFrame((): void | undefined => {
//     if (!Array.isArray(entries) || !entries.length) {
//       return;
//     }
//     yourResizeHandler();
//   });
// };
// const resizeObserver = new ResizeObserver(observerCallback);

function App() {

  const canvasRef = useRef(null)

  const opts = {
    width: 500,
    height: 500
  }

  useEffect(() => {
    if (canvasRef?.current) {
      render(canvasRef?.current, opts)
    }
  }, [canvasRef?.current])
  if (canvasRef?.current) {
    render(canvasRef?.current, opts)
  }

  return (
    <div className="App">
      <nav>
        <ul style={{
          listStyle: "none",
          display: "flex",
          gap: "15px"
        }}>
          <li>
            <Link to="/week1/1">Week 1</Link>
          </li>
          <li>
            <Link to="/week2/1">Week 2</Link>
          </li>
          <li>
            <Link to="/week3/1">Week 3</Link>
          </li>
          <li>
            <Link to="/notes1">Notes</Link>
          </li>
          <li>
            <Link to="/ellipse_solver">Ellipse Solver</Link>
          </li>
          <li>
            <Link to="/week5">Week 5</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/week1/:part" element={<Week1 />} />
        <Route path="/week2/:part" element={<Week2 />} />
        <Route path="/week3/:part" element={<Week3 />} />
        <Route path="/notes1" element={<Notes />} />
        <Route path="/ellipse_solver" element={<EllipseSolver />} />
        <Route path="/week5" element={<Week5 />} />
      </Routes>
    </div>
  );
}

export default App;
