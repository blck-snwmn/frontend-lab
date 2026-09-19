import { track } from "ripple";

export function App() @{
  const count = track(0);

  <div>
    <h1>{"Ripple Demo"}</h1>
    <p>{"TypeScript-first UI Framework"}</p>
    <div>
      <p>{`Count: ${count.value}`}</p>
      <button onClick={() => { count.value--; }}>
        {"-"}
      </button>
      <button onClick={() => { count.value++; }}>
        {"+"}
      </button>
      <button onClick={() => { count.value = 0; }}>
        {"Reset"}
      </button>
    </div>
  </div>
}
