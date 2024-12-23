import React from 'react';
import { Trash2 } from 'lucide-react';
import { Palette } from '../types/colors';

interface SavedPaletteProps {
  palette: Palette;
  onDelete: (id: string) => void;
}

export function SavedPalette({ palette, onDelete }: SavedPaletteProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex gap-2 mb-3">
        {palette.colors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {new Date(palette.timestamp).toLocaleDateString()}
        </span>
        <button
          onClick={() => onDelete(palette.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Delete palette"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}