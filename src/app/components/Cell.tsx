import classNames from "classnames";
import { MouseEvent } from "react";

const DEFAULT_CELL_SIZE = 20;

export default function Cell({
  zoom = 0,
  onMouseEnter,
  onMouseDown,
  onMouseUp,
  onClick,
  active,
  isHovered,
}: {
  zoom: number;
  onMouseEnter: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onClick: (event: MouseEvent) => void;
  active: boolean;
  isHovered?: boolean;
}) {
  return (
    <div
      style={{
        width: Math.max(DEFAULT_CELL_SIZE + zoom),
        height: Math.max(DEFAULT_CELL_SIZE + zoom),
        boxShadow: active ? "0px 0px 16px 0px white" : "none",
        zIndex: active ? 10 : 0,
      }}
      className={classNames(
        "transition-all duration-150",
        "border-[1px] flex-shrink-0 text-red-500 cursor-pointer",
        isHovered ? "border-gray-600" : "border-gray-800",
        active ? "bg-white border-0" : "bg-transparent"
      )}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
    ></div>
  );
}
