'use client';

export function MonoVisual() {
  return (
    <div className="relative w-full max-w-md h-96 flex items-center justify-center">
      {/* Background geometric shapes */}
      <div className="absolute inset-0">
        {/* Large circle */}
        <div className="absolute top-12 left-8 w-32 h-32 border-2 border-white dark:border-black rounded-full opacity-20"></div>
        
        {/* Medium square */}
        <div className="absolute top-32 right-12 w-16 h-16 border border-white dark:border-black opacity-30 rotate-45"></div>
        
        {/* Small circles */}
        <div className="absolute top-8 right-8 w-4 h-4 bg-white dark:bg-black rounded-full opacity-40"></div>
        <div className="absolute bottom-16 left-16 w-6 h-6 bg-white dark:bg-black rounded-full opacity-30"></div>
        
        {/* Plus signs */}
        <div className="absolute top-20 right-32 text-white dark:text-black text-2xl opacity-25 font-light">+</div>
        <div className="absolute bottom-20 right-20 text-white dark:text-black text-lg opacity-20 font-light">+</div>
      </div>

      {/* Central focus element - minimalist cup/container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Cup shape */}
        <div className="relative">
          {/* Cup body */}
          <div className="w-24 h-32 border-4 border-white dark:border-black rounded-b-2xl bg-transparent"></div>
          
          {/* Cup handle */}
          <div className="absolute -right-4 top-4 w-6 h-12 border-4 border-white dark:border-black border-l-0 rounded-r-xl bg-transparent"></div>
          
          {/* Content inside cup - representing focus/clarity */}
          <div className="absolute inset-x-2 bottom-2 top-6 bg-white dark:bg-black rounded-b-xl opacity-90">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-black dark:text-white text-2xl font-mono">M</div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-8 text-center">
          <p className="text-white dark:text-black text-lg font-light tracking-wide">
            Clarity in simplicity
          </p>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <div className="w-8 h-px bg-white dark:bg-black opacity-50"></div>
            <div className="w-2 h-2 bg-white dark:bg-black rounded-full opacity-60"></div>
            <div className="w-8 h-px bg-white dark:bg-black opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
