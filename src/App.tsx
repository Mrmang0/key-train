import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import dictionary from "./dictionary";

function isCharCode(charCode: number) {
  if (
    (charCode > 64 && charCode < 91) ||
    (charCode > 96 && charCode < 123) ||
    charCode == 8
  )
    return true;
  return false;
}

function App() {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const ref1 = useRef<HTMLParagraphElement | null>(null);
  const ref2 = useRef<HTMLParagraphElement | null>(null);
  const wpmRef = useRef<HTMLParagraphElement | null>(null);
  const startref = useRef<Date | null>(null);
  const letterIndex = useRef(0);
  const charCount = useRef(0);
  const [dict] = useState(dictionary.trim().split("\n"));

  const seed = Math.random() * dict.length;
  const textual = dict.slice(seed, (seed + 100) % dict.length).join(" ");

  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (!ref1.current || !ref2.current || !ref.current) return;
      if (e.key == "Backspace") {
        ref.current.innerHTML = ref.current.innerHTML.substring(
          0,
          ref.current.innerHTML.length - 2
        );
      }
      if (ref2.current.innerHTML.length == 0) return;
      if (e.key.match(/[a-zA-Z ]/) && e.key.length == 1) {
        if (e.key == ref.current.innerHTML[0]) {
          charCount.current++;
          if (!startref.current) {
            startref.current = new Date();
          } else {
            if (wpmRef.current) {
              const secdiff = Math.abs(
                (new Date().getTime() - startref.current.getTime()) / 1000 / 60
              );

              const time = Math.round(
                charCount.current / 5 / secdiff
              ).toString();
              console.log(
                time,
                secdiff,
                charCount.current,
                startref.current,
                startref.current.getTime(),
                new Date(),
                new Date().getTime(),
                new Date().getTime() - startref.current.getTime()
              );
              wpmRef.current.innerHTML = time;
            }
          }
          const h1 = ref1.current.innerHTML;
          ref1.current.innerHTML =
            h1.length > 30
              ? h1.split("").reverse().slice(0, 30).reverse().join("") + e.key
              : h1 + e.key;
          ref.current.innerHTML = ref2.current.innerHTML[0];
          ref2.current.innerHTML = ref2.current.innerHTML.substring(
            1,
            ref2.current.innerHTML.length - 1
          );
        }
      }
    },
    [letterIndex]
  );
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [letterIndex]);

  return (
    <div className="flex justify-center w-full h-full items-center">
      <div className="wpm absolute top-40 flex justify-center items-center text-3xl">
        <span
          ref={wpmRef}
          className="self-center mx-4 border-2 border-white border-sold rounded-md px-4"
        >
          0
        </span>
      </div>
      <div className="flex gap-1 justify-center w-full fader items-center">
        <p
          className="border-b border-solid text-right border-y-white text-4xl basis-2/5 overflow-hidden h-10"
          ref={ref1}
        ></p>
        <p
          className="border-2 w-10 h-12 p-1 border-solid rounded-md border-yellow-200 text-4xl mx-3 text-center align-middle"
          ref={ref}
        >
          {textual[0]}
        </p>
        <p
          className="border-b border-solid border-y-white text-4xl basis-2/5 overflow-hidden h-10"
          ref={ref2}
        >
          {textual.slice(1, textual.length - 1)}
        </p>
      </div>
    </div>
  );
}

export default App;
