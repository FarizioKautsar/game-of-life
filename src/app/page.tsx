"use client";
import { MouseEvent, useEffect, useRef, useState } from "react";
import Cell from "./components/Cell";
import { useForm } from "react-hook-form";
import Button from "./components/Button";

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(0);
  const { watch, setValue, getValues } = useForm();
  const [hoveredCoord, setHoveredCoord] = useState<number[]>([0, 0]);
  const [canvasSize, setCanvasSize] = useState<number[]>([100, 100]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [xSize, ySize] = canvasSize;
  const [isInit, setIsInit] = useState(true);

  useEffect(() => {
    if (isDrawing) {
      const [x, y] = hoveredCoord;
      if (isInit) {
        setValue(`initMatrix.${x}.${y}`, true);
      }
      setValue(`matrix.${x}.${y}`, true);
    }
  }, [isDrawing, hoveredCoord, setValue, isInit]);

  function handleMouseHover(
    x: number,
    y: number
  ) {
    setHoveredCoord([x, y]);
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
      <div
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
      >
        {Array.from({ length: xSize }).map((_x, x) => (
          <div className="flex" key={x}>
            {Array.from({ length: ySize }).map((_y, y) => (
              <Cell
                key={y}
                zoom={zoom}
                isHovered={hoveredCoord[0] === x && hoveredCoord[1] === y}
                onMouseEnter={() => handleMouseHover(x, y)}
                active={watch(`matrix.${x}.${y}`) || false}
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
