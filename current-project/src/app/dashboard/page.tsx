"use client"

import Main from "./main"
import Header from "@/components/header"
import {redirect} from "next/navigation"
import useAuth from "@/lib/useAuth"

export default function DemoPage() {
  const user = useAuth();

  if (!user) {
    redirect('/login'); // Next.js App Router redirect
  }

  return (
    <div>
       <Header></Header>
      <div className="container mx-auto py-20">
        <Main></Main>
      </div>
    </div>
  )
}
