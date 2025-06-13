import type { ReactNode } from "react"

export type ContainerProps = {
    children: ReactNode
    twClasses: string[]
    animationObject?: AnimationObject
}

export type AnimationObject = {
    entranceAnimation: string
    exitAnimation: string
    isEntering: boolean
}