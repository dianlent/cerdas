import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Confetti() {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    const pieces = []
    const colors = ['#FFD93D', '#FF8C42', '#FF6B9D', '#4ECDC4', '#A78BFA']
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2
      })
    }
    
    setConfetti(pieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: piece.x, opacity: 1, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 20, 
            rotate: 720,
            opacity: 0 
          }}
          transition={{ 
            duration: piece.duration, 
            delay: piece.delay,
            ease: 'linear'
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  )
}
