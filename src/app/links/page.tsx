"use client";

import { motion } from "framer-motion";
import { Globe, Instagram, Facebook, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ShaderBackground from "@/components/shader-background";
import LanguageSelector from "@/components/language-selector";
import type { Language } from "@/lib/translations";
import { useState } from "react";

const links = [
  {
    title: { pt: "Site", en: "Site", es: "Sitio" },
    url: "https://www.zenithestrategia.com.br",
    icon: Globe,
  },
];

const socialLinks = [
  {
    icon: Instagram,
    url: "https://instagram.com/zenith.estrategia",
    label: "Instagram",
  },
  {
    icon: Facebook,
    url: "https://facebook.com/zenith.estrategia",
    label: "Facebook",
  },
  { icon: Mail, url: "mailto:contato@zenithestrategia.com.br", label: "Email" },
];

export default function LinksPage() {
  const [language, setLanguage] = useState<Language>("pt");

  return (
    <ShaderBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
        <div className="absolute top-6 right-6 z-50">
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <Image
              src="/zenith-logo.svg"
              alt="Zenith Logo"
              width={200}
              height={67}
              className="w-48 md:w-56 h-auto drop-shadow-[0_0_15px_rgba(211,255,51,0.3)] drop-shadow-[0_0_30px_rgba(211,255,51,0.2)]"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center space-y-2"
          >
            <h1 className="text-2xl font-bold text-foreground">
              Zenith Estratégia
            </h1>
            <p className="text-muted-foreground text-sm">
              {language === "pt" && "Agência de Marketing Criativo"}
              {language === "en" && "Creative Marketing Agency"}
              {language === "es" && "Agencia de Marketing Creativo"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.url}
                  initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    href={link.url}
                    className="group relative flex items-center justify-center gap-3 w-full px-6 py-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(211,255,51,0.3)]"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.title[language]}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex justify-center gap-6 pt-4"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(211,255,51,0.3)]"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="text-center pt-8"
          >
            <p className="text-xs text-muted-foreground">
              © 2025 Zenith Estratégia.{" "}
              {language === "pt" && "Todos os direitos reservados."}
              {language === "en" && "All rights reserved."}
              {language === "es" && "Todos los derechos reservados."}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </ShaderBackground>
  );
}
