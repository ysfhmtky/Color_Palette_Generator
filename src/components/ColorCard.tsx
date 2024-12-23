import React from 'react';
import { Copy, Lock, Unlock } from 'lucide-react';

interface ColorCardProps {
  color: string;
  isLocked: boolean;
  onToggleLock: () => void;
  onColorChange: (color: string) => void;
}

export function ColorCard({ color, isLocked, onToggleLock, onColorChange }: ColorCardProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="w-full h-32 transition-colors duration-200"
        style={{ backgroundColor: color }}
      />
      <div className="p-4 w-full">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="text-sm font-mono bg-gray-50 border rounded px-2 py-1 w-24"
          />
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy color code"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={onToggleLock}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isLocked ? "Unlock color" : "Lock color"}
            >
              {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}