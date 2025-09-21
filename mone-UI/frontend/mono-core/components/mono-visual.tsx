export function MonoVisual() {
  return (
    <div className="relative w-full max-w-lg h-96 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Large circle with pulse animation */}
        <div className="absolute top-12 left-8 w-32 h-32 border-2 border-background/30 rounded-full animate-pulse"></div>
        <div className="absolute top-14 left-10 w-28 h-28 border border-background/20 rounded-full"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-32 right-12 w-16 h-16 border border-background/40 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-36 right-16 w-8 h-8 border border-background/30 rotate-45"></div>
        
        {/* Dynamic dots */}
        <div className="absolute top-8 right-8 w-4 h-4 bg-background/50 rounded-full animate-bounce"></div>
        <div className="absolute bottom-16 left-16 w-6 h-6 bg-background/40 rounded-full animate-pulse"></div>
        <div className="absolute top-24 left-24 w-2 h-2 bg-background/30 rounded-full"></div>
        
        {/* Elegant plus signs */}
        <div className="absolute top-20 right-32 text-background/30 text-2xl font-light animate-pulse">⋄</div>
        <div className="absolute bottom-20 right-20 text-background/20 text-lg font-light">⋄</div>
        <div className="absolute bottom-32 left-32 text-background/25 text-sm font-light">⋄</div>
      </div>

      {/* Central focus element - refined cup design */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Enhanced cup shape */}
        <div className="relative group">
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-background/20 blur-xl rounded-full scale-150"></div>
          
          {/* Cup body with gradient effect */}
          <div className="relative w-28 h-36 border-4 border-background/80 rounded-b-3xl bg-gradient-to-b from-transparent via-background/5 to-background/10"></div>
          
          {/* Elegant handle */}
          <div className="absolute -right-5 top-5 w-8 h-14 border-4 border-background/80 border-l-0 rounded-r-2xl bg-transparent"></div>
          
          {/* Coffee content with animation */}
          <div className="absolute inset-x-3 bottom-3 top-8 bg-background/90 rounded-b-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center relative">
              {/* Coffee surface ripple effect */}
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-background/60 to-transparent animate-pulse"></div>
              <div className="text-foreground text-3xl font-mono font-light">M</div>
            </div>
          </div>
          
          {/* Steam effect */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-6 bg-background/30 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-4 bg-background/20 rounded-full animate-pulse delay-300 ml-2 -mt-4"></div>
            <div className="w-1 h-5 bg-background/25 rounded-full animate-pulse delay-500 -ml-3 -mt-3"></div>
          </div>
        </div>

        {/* Enhanced subtitle section */}
        <div className="mt-12 text-center">
          <p className="text-background/90 text-xl font-light tracking-wider leading-relaxed">
            Clarity in simplicity
          </p>
          <div className="mt-4 flex items-center justify-center space-x-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-background/60 to-background/20"></div>
            <div className="w-3 h-3 border border-background/50 rounded-full animate-pulse"></div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-background/60 to-background/20"></div>
          </div>
          <p className="text-background/60 text-sm font-light mt-3 tracking-widest">
            FOCUS • MINIMAL • ELEGANT
          </p>
        </div>
      </div>
    </div>
  );
}
