"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const DEFAULT_GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#"
const GLITCH_DISPLAY_WORD = "CONNECTED"

export const CreativeWordShuffle = ({
  words,
  className,
  shuffleInterval = 2500,
  glitchDuration = 600,
  glitchChars = DEFAULT_GLITCH_CHARS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState(words[0])
  const [isGlitching, setIsGlitching] = useState(false)

  const wordCycleTimer = useRef(null)
  const animationFrameId = useRef(null)

  useEffect(() => {
    return () => {
      if (wordCycleTimer.current) clearTimeout(wordCycleTimer.current)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  useEffect(() => {
    setDisplayText(words[currentIndex])
    if (wordCycleTimer.current) clearTimeout(wordCycleTimer.current)
    wordCycleTimer.current = setTimeout(() => {
      setIsGlitching(true)
    }, shuffleInterval)
  }, [currentIndex, words, shuffleInterval])

  useEffect(() => {
    if (isGlitching) {
      let startTime = null
      const nextActualWordIndex = (currentIndex + 1) % words.length

      const animateGlitch = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = timestamp - startTime

        if (progress < glitchDuration) {
          let glitchedConnectedText = ""
          for (let i = 0; i < GLITCH_DISPLAY_WORD.length; i++) {
            // Increased probability of showing original char for a "smoother" look
            if (Math.random() > 0.1) {
              glitchedConnectedText += GLITCH_DISPLAY_WORD[i]
            } else {
              glitchedConnectedText += glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
          }
          setDisplayText(glitchedConnectedText)
          animationFrameId.current = requestAnimationFrame(animateGlitch)
        } else {
          setIsGlitching(false)
          setCurrentIndex(nextActualWordIndex)
        }
      }
      animationFrameId.current = requestAnimationFrame(animateGlitch)
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [isGlitching, currentIndex, words, glitchDuration, glitchChars])

  return (
    <motion.span
      className={className}
      data-glitching={isGlitching}
      style={{ display: "inline-block", originX: 0.5, originY: 0.5 }}
      // Increased scale down effect and smoother transition
      animate={{ scale: isGlitching ? 0.85 : 1 }}
      transition={{ duration: 0.25, ease: "circOut" }}
    >
      {displayText}
    </motion.span>
  )
}
