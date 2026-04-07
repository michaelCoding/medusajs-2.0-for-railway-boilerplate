"use client"

import React from "react"
import { useFormStatus } from "react-dom"
import { Spinner } from "@modules/common/icons/spinner"

export function SubmitButton({
  children,
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      data-testid={dataTestId}
      className={[
        "w-full py-3.5 bg-[#1c1c1a] text-white text-sm font-semibold rounded-xl",
        "hover:bg-[#2d2d2a] transition-all duration-200",
        "flex items-center justify-center gap-2",
        "disabled:opacity-60 disabled:cursor-wait",
        className ?? "",
      ].join(" ")}
    >
      {pending ? (
        <Spinner />
      ) : (
        <>
          {children}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </>
      )}
    </button>
  )
}
