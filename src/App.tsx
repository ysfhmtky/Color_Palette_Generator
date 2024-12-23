import React, { useState, useCallback, useEffect } from 'react';
import { Palette, RefreshCw, Save } from 'lucide-react';
import { ColorCard } from './components/ColorCard';
import { SavedPalette } from './components/SavedPalette';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateHarmonious, hslToHex } from './utils/colorUtils';
import type { Palette as PaletteType } from './types/colors';

function App() {
  // Şu anki renk paletini yönetmek için state
  const [colors, setColors] = useState<string[]>([]);
  // Renklerin kilitli olup olmadığını yönetmek için state
  const [lockedColors, setLockedColors] = useState<boolean[]>([]);
  // Renk uyumu türünü (analogous, triadic, complementary) yönetmek için state
  const [harmonyType, setHarmonyType] = useState<'analogous' | 'triadic' | 'complementary'>('analogous');
  // Kaydedilen paletleri yönetmek için local storage hook'u kullanılıyor
  const [savedPalettes, setSavedPalettes] = useLocalStorage<PaletteType[]>('savedPalettes', []);

  // Yeni bir renk paleti oluşturur
  const generatePalette = useCallback(() => {
    const baseHue = Math.random() * 360; // Rastgele bir temel renk tonu oluştur
    const hues = generateHarmonious(baseHue, harmonyType); // Seçilen uyuma göre renk tonlarını oluştur
    setColors(prevColors =>
      hues.map((hue, index) =>
        lockedColors[index] ? prevColors[index] : hslToHex({ h: hue, s: 0.7, l: 0.5 }) // Kilitli değilse rengi değiştir
      )
    );
  }, [harmonyType, lockedColors]);

  // Belirtilen indeksteki rengin kilit durumunu değiştirir
  const toggleLock = (index: number) => {
    setLockedColors(prev => {
      const next = [...prev];
      next[index] = !next[index]; // Kilit durumunu tersine çevir
      return next;
    });
  };

  // Belirtilen indeksteki rengi günceller
  const updateColor = (index: number, color: string) => {
    setColors(prev => {
      const next = [...prev];
      next[index] = color; // Yeni rengi ayarla
      return next;
    });
  };

  // Mevcut paleti kaydeder
  const savePalette = () => {
    const newPalette: PaletteType = {
      id: Date.now().toString(), // Palet için benzersiz bir ID
      colors, // Mevcut renkler
      type: harmonyType, // Renk uyumu türü
      timestamp: Date.now() // Kaydedilme zamanı
    };
    setSavedPalettes(prev => [newPalette, ...prev]); // Yeni paleti listeye ekle
  };

  // Belirtilen ID'ye sahip paleti siler
  const deletePalette = (id: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== id)); // ID'ye uyan paleti filtrele
  };

  // İlk açılışta otomatik olarak bir palet oluştur
  useEffect(() => {
    generatePalette();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Başlık bölümü */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Renk Paleti Üretici
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Ana içerik bölümü */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Kontrol düğmeleri */}
          <div className="flex gap-4 mb-6">
            <select
              value={harmonyType}
              onChange={(e) => setHarmonyType(e.target.value as any)}
              className="px-4 py-2 border rounded-lg shadow-sm"
            >
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="complementary">Complementary</option>
            </select>
            <button
              onClick={generatePalette}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw size={20} />
              Yeni Palet Oluştur
            </button>
            <button
              onClick={savePalette}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              Paleti Kaydet
            </button>
          </div>

          {/* Renk kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.map((color, index) => (
              <ColorCard
                key={index}
                color={color} // Renk
                isLocked={lockedColors[index]} // Kilit durumu
                onToggleLock={() => toggleLock(index)} // Kilit durumunu değiştir
                onColorChange={(color) => updateColor(index, color)} // Rengi güncelle
              />
            ))}
          </div>
        </div>

        {/* Kaydedilen paletler */}
        {savedPalettes.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Kaydedilen Paletler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPalettes.map((palette) => (
                <SavedPalette
                  key={palette.id}
                  palette={palette} // Kaydedilen palet bilgileri
                  onDelete={deletePalette} // Paleti silme fonksiyonu
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
