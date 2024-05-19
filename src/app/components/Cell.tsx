import { MouseEvent } from "react";

const DEFAULT_CELL_SIZE = 20;

export default function Cell({
  zoom = 0,
  onMouseEnter,
  active,
  coord,
}: {
  zoom: number;
  coord: number[];
  onMouseEnter: (event: MouseEvent) => void;
  active: boolean;
}) {
  const [x, y] = coord;
  return (
    <div
      style={{
        width: Math.max(DEFAULT_CELL_SIZE + zoom),
        height: Math.max(DEFAULT_CELL_SIZE + zoom),
        backgroundColor: active ? "white" : "transparent",
      }}
      className="border-gray-600 border-[1px] flex-shrink-0 text-red-500 cursor-pointer"
      onMouseEnter={onMouseEnter}
    ></div>
  );
}
