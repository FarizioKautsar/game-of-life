import classNames from "classnames";
import React from "react";

export default function Button({
  className,
  children,
  ...rest
}: {
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "bg-slate-400 hover:bg-slate-600 active:bg-slate-700",
        "cursor-pointer rounded disabled:cursor-not-allowed",
        "disabled:bg-slate-800",
        "px-4 py-2 ml-2",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
