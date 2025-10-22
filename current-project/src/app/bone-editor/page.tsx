"use client"

import Left from "./Left"
import Right from "./Right"
import ResponsiveLayout from "./responsiveLayout"
import { BoneDataProvider } from "./context/BoneDataContext"
import { Suspense } from "react"

function Left2() {
    return (
        <div>
            <Left />
        </div>
    )
}

function Right2() {
    return (
        <div>
            <Right />
        </div>
    )
}

function HomeContent() {
    return <ResponsiveLayout Left={Left2} Right={Right2} />
}

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BoneDataProvider>
                <HomeContent />
            </BoneDataProvider>
        </Suspense>
    )
}