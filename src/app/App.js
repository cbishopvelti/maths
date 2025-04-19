import { useRef, useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { render } from './render';
import { Week1 } from '../week1';

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
          listStyle: "none", /* Remove default bullets */
          display: "flex",    /* Make the ul a flex container */
          gap: "15px" /* Adjust space as needed */
        }}>
          <li>
            {/* Use Link component for client-side navigation */}
            <Link to="/week1/1">Week 1</Link>
          </li>
        </ul>
      </nav>
      {/* <canvas ref={canvasRef} id="canvas"
        width={opts.width}
        height={opts.height}
       /> */}
      <Routes>
        <Route path="/week1/:part" element={<Week1 />} />
      </Routes>
    </div>
  );
}

export default App;
