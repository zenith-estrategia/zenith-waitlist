"use client"

import { PulsingBorder } from "@paper-design/shaders-react"
import { motion } from "framer-motion"
import type { Language } from "@/lib/translations"
import { translations } from "@/lib/translations"

interface PulsingCircleProps {
  language: Language
}

export default function PulsingCircle({ language }: PulsingCircleProps) {
  const t = translations[language]

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.8 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 1, delay: 1, ease: [0.25, 0.4, 0.25, 1] }}
      className="absolute bottom-8 right-8 z-30"
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Pulsing Border Circle */}
        <PulsingBorder
          colors={["#d3ff33", "#a8cc29", "#7d9920", "#191919", "#2a2a2a", "#3d3d3d"]}
          colorBack="#00000000"
          speed={1.2}
          roundness={1}
          thickness={0.1}
          softness={0.2}
          intensity={5}
          spotSize={0.1}
          pulse={0.1}
          smoke={0.5}
          smokeSize={4}
          scale={0.75}
          rotation={0}
          frame={9161408.251009725}
          style={{
            width: "75px",
            height: "75px",
            borderRadius: "50%",
          }}
        />

        {/* Rotating Text Around the Pulsing Border */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.85)" }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
          </defs>
          <text className="text-xs fill-white/80 instrument tracking-wide">
            <textPath href="#circle" startOffset="0%">
              {t.circleText}
            </textPath>
          </text>
        </motion.svg>
      </div>
    </motion.div>
  )
}
