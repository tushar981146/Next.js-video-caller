"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(bg-black-1)",
          "--normal-text": "var(text-white)",
          "--normal-border": "var(border-none)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
