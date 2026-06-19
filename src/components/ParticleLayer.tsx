import { motion, AnimatePresence } from 'motion/react';
import { Snowflake as SnowflakeIcon } from 'lucide-react';
import { Particle, EffectType } from '../types';

interface ParticleLayerProps {
  activeEffect: EffectType;
  particles: Particle[];
  theme: 'light' | 'dark';
}

const BalloonSVG = ({ color, theme }: { color: string; theme: 'light' | 'dark' }) => (
  <svg
    viewBox="0 0 44 90"
    className="w-12 h-24 selection:bg-transparent"
    style={{
      filter: theme === 'dark' 
        ? `drop-shadow(0 0 12px ${color}88) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.45))`
        : 'drop-shadow(0 12px 14px rgba(30, 41, 59, 0.12)) drop-shadow(0 4px 6px rgba(30, 41, 59, 0.08))'
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* String */}
    <path
      d="M22,54 Q18,66 25,75 T21,90"
      fill="none"
      stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Knot */}
    <polygon points="22,50 18,54 26,54" fill={color} className="brightness-90" />
    
    {/* Balloon body */}
    <ellipse cx="22" cy="28" rx="18" ry="24" fill={color} />
    
    {/* Soft subtle inner shadow mimic */}
    <ellipse cx="22" cy="28" rx="16" ry="22" fill="black" fillOpacity={theme === 'dark' ? '0.08' : '0.05'} />
    
    {/* Specular sheen/highlight for realistic 3D appearance */}
    <ellipse
      cx="16"
      cy="19"
      rx="4"
      ry="8"
      fill="white"
      fillOpacity={theme === 'dark' ? '0.4' : '0.35'}
      transform="rotate(-15 16 19)"
    />
  </svg>
);

export default function ParticleLayer({ activeEffect, particles, theme }: ParticleLayerProps) {
  return (
    <AnimatePresence>
      {activeEffect !== 'none' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
          {activeEffect === 'snowflakes' &&
            particles.map((el) => (
              <motion.div
                key={el.id}
                className="absolute origin-center flex items-center justify-center"
                style={{
                  left: 0,
                  top: 0,
                  width: el.size,
                  height: el.size,
                }}
                initial={{
                  y: '-10vh',
                  x: `${el.x}vw`,
                  rotate: el.rotate,
                  opacity: 0,
                }}
                animate={{
                  y: '110vh',
                  x: [
                    `${el.x}vw`,
                    `${el.x + el.sway * 0.5}vw`,
                    `${el.x - el.sway * 0.5}vw`,
                    `${el.x + el.sway}vw`,
                  ],
                  rotate: el.rotate + 180,
                  opacity: [0, el.opacity, el.opacity, 0],
                }}
                transition={{
                  duration: el.duration,
                  delay: el.delay,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                {theme === 'dark' ? (
                  <SnowflakeIcon
                    className="w-full h-full text-white stroke-[1.5]"
                    style={{
                      filter: `drop-shadow(0 0 8px rgba(186, 230, 253, 0.95)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))`,
                    }}
                  />
                ) : (
                  <SnowflakeIcon
                    className="w-full h-full text-cyan-800/80 stroke-[1.75]"
                    style={{
                      filter: `drop-shadow(0 2px 2px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 1px rgba(14, 165, 233, 0.3))`,
                    }}
                  />
                )}
              </motion.div>
            ))}

          {activeEffect === 'balloons' &&
            particles.map((el) => (
              <motion.div
                key={el.id}
                className="absolute origin-center flex items-center justify-center animate-pulse"
                style={{
                  left: 0,
                  top: 0,
                  width: 48,
                  height: 96,
                  animationDuration: '3s',
                }}
                initial={{
                  y: '110vh',
                  x: `${el.x}vw`,
                  rotate: el.rotate,
                  opacity: 0,
                }}
                animate={{
                  y: '-20vh',
                  x: `${el.x + el.sway}vw`,
                  rotate: el.rotate,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: el.duration,
                  delay: el.delay,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                <BalloonSVG color={el.color || '#E11D48'} theme={theme} />
              </motion.div>
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
