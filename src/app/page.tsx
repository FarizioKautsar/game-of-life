"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Cell from "./components/Cell";
import { useForm } from "react-hook-form";
import Button from "./components/Button";
import { throttle } from "lodash";
import { MdClear, MdNavigateNext, MdPause, MdPlayArrow, MdRefresh } from "react-icons/md";

export const DEFAULT_CELL_SIZE = 20;

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

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const { watch, setValue, getValues } = useForm();
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  const [gridSize, setGridSize] = useState<number[]>([0, 0]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [xSize, ySize] = gridSize;
  const [lastIndices, setLastIndices] = useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });
  const [isInit, setIsInit] = useState(true);

  const calculateGridSize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const rows = Math.floor(height / cellSize);
    const cols = Math.floor(width / cellSize);
    setGridSize([rows, cols]);
  }, [cellSize]);

  useEffect(() => {
    calculateGridSize();
    const handleResize = throttle(calculateGridSize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateGridSize]);

  function handleMouseHover(x: number, y: number) {
    if (isDrawing) {
      const points = getLinePoints(x, y, lastIndices.x, lastIndices.y);
      points.forEach((point) => {
        if (isInit) {
          setValue(`initMatrix.${point.x}.${point.y}`, true);
        }
        setValue(`matrix.${point.x}.${point.y}`, true);
      });
    }
    setLastIndices({ x, y });
  }

  function nextStep() {
    setStep((prev) => prev + 1);
    const newMatrix = [...(getValues("matrix") || [])].map((xCoords) => [
      ...(xCoords || []),
    ]);
    for (let x = 0; x < xSize; x++) {
      for (let y = 0; y < ySize; y++) {
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
    setValue("initMatrix", []);
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
    const selectedCoord = getValues(`matrix.${x}.${y}`);
    setValue(`matrix.${x}.${y}`, !selectedCoord);
  }

  const mainRef = useRef(null);

  // Handle wheel event to change cell size
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      setCellSize((prevSize) => {
        const newSize = prevSize + (event.deltaY > 0 ? -1 : 1);
        return Math.max(5, Math.min(newSize, 50)); // Limit cell size between 5 and 50
      });
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <main ref={mainRef} className="overflow-hidden h-screen">
      <div className="fixed top-4 left-4 z-20">
        <div className="flex items-center gap-1">
          <Button onClick={handleNextStep}>
            <MdNavigateNext className="mr-2" />
            Next
          </Button>
          <Button onClick={startPlaying} disabled={isPlaying}>
            <MdPlayArrow className="mr-2" />
            Play
          </Button>
          <Button onClick={stopPlaying} disabled={!isPlaying}>
            <MdPause className="mr-2" />
            Pause
          </Button>
          <Button onClick={handleReset}>
            <MdRefresh className="mr-2" />
            Reset
          </Button>
          <Button onClick={handleClear}>
            <MdClear className="mr-2" />
            Clear
          </Button>
          <span className="ml-3">Gen {step}</span>
        </div>
      </div>
      <div
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
      >
        {Array.from({ length: xSize }).map((_x, x) => (
          <div className="flex" key={x}>
            {Array.from({ length: ySize }).map((_y, y) => {
              const active = watch(`matrix.${x}.${y}`) || false;
              return (
                <Cell
                  key={y}
                  cellSize={cellSize}
                  onMouseEnter={() => {
                    handleMouseHover(x, y);
                  }}
                  active={active}
                  onClick={() => handleToggleCell(x, y)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
