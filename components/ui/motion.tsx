"use client"

import { motion, HTMLMotionProps } from "framer-motion"

// Brand-aligned spring transition
const springTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
}

const itemTransition = {
    type: "spring",
    stiffness: 50,
    damping: 15
}

// Variants
export const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: springTransition },
    exit: { opacity: 0, y: 10 },
}

export const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: springTransition },
    exit: { opacity: 0, y: 20 },
}

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

// Types
interface MotionComponentProps extends HTMLMotionProps<"div"> {
    delay?: number
}

export function MotionDiv({ children, className, delay = 0, ...props }: MotionComponentProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            transition={{ ...springTransition, delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function MotionList({ children, className, ...props }: HTMLMotionProps<"div">) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function MotionItem({ children, className, ...props }: HTMLMotionProps<"div">) {
    return (
        <motion.div
            variants={slideUp}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

