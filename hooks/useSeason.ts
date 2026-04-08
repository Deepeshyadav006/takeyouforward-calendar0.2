export type Season = {
  name: string;
  nameHindi: string;
  months: number[];
  accent: string;
  accentLight: string;
  bg: string;
  imageQuery: string;
  description: string;
}

export const SEASONS: Season[] = [
  {
    name: "Winter",
    nameHindi: "Shishir",
    months: [1, 2],
    accent: "#378ADD",
    accentLight: "#E6F1FB",
    bg: "#f0f4f8",
    imageQuery: "winter fog misty morning india",
    description: "Foggy & cold mornings"
  },
  {
    name: "Spring",
    nameHindi: "Vasant",
    months: [3, 4],
    accent: "#3B6D11",
    accentLight: "#EAF3DE",
    bg: "#f0faf0",
    imageQuery: "spring flowers blooming india holi",
    description: "Flowers & Holi season"
  },
  {
    name: "Summer",
    nameHindi: "Grishma",
    months: [5, 6],
    accent: "#BA7517",
    accentLight: "#FAEEDA",
    bg: "#fffaf0",
    imageQuery: "hot summer sun dry india",
    description: "Scorching heat"
  },
  {
    name: "Monsoon",
    nameHindi: "Varsha",
    months: [7, 8],
    accent: "#0F6E56",
    accentLight: "#E1F5EE",
    bg: "#f0faf7",
    imageQuery: "monsoon rain india dark clouds",
    description: "Rain & relief"
  },
  {
    name: "Autumn",
    nameHindi: "Sharad",
    months: [9, 10],
    accent: "#D85A30",
    accentLight: "#FAECE7",
    bg: "#fff8f5",
    imageQuery: "autumn golden india navratri",
    description: "Navratri & golden skies"
  },
  {
    name: "Pre-winter",
    nameHindi: "Hemant",
    months: [11, 12],
    accent: "#993556",
    accentLight: "#FBEAF0",
    bg: "#fdf5f8",
    imageQuery: "pre-winter harvest cool india november",
    description: "Cool & harvest season"
  }
]

export function getSeason(month: number): Season {
  return SEASONS.find(s => s.months.includes(month)) ?? SEASONS[1]
}