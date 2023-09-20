import { useState } from "react";

const Form = () => {
  const [state, setState] = useState("Hello");

  return (
    <div>
      <input onChange={(e) => setState(e.target.value)} value={state}></input>
      <button type="button" onClick={() => alert(state)}>alert</button>
    </div>
  );
};

export default Form;
