"use client"
import { ClerkProvider } from "@clerk/nextjs"
import React, { ReactNode } from "react"

type Props = {
  children: ReactNode
}
function ClerkAuthProvider({ children }: Props) {
  return <ClerkProvider>{children}</ClerkProvider>
}

export default ClerkAuthProvider
