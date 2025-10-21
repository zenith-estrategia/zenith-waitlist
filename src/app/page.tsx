"use client"

import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import LanguageSelector from "@/components/language-selector"
import { useState } from "react"
import type { Language } from "@/lib/translations"

export default function ShaderShowcase() {
  const [language, setLanguage] = useState<Language>("pt")

  return (
    <ShaderBackground>
      <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      <HeroContent language={language} />
      <PulsingCircle language={language} />
    </ShaderBackground>
  )
}
