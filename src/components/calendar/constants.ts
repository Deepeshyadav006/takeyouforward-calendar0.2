export interface SeasonData {
  name: string;
  nameHindi: string;
  accent: string;
  bg: string;
  image: string;
}

export const SEASONS: Record<number, SeasonData> = {
  0: { name: "Winter", nameHindi: "Shishir", accent: "#378ADD", bg: "#f0f4ff", image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800" },
  1: { name: "Winter", nameHindi: "Shishir", accent: "#378ADD", bg: "#f0f4ff", image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800" },
  2: { name: "Spring", nameHindi: "Vasant", accent: "#3B6D11", bg: "#f0faf0", image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800" },
  3: { name: "Spring", nameHindi: "Vasant", accent: "#3B6D11", bg: "#f0faf0", image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800" },
  4: { name: "Summer", nameHindi: "Grishma", accent: "#BA7517", bg: "#fffaf0", image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800" },
  5: { name: "Summer", nameHindi: "Grishma", accent: "#BA7517", bg: "#fffaf0", image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800" },
  6: { name: "Monsoon", nameHindi: "Varsha", accent: "#0F6E56", bg: "#f0faf7", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800" },
  7: { name: "Monsoon", nameHindi: "Varsha", accent: "#0F6E56", bg: "#f0faf7", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800" },
  8: { name: "Autumn", nameHindi: "Sharad", accent: "#D85A30", bg: "#fff8f5", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" },
  9: { name: "Autumn", nameHindi: "Sharad", accent: "#D85A30", bg: "#fff8f5", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" },
  10: { name: "Pre-winter", nameHindi: "Hemant", accent: "#993556", bg: "#fdf5f8", image: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800" },
  11: { name: "Pre-winter", nameHindi: "Hemant", accent: "#993556", bg: "#fdf5f8", image: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800" },
};

export const STICKERS = ["🔥", "📚", "🎉", "💰", "💪", "✈️", "🎵", "❤️"];
export const STICKER_PREFIX = "sticker_";
export const NOTE_PREFIX = "note_";

export const INDIAN_HOLIDAYS: Record<string, string> = {
  "2026-01-26": "Republic Day",
  "2026-03-14": "Holi",
  "2026-03-31": "Eid",
  "2026-04-06": "Ram Navami",
  "2026-04-03": "Good Friday",
  "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-20": "Diwali",
  "2026-12-25": "Christmas",
};