"use client";
import { useRef, useState } from "react";
import Cell from "./components/Cell";
import { useForm } from "react-hook-form";
import Button from "./components/Button";

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(0);
  const { watch, setValue, getValues } = useForm();
  const [canvasSize, setCanvasSize] = useState<number[]>([100, 100]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [xSize, ySize] = canvasSize;
  const [lastIndices, setLastIndices] = useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });
  const [isInit, setIsInit] = useState(true);

  function handleMouseHover(x: number, y: number) {
    if (isDrawing) {
      const matrix = [...(getValues("matrix") || [])];
      const lastCell = Boolean(matrix[x]?.[y]);
      if (!lastCell) {
        const points = getLinePoints(x, y, lastIndices.x, lastIndices.y);
        points.forEach((point) => {
          if (isInit) {
            setValue(`initMatrix.${point.x}.${point.y}`, true);
          }
          setValue(`matrix.${point.x}.${point.y}`, true);
        });
      }
    }
    setLastIndices({ x, y });
  }

  function getLinePoints(x0: number, y0: number, x1: number, y1: number) {
    const points: { x: number; y: number }[] = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
      points.push({ x, y });

      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    return points;
  }

  function nextStep() {
    const newMatrix = [...(getValues("matrix") || [])].map((xCoords) => [
      ...(xCoords || []),
    ]);
    for (const xStr in Array.from({ length: xSize })) {
      const x = Number(xStr);
      for (const yStr in Array.from({ length: ySize })) {
        const y = Number(yStr);

        const neighbors = [
          newMatrix[x - 1]?.[y - 1] || false,
          newMatrix[x - 1]?.[y] || false,
          newMatrix[x - 1]?.[y + 1] || false,
          newMatrix[x]?.[y - 1] || false,
          newMatrix[x]?.[y + 1] || false,
          newMatrix[x + 1]?.[y - 1] || false,
          newMatrix[x + 1]?.[y] || false,
          newMatrix[x + 1]?.[y + 1] || false,
        ];
        const isLive = Boolean(newMatrix[x]?.[y]);
        const live = !isLive && neighbors.filter(Boolean).length === 3;
        const dead =
          isLive &&
          (neighbors.filter(Boolean).length < 2 ||
            neighbors.filter(Boolean).length > 3);

        if (live) setValue(`matrix.${x}.${y}`, true);
        if (dead) setValue(`matrix.${x}.${y}`, false);
      }
    }
  }

  function handleClear() {
    setIsInit(true);
    setStep(0);
    stopPlaying();
    setValue("matrix", []);
  }

  function handleReset() {
    setIsInit(true);
    setStep(0);
    stopPlaying();
    const initMatrix = getValues("initMatrix") || [];
    setValue("matrix", initMatrix);
  }

  function handleNextStep() {
    nextStep();
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlay = () => {
    setStep((prev) => prev + 1);
    setIsPlaying(true);
    handleNextStep();

    timeoutRef.current = setTimeout(() => {
      handlePlay();
    }, 100);
  };

  const startPlaying = () => {
    setIsInit(false);
    handlePlay();
  };

  const stopPlaying = () => {
    setIsPlaying(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  function handleToggleCell(x: number, y: number) {
    setValue(`matrix.${x}.${y}`, false);
  }

  return (
    <main>
      <div className="fixed top-4 left-4 items-center">
        <Button onClick={handleNextStep}>Next</Button>
        <Button onClick={startPlaying} className="ml-2" disabled={isPlaying}>
          Play
        </Button>
        <Button className="ml-2" onClick={stopPlaying} disabled={!isPlaying}>
          Stop
        </Button>
        <Button className="ml-2" onClick={handleReset}>
          Reset
        </Button>
        <Button className="ml-2" onClick={handleClear}>
          Clear
        </Button>
        <span className="ml-2">Step: {step}</span>
      </div>
      <div>
        {Array.from({ length: xSize }).map((_x, x) => (
          <div className="flex" key={x}>
            {Array.from({ length: ySize }).map((_y, y) => {
              const active = watch(`matrix.${x}.${y}`) || false;
              return (
                <Cell
                  key={y}
                  zoom={zoom}
                  onMouseEnter={() => {
                    handleMouseHover(x, y);
                  }}
                  onMouseDown={() => setIsDrawing(true)}
                  onMouseUp={() => setIsDrawing(false)}
                  active={active}
                  onClick={() => active && handleToggleCell(x, y)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
