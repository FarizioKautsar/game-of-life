import classNames from "classnames";
import { MouseEvent } from "react";
// import { DEFAULT_CELL_SIZE } from "../page";

function getRandomColorHex() {
  // Generate a random number between 0 and 16777215
  let randomColor = Math.floor(Math.random() * 16777216);
  // Convert the number to a hexadecimal string and pad with leading zeros
  let colorHex = randomColor.toString(16).padStart(6, '0');
  // Return the color code prefixed with a '#'
  return `#${colorHex}`;
}

export default function Cell({
  onMouseEnter,
  onMouseDown,
  onMouseUp,
  onClick,
  active,
  cellSize
}: {
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
        // backgroundColor: active ? getRandomColorHex() : "transparent",
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
