'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Get the user's name from localStorage
    const storedName = localStorage.getItem('userFirstName');
    if (storedName) {
      setUserName(storedName);
    } else {
      // Redirect back to welcome page if no name is found
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-foreground">
            Welcome, {userName}!
          </h1>
          <p className="text-lg text-foreground/70 font-light">
            This is where the chat interface will be implemented later.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-foreground/5 border border-foreground/20 rounded-lg p-8 space-y-4">
          <h2 className="text-2xl font-medium text-foreground">Coming Soon</h2>
          <p className="text-foreground/70">
            We're building something amazing for you. The chat interface will be available soon.
          </p>
          
          {/* Back to Welcome Button */}
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-3 bg-foreground text-background rounded-md font-medium
                     hover:opacity-90 transition-opacity duration-200"
          >
            Back to Welcome
          </button>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-sm text-foreground/60 font-light">
            Simple. Focused. Minimal.
          </p>
        </div>
      </div>
    </div>
  );
}
