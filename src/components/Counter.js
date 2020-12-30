import React from "react";
import { useState } from "react";

function Counter(props) {
  const [count, setCount] = useState(props.initCount);
  return (
    <>
      <p>Clicked button {count} times.</p>
      <button onClick={() => setCount(count + 1)}></button>
    </>
  );
}

export default Counter;
