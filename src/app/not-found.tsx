"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import ShaderBackground from "@/components/shader-background";
import LanguageSelector from "@/components/language-selector";
import { translations, type Language } from "@/lib/translations";

export default function NotFound() {
  const [language, setLanguage] = useState<Language>("pt");
  const t = translations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#191919]">
      <div className="absolute inset-0 z-0">
        <ShaderBackground>{null}</ShaderBackground>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Image
              src="/zenith-logo.svg"
              alt="Zenith Logo"
              width={200}
              height={66}
              className="w-[200px] md:w-[280px] h-auto drop-shadow-[0_0_25px_rgba(211,255,51,0.3)] drop-shadow-[0_0_50px_rgba(211,255,51,0.15)]"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-4"
          >
            <h1 className="text-[120px] md:text-[180px] font-bold text-[#d3ff33] leading-none tracking-tight">
              {t.notFoundTitle}
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance"
          >
            {t.notFoundHeadline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-xl text-pretty leading-relaxed"
          >
            {t.notFoundDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#191919] bg-[#d3ff33] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(211,255,51,0.5)]"
            >
              <span className="relative z-10">{t.notFoundCta}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d3ff33] to-[#a8cc29] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
