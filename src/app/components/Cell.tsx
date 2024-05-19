import classNames from "classnames";
import { MouseEvent } from "react";
import { DEFAULT_CELL_SIZE } from "../page";

export default function Cell({
  zoom = 0,
  onMouseEnter,
  onMouseDown,
  onMouseUp,
  onClick,
  active,
  cellSize
}: {
  zoom: number;
  cellSize: number;
  onMouseEnter: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onClick: (event: MouseEvent) => void;
  active: boolean;
}) {
  return (
    <div
      style={{
        width: cellSize,
        height: cellSize,
        // boxShadow: active ? "0px 0px 16px 0px white" : "none",
        zIndex: active ? 10 : 0,
      }}
      className={classNames(
        // "transition-all duration-150",
        "border-[1px] flex-shrink-0 text-red-500 cursor-pointer",
        "border-gray-900 hover:border-gray-700",
        active ? "bg-white border-0" : "bg-transparent"
      )}
      onMouseEnter={(e) => onMouseEnter(e)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
    ></div>
  );
}
