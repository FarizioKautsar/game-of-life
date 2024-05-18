import { MouseEvent } from "react";

const DEFAULT_CELL_SIZE = 20;

export default function Cell({
  zoom = 0,
  onMouseEnter,
  active,
}: {
  zoom: number;
  onMouseEnter: (event: MouseEvent) => void;
  active: boolean;
}) {
  return (
    <div
      style={{
        width: DEFAULT_CELL_SIZE + zoom,
        height: DEFAULT_CELL_SIZE + zoom,
        backgroundColor: active ? "white" : "transparent",
      }}
      className="border-gray-600 border-[1px] flex-shrink-0"
      onMouseEnter={onMouseEnter}
    ></div>
  );
}
