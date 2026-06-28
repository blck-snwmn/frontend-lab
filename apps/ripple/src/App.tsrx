import { track } from "ripple";

export function App() @{
  let &[count] = track(0);

  <div>
    <h1>{"Ripple Demo"}</h1>
    <p>{"TypeScript-first UI Framework"}</p>
    <div>
      <p>{`Count: ${count}`}</p>
      <button onClick={() => { count--; }}>
        {"-"}
      </button>
      <button onClick={() => { count++; }}>
        {"+"}
      </button>
      <button onClick={() => { count = 0; }}>
        {"Reset"}
      </button>
    </div>
  </div>
}
