"use client"

import Main from "./main"
import Header from "@/components/header"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {

const router = useRouter();
  useEffect(() => {
    
    const token = localStorage.getItem('authToken')
    //if (!token) {
    //  router.push('/login')
    //}
  }, [])

  return (
    <div>
       <Header></Header>
      <div className="container mx-auto py-20">
        <Main></Main>
      </div>
    </div>
  )
}
