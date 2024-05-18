"use client";
import { MouseEvent, useEffect, useState } from "react";
import Cell from "./components/Cell";

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(0);
  const [activeCoords, setActiveCoords] = useState<boolean[][]>([]);
  const [hoveredCoord, setHoveredCoord] = useState<number[]>([0, 0]);
  const [canvasSize, setCanvasSize] = useState<number[]>([100, 100]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [xSize, ySize] = canvasSize;

  useEffect(() => {
    if (isDrawing) {
      const [x, y] = hoveredCoord;
      setActiveCoords((prev) => {
        // Create a new matrix copy
        const newMatrix = prev.map((row) => [...row]);

        // Ensure the row exists
        if (!newMatrix[x]) {
          newMatrix[x] = [];
        }
        
        // Ensure the column exists
        while (newMatrix[x].length <= y) {
          newMatrix[x].push(false);
        }
        newMatrix[x][y] = true;
        return newMatrix;
      });
    }
  }, [isDrawing, hoveredCoord]);

  function handleMouseHover(
    event: MouseEvent<Element, globalThis.MouseEvent>,
    x: number,
    y: number
  ) {
    setHoveredCoord([x, y]);
  }

  return (
    <main>
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
                onMouseEnter={(e) => handleMouseHover(e, x, y)}
                active={activeCoords[x]?.[y] || false}
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
