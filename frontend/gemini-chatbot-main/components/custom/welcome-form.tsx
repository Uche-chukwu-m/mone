'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function WelcomeForm() {
  const [firstName, setFirstName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim()) {
      // Store the name in localStorage for now (could be extended to use a proper state management solution)
      localStorage.setItem('userFirstName', firstName.trim());
      // Navigate to the chat interface
      router.push('/chat');
    }
  };

  const handleContinue = () => {
    if (firstName.trim()) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Question */}
      <div className="space-y-2">
        <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
          What should we call you?
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label 
            htmlFor="firstName" 
            className="block text-base font-medium text-black dark:text-white"
          >
            Name
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Your first name"
            className="mono-input mono-transition w-full px-4 py-4 text-base border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-black text-black dark:text-white
                     focus:border-black dark:focus:border-white focus:ring-0
                     rounded-md font-normal
                     placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
          />
        </div>

        <Button
          type="submit"
          onClick={handleContinue}
          disabled={!firstName.trim()}
          className="mono-button mono-transition w-full py-4 px-6 text-base font-medium
                   bg-black dark:bg-white text-white dark:text-black
                   hover:bg-gray-800 dark:hover:bg-gray-200
                   disabled:bg-gray-300 dark:disabled:bg-gray-700
                   disabled:text-gray-500 dark:disabled:text-gray-400
                   disabled:cursor-not-allowed
                   rounded-md
                   border border-black dark:border-white
                   focus:ring-0 focus:outline-none
                   transition-all duration-200"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
