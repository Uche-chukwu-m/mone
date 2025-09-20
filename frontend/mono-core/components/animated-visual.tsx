'use client';

import { motion } from 'framer-motion';

interface AnimatedVisualProps {
  variant: 'welcome' | 'goal' | 'income' | 'rent' | 'debt' | 'loading';
}

export function AnimatedVisual({ variant }: AnimatedVisualProps) {
  
  const getIcon = () => {
    switch (variant) {
      case 'welcome':
        return (
          <div className="flex items-center justify-center">
            <div className="text-background font-bold tracking-wider">
              {['m', 'o', 'n', 'o'].map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-6xl"
                  animate={{
                    y: [0, -15, 0],
                    rotateZ: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        );
      case 'goal':
        return (
          <div className="relative w-24 h-20">
            {/* Simple piggy bank silhouette */}
            <svg width="96" height="80" viewBox="0 0 96 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-background">
              {/* Main body */}
              <ellipse cx="48" cy="45" rx="32" ry="20" fill="currentColor"/>
              {/* Head/snout */}
              <ellipse cx="20" cy="40" rx="12" ry="10" fill="currentColor"/>
              {/* Legs */}
              <rect x="28" y="60" width="6" height="12" fill="currentColor"/>
              <rect x="38" y="60" width="6" height="12" fill="currentColor"/>
              <rect x="52" y="60" width="6" height="12" fill="currentColor"/>
              <rect x="62" y="60" width="6" height="12" fill="currentColor"/>
              {/* Ear */}
              <polygon points="45,25 50,20 55,25" fill="currentColor"/>
              {/* Tail */}
              <path d="M75 40 Q85 35 80 45 Q85 50 75 45" fill="currentColor"/>
              {/* Coin slot */}
              <rect x="40" y="28" width="16" height="3" rx="1.5" fill="var(--foreground)"/>
              {/* Eye */}
              <circle cx="25" cy="37" r="2" fill="var(--foreground)"/>
              {/* Nostril */}
              <circle cx="15" cy="40" r="1" fill="var(--foreground)"/>
            </svg>
          </div>
        );
      case 'income':
        return (
          <div className="relative">
            <div className="text-background text-6xl font-bold">$</div>
          </div>
        );
      case 'rent':
        return (
          <div className="relative w-24 h-20">
            {/* Simple house silhouette */}
            <svg width="96" height="80" viewBox="0 0 96 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-background">
              {/* House body */}
              <rect x="16" y="32" width="64" height="48" fill="currentColor"/>
              {/* Roof */}
              <polygon points="8,40 48,8 88,40" fill="currentColor"/>
              {/* Door */}
              <rect x="40" y="56" width="16" height="24" fill="var(--foreground)" fillOpacity="0.3"/>
              {/* Windows */}
              <rect x="24" y="40" width="12" height="12" fill="var(--foreground)" fillOpacity="0.2"/>
              <rect x="60" y="40" width="12" height="12" fill="var(--foreground)" fillOpacity="0.2"/>
              {/* Chimney */}
              <rect x="64" y="16" width="8" height="20" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'debt':
        return (
          <div className="w-24 h-16 bg-background border-4 border-background rounded-lg relative">
            <div className="absolute top-3 left-3 w-16 h-2 bg-foreground/30 rounded"></div>
            <div className="absolute bottom-3 right-3 text-foreground text-sm font-mono">***</div>
          </div>
        );
              case 'loading':
                return (
                  <div className="flex items-center space-x-2">
                    {[0, 1, 2].map((index) => (
                      <motion.div
                        key={index}
                        className="w-4 h-4 bg-background rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                );
      default:
        return <div className="w-4 h-4 bg-background rounded-full"></div>;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      {/* Simple floating background dots */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-background/20 rounded-full"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + (i * 0.5),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main icon with simple animations */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Subtle glow effect */}
        <motion.div
          className="absolute inset-0 bg-background/20 blur-2xl rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main icon - much bigger size to match mono text */}
        <motion.div
          className="relative flex items-center justify-center w-64 h-64"
          animate={variant !== 'loading' ? {
            y: [-20, 20, -20],
            rotate: [0, 2, -2, 0],
          } : undefined}
          transition={variant !== 'loading' ? {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          } : undefined}
          whileHover={variant !== 'loading' ? {
            scale: 1.1,
            transition: { duration: 0.3 }
          } : undefined}
        >
          <div className={variant === 'loading' ? "scale-[2]" : "scale-[3.5]"}>
            {getIcon()}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
