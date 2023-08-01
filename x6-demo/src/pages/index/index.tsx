import { useEffect, useState, useRef } from 'react';
import Draw from '../demo/demo';

const Index = () => {
  const containerRef = useRef(null);
  let ev;
  useEffect(() => {
    ev = containerRef.current;
  }, []);

  return (
    <>
      <div>Hello</div>
      <Draw ref={containerRef} />
      <button
        onClick={() => {
          localStorage.setItem('graph', JSON.stringify(ev.graph.toJSON()));
          alert('Save into the local');
        }}
      >
        Submit
      </button>
      <button
        onClick={() => {
          const json = JSON.parse(localStorage.getItem('graph'));
          console.log(json);
          if (!json || json.length === 0) {
            alert('Empty');
            return;
          }
          ev.graph.fromJSON(json.cells);
        }}
      >
        Reset
      </button>
      <button
        onClick={() => {
          const json = JSON.parse(localStorage.getItem('graph'));
          if (!json || json.length === 0) {
            alert('Empty');
            return;
          }
          ev.init(json.cells);
        }}
      >
        Reset and Format
      </button>
    </>
  );
};

export default Index;
