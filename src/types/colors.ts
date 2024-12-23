export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  id: string;
  colors: string[];
  type: 'analogous' | 'triadic' | 'complementary';
  timestamp: number;
}