import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "./vite.svg";
import { debounce, reduceHack, throttle, curry } from "../lib/main";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="debounce" type="button"></button>
      <button id="throttle" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

function _debounce(element: HTMLButtonElement) {
  const TEST_ARR = [1, 2, 3];
  reduceHack(TEST_ARR);
  let counter = TEST_ARR.reduce((a, b) => a + b);
  const setCounter = debounce(() => {
    element.innerHTML = `count is ${counter++}`;
  }, 300);
  element.addEventListener("click", () => setCounter());
  setCounter();
}

function _throttle(element: HTMLButtonElement) {
  function sum(a: number, b: number, c: number) {
    return a + b + c;
  }
  let counterFn = curry(sum);
  let counter = counterFn(1, 2, 3)
  const setCounter = throttle(() => {
    element.innerHTML = `count is ${counter++}`;
  }, 300);
  element.addEventListener("click", () => setCounter());
  setCounter();
}

_debounce(document.querySelector<HTMLButtonElement>("#debounce")!);
_throttle(document.querySelector<HTMLButtonElement>("#throttle")!);
