"use client";

import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function InputUnderline({
  className = "",
  ...props
}: Props) {
  return (
    <input
      {...props}
      className={`
        w-full

        /* RESET GLOBAL INPUT STYLE */
        border-0
        rounded-none
        shadow-none
        bg-transparent

        /* ONLY UNDERLINE */
        border-b-2 border-green-500

        outline-none
        focus:outline-none
        focus:ring-0

        text-gray-800

        appearance-none
        -webkit-appearance-none
        px-0
        py-1

        ${className}
      `}
    />
  );
}