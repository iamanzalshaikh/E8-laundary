import { useState } from "react";
import { URLInputForm } from "./components/URLInputForm";
import { AITrainingForm } from "./components/AITrainingForm";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./components/ThemeToggle";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrainingPage() {
  const [step, setStep] = useState<"url" | "form">("url");
  const [initialData, setInitialData] = useState({ website: "", googleMapsUrl: "" });

  const handleURLComplete = (data: { website: string; googleMapsUrl: string }) => {
    setInitialData(data);
    setStep("form");
  };

  const handleFormComplete = (data: any) => {
    console.log("Training complete:", data);
    // Redirect or show success message is handled inside AITrainingForm
  };

  return (
    <div className="min-h-screen bg-dark text-text font-inter relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="mesh-gradient" />
      
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <ThemeToggle />
      </div>

      <Link 
        to="/" 
        className="fixed top-6 left-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-text transition-all z-50 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      
      <div className="relative z-10 pt-20 pb-20 px-6">
        <AnimatePresence mode="wait">
          {step === "url" ? (
            <motion.div
              key="url-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight font-space uppercase">
                  Let's Begin
                </h1>
                <p className="text-lg text-muted font-medium">
                  Step 1: Provide your digital presence
                </p>
              </div>
              <URLInputForm onNext={handleURLComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AITrainingForm 
                initialData={initialData} 
                onComplete={handleFormComplete} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
