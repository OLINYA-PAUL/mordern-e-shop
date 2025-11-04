import React, { useState } from 'react';
import { X, Sparkles, Wand2, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIenhancement } from '../AIenhancement';

const AIImageModel = ({
  isOpen,
  onClose,
  selectedImageUrl,
  setSelectedImageUrl,
}: {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  selectedImageUrl: string | null;
  setSelectedImageUrl: (imageUrl: string) => void;
}) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const applyTranformationFeature = async (effect: string) => {
    if (!selectedImageUrl || processing) return;

    setProcessing(true);
    setActiveFeature(effect);

    try {
      const baseUrl = selectedImageUrl.split('?')[0];
      const transformedUrl = `${baseUrl}?tr=${effect}`;

      // Simulate short loading time for UX
      setTimeout(() => {
        setSelectedImageUrl(transformedUrl);
        setProcessing(false);
      }, 1200);
    } catch (error: any) {
      console.error(error.message);
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h2 className="text-slate-200 font-semibold text-lg">
                  AI Image Enhancement
                </h2>
              </div>
              <button
                onClick={() => onClose(false)}
                className="p-1.5 rounded-full hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="relative flex items-center justify-center bg-slate-800 p-3">
              {processing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                  <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
              )}
              <img
                src={selectedImageUrl || ''}
                alt="Enhanced product"
                className="w-[90%] object-contain max-h-[60vh] rounded-lg transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-slate-800/70 text-slate-100 px-3 py-1.5 text-sm rounded-full flex items-center gap-1 shadow-md">
                <Wand2 className="w-4 h-4 text-yellow-400" />
                Enhanced by AI
              </div>
            </div>

            {/* Bottom Filter Section */}
            <div className="border-t border-slate-700 bg-slate-800/70 p-3 flex flex-wrap items-center justify-center gap-3">
              {AIenhancement.map((feature, index) => {
                const isActive = activeFeature === feature.effect;
                const isLoading = processing && isActive;

                return (
                  <button
                    key={index}
                    onClick={() => applyTranformationFeature(feature.effect)}
                    disabled={processing}
                    className={`group relative flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium transition-all shadow
                      ${
                        isActive
                          ? 'border-yellow-400 text-yellow-400 bg-yellow-500/10 shadow-yellow-400/20'
                          : 'border-slate-600 text-slate-300 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-yellow-500/10 hover:to-yellow-600/10 hover:text-yellow-400 hover:shadow-yellow-500/20'
                      } ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                    ) : isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform" />
                    )}
                    {feature.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIImageModel;
