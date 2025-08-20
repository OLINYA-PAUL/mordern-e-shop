import { Pickaxe, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Controller, Control } from 'react-hook-form';

interface ColorSelectorProps {
  control: Control<any>; // or specify your form type instead of 'any'
  name?: string;
  defaultValue?: string;
}

const ColorSelector = ({
  control,
  name = 'color',
  defaultValue = '',
}: ColorSelectorProps) => {
  const defaultColor = [
    // Core Brand
    '#0F172A', // Midnight Navy
    '#FACC15', // Golden Yellow
    '#22C55E', // Fresh Green
    '#3B82F6', // Vibrant Blue

    // Supportive Accents
    '#F97316', // Energy Orange
    '#EC4899', // Playful Pink
    '#8B5CF6', // Creative Purple
    '#14B8A6', // Calm Teal

    // Neutral Scale (Light → Dark)
    '#F9FAFB',
    '#F3F4F6',
    '#E5E7EB',
    '#D1D5DB',
    '#9CA3AF',
    '#6B7280',
    '#4B5563',
    '#374151',
    '#1F2937',
    '#111827',

    // Status / Feedback Colors
    '#16A34A', // Green
    '#DC2626', // Red
    '#D97706', // Amber
  ];

  const [customeColor, setcustomeColor] = useState<string[]>([]);
  const [showColorPicker, setshowColorPicker] = useState<boolean>(false);
  const [newColor, setnewColor] = useState<string>('#000000');

  // Load custom colors from localStorage on component mount
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem('customColors');
      if (savedColors) {
        const parsedColors = JSON.parse(savedColors);
        if (Array.isArray(parsedColors)) {
          setcustomeColor(parsedColors);
        }
      }
    } catch (error) {
      console.error('Failed to load colors from localStorage:', error);
    }
  }, []);

  // Helper function to save colors to localStorage
  const saveColorsToStorage = (colors: string[]) => {
    try {
      localStorage.setItem('customColors', JSON.stringify(colors));
    } catch (error) {
      console.error('Failed to save colors to localStorage:', error);
    }
  };

  // Helper function to determine if a color is light
  const isLightColor = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 128;
  };

  return (
    <div className="w-full">
      <Controller
        name={name}
        key={defaultColor.length}
        defaultValue={defaultValue || []}
        control={control}
        render={({
          field: { onChange, value, ref },
          fieldState: { error },
        }) => (
          <div className="flex flex-wrap gap-2">
            {[...defaultColor, ...customeColor].map((color, index) => {
              const isSelected = value.includes(color);
              const lightColor = isLightColor(color);

              return (
                <button
                  type="button"
                  key={`${color}-${index}`}
                  onClick={() => {
                    const currentValue = Array.isArray(value) ? value : [];
                    onChange(
                      isSelected
                        ? currentValue.filter((c: string) => c !== color)
                        : [...currentValue, color]
                    );
                  }}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all duration-200 ease-in-out
                    flex items-center justify-center relative overflow-hidden
                    hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${
                      isSelected
                        ? 'border-gray-800 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  style={{
                    backgroundColor: color,
                  }}
                  title={color}
                >
                  {isSelected && (
                    <Pickaxe
                      size={12}
                      color={lightColor ? '#000000' : '#ffffff'}
                      className="drop-shadow-sm"
                    />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setshowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 
                         flex items-center justify-center hover:border-gray-600 
                         hover:bg-gray-50 transition-all duration-200 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Add custom color"
            >
              <Plus size={12} color="gray" />
            </button>

            {showColorPicker && (
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setnewColor(e.target.value)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer
                           appearance-none bg-transparent focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white 
                           rounded-md text-xs transition-colors duration-200 
                           flex items-center gap-1 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    if (newColor && !customeColor.includes(newColor)) {
                      const updatedColors = [...customeColor, newColor];
                      setcustomeColor(updatedColors);
                      saveColorsToStorage(updatedColors);
                    }
                    setshowColorPicker(false);
                    setnewColor('#000000');
                  }}
                >
                  Add <Plus size={10} />
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white 
                           rounded-full text-xs transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={() => {
                    setshowColorPicker(false);
                    setnewColor('#000000');
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      />
      {/* Error display if needed */}
    </div>
  );
};

export default ColorSelector;
