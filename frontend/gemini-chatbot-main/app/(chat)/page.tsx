import { MonoLogo } from "@/components/custom/mono-logo";
import { WelcomeForm } from "@/components/custom/welcome-form";
import { MonoVisual } from "@/components/custom/mono-visual";

export default async function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Left Side - Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-black dark:bg-white flex-col items-center justify-center p-12">
        <MonoVisual />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <MonoLogo size="lg" className="mb-6" />
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-light text-black dark:text-white leading-tight">
              First things first, people call us <span className="font-medium">"mono"</span>.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light max-w-md">
              We're here to help you focus on what matters most.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-md">
          <WelcomeForm />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center lg:text-left">
          <p className="text-sm text-gray-400 dark:text-gray-600 font-light">
            Simple. Focused. Minimal.
          </p>
        </div>
      </div>
    </div>
  );
}
