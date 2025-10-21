"use client"
import WaitlistModal from "./waitlist-modal"
import { useState } from "react"
import type { Language } from "@/lib/translations"
import { translations } from "@/lib/translations"
import Image from "next/image"
import { motion } from "framer-motion"

interface HeroContentProps {
  language: Language
}

export default function HeroContent({ language }: HeroContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const t = translations[language]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
    },
  }

  return (
    <>
      <main className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-2xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-6 relative"
            style={{
              filter: "url(#glass-effect)",
            }}
          >
            <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            <span className="text-white/90 text-xs font-light relative z-10">{t.badge}</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl md:leading-tight tracking-tight font-light text-white mb-6 flex flex-col items-center gap-4"
          >
            <Image
              src="/zenith-logo.svg"
              alt="Zenith"
              width={280}
              height={93}
              className="w-[200px] md:w-[280px] h-auto"
              style={{
                filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
              }}
              priority
            />
            <span className="text-3xl md:text-5xl">
              {t.headline2}
              <br />
              <span className="font-light italic instrument">{t.headline3}</span> {t.headline4}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-sm font-light text-white/70 mb-8 leading-relaxed max-w-xl mx-auto"
          >
            {t.description}
          </motion.p>

          <motion.div variants={itemVariants} transition={{ duration: 0.8, ease: "easeOut" }} className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full bg-[#d3ff33] text-[#191919] font-medium text-sm transition-all duration-200 hover:bg-[#a8cc29] cursor-pointer"
            >
              {t.cta}
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Waitlist modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} language={language} />
    </>
  )
}
