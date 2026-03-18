import { VibrationPatterns } from "./components/VibrationPatterns";
import { HapticSlider } from "./components/HapticSlider";
import { HapticToggle } from "./components/HapticToggle";
import { HapticButtons } from "./components/HapticButtons";

function App() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Haptics Demo</h1>
        <p className="text-gray-400">
          Web Vibration API — try on a mobile device for best experience
        </p>
      </header>

      <main className="max-w-2xl mx-auto space-y-16">
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
            Vibration Patterns
          </h2>
          <VibrationPatterns />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">Interactive UI</h2>

          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-500 mb-4">Haptic Slider</p>
            <HapticSlider />
          </div>

          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-500 mb-4">Haptic Toggle</p>
            <HapticToggle />
          </div>

          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-500 mb-4">Feedback Buttons</p>
            <HapticButtons />
          </div>
        </section>
      </main>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>
          Uses the{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Web Vibration API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
