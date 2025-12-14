"use client"

import { memo, useEffect, useRef, useState } from "react"
import { motion, useSpring, useTransform, LazyMotion, domAnimation } from "framer-motion"

interface AnimatedCounterProps {
    value: number
    prefix?: string
    suffix?: string
    className?: string
    duration?: number
    formatOptions?: Intl.NumberFormatOptions
}

function AnimatedCounterComponent({
    value,
    prefix = "",
    suffix = "",
    className = "",
    duration = 1.5,
    formatOptions = { minimumFractionDigits: 0, maximumFractionDigits: 0 }
}: AnimatedCounterProps) {
    const [isInView, setIsInView] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    const spring = useSpring(0, {
        stiffness: 50,
        damping: 30,
        duration: duration * 1000,
    })

    useEffect(() => {
        if (isInView) {
            spring.set(value)
        }
    }, [isInView, value, spring])

    const display = useTransform(spring, (current) => {
        return new Intl.NumberFormat('en-US', formatOptions).format(Math.round(current))
    })

    return (
        <LazyMotion features={domAnimation}>
            <span ref={ref} className={`tabular-nums ${className}`}>
                {prefix}
                <motion.span>{display}</motion.span>
                {suffix}
            </span>
        </LazyMotion>
    )
}

export const AnimatedCounter = memo(AnimatedCounterComponent)
