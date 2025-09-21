
interface MonoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'simple' | 'decorated';
}

export function MonoLogo({ size = 'lg', className = '', variant = 'simple' }: MonoLogoProps) {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-semibold', 
    lg: 'text-4xl font-bold',
    xl: 'text-6xl font-bold'
  };

  if (variant === 'simple') {
    return (
      <div className={`mono-logo ${className}`}>
        <h1 className={`font-sans text-foreground ${sizeClasses[size]} select-none tracking-tight`}>
          mono
        </h1>
      </div>
    );
  }

  return (
    <div className={`mono-logo relative ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5 blur-xl rounded-full"></div>
      
      {/* Main logo */}
      <div className="relative">
        <h1 className={`font-sans text-foreground ${sizeClasses[size]} select-none tracking-tight`}>
          mono
        </h1>
        
        {/* Elegant underline */}
        <div className="flex justify-center mt-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
