// Odia Calendar Utility Functions

export const ODIA_MONTHS = [
  {
    index: 1,
    nameOdia: "ବୈଶାଖ",
    nameEnglish: "Baisakha",
    startMonth: 4,
    startDay: 14,
  },
  {
    index: 2,
    nameOdia: "ଜ୍ୟେଷ୍ଠ",
    nameEnglish: "Jyestha",
    startMonth: 5,
    startDay: 15,
  },
  {
    index: 3,
    nameOdia: "ଆଷାଢ଼",
    nameEnglish: "Ashadha",
    startMonth: 6,
    startDay: 15,
  },
  {
    index: 4,
    nameOdia: "ଶ୍ରାବଣ",
    nameEnglish: "Shravana",
    startMonth: 7,
    startDay: 16,
  },
  {
    index: 5,
    nameOdia: "ଭାଦ୍ରବ",
    nameEnglish: "Bhadrava",
    startMonth: 8,
    startDay: 17,
  },
  {
    index: 6,
    nameOdia: "ଆଶ୍ବିନ",
    nameEnglish: "Ashvina",
    startMonth: 9,
    startDay: 17,
  },
  {
    index: 7,
    nameOdia: "କାର୍ତ୍ତିକ",
    nameEnglish: "Kartika",
    startMonth: 10,
    startDay: 17,
  },
  {
    index: 8,
    nameOdia: "ମାର୍ଗଶିର",
    nameEnglish: "Margashira",
    startMonth: 11,
    startDay: 16,
  },
  {
    index: 9,
    nameOdia: "ପୌଷ",
    nameEnglish: "Pausha",
    startMonth: 12,
    startDay: 16,
  },
  {
    index: 10,
    nameOdia: "ମାଘ",
    nameEnglish: "Magha",
    startMonth: 1,
    startDay: 15,
  },
  {
    index: 11,
    nameOdia: "ଫାଲ୍ଗୁନ",
    nameEnglish: "Phalguna",
    startMonth: 2,
    startDay: 14,
  },
  {
    index: 12,
    nameOdia: "ଚୈତ୍ର",
    nameEnglish: "Chaitra",
    startMonth: 3,
    startDay: 14,
  },
];

export const ODIA_DAYS = [
  { nameOdia: "ରବିବାର", nameShort: "ରବି", nameEnglish: "Rabibar" },
  { nameOdia: "ସୋମବାର", nameShort: "ସୋମ", nameEnglish: "Somabar" },
  { nameOdia: "ମଙ୍ଗଳବାର", nameShort: "ମଙ୍ଗ", nameEnglish: "Mangalabar" },
  { nameOdia: "ବୁଧବାର", nameShort: "ବୁଧ", nameEnglish: "Budhabar" },
  { nameOdia: "ଗୁରୁବାର", nameShort: "ଗୁରୁ", nameEnglish: "Gurubar" },
  { nameOdia: "ଶୁକ୍ରବାର", nameShort: "ଶୁକ୍ର", nameEnglish: "Shukrabar" },
  { nameOdia: "ଶନିବାର", nameShort: "ଶନି", nameEnglish: "Shanibar" },
];

export const ODIA_NUMERALS = ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"];

export function toOdiaNumerals(num: number): string {
  return String(num)
    .split("")
    .map((d) => ODIA_NUMERALS[Number.parseInt(d)] ?? d)
    .join("");
}

export function getOdiaMonth(date: Date): (typeof ODIA_MONTHS)[0] {
  const orderedChecks = [
    { odiaIdx: 12, gMonth: 3, gDay: 14 },
    { odiaIdx: 1, gMonth: 4, gDay: 14 },
    { odiaIdx: 2, gMonth: 5, gDay: 15 },
    { odiaIdx: 3, gMonth: 6, gDay: 15 },
    { odiaIdx: 4, gMonth: 7, gDay: 16 },
    { odiaIdx: 5, gMonth: 8, gDay: 17 },
    { odiaIdx: 6, gMonth: 9, gDay: 17 },
    { odiaIdx: 7, gMonth: 10, gDay: 17 },
    { odiaIdx: 8, gMonth: 11, gDay: 16 },
    { odiaIdx: 9, gMonth: 12, gDay: 16 },
    { odiaIdx: 10, gMonth: 1, gDay: 15 },
    { odiaIdx: 11, gMonth: 2, gDay: 14 },
  ];

  const doy = getDayOfYear(date);

  const starts = orderedChecks.map((c) => ({
    odiaIdx: c.odiaIdx,
    doy: getDayOfYearForMonthDay(c.gMonth, c.gDay),
  }));

  let currentOdia = starts[starts.length - 1].odiaIdx;
  for (let i = 0; i < starts.length; i++) {
    if (doy >= starts[i].doy) {
      currentOdia = starts[i].odiaIdx;
    }
  }

  return ODIA_MONTHS.find((m) => m.index === currentOdia) ?? ODIA_MONTHS[0];
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDayOfYearForMonthDay(month: number, day: number): number {
  const daysInMonths = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  return daysInMonths[month - 1] + day;
}

// Tithi calculation (approximate)
const KNOWN_NEW_MOON = new Date(2000, 0, 6).getTime();
const LUNAR_CYCLE = 29.53059 * 24 * 60 * 60 * 1000;

export interface PanchangInfo {
  tithi: number;
  tithiName: string;
  tithiOdia: string;
  paksha: "Shukla" | "Krishna";
  pakshaOdia: string;
}

const TITHI_NAMES_SHUKLA = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
];
const TITHI_NAMES_ODIA_SHUKLA = [
  "ପ୍ରତିପଦ",
  "ଦ୍ୱିତୀୟ",
  "ତୃତୀୟ",
  "ଚତୁର୍ଥ",
  "ପଞ୍ଚମୀ",
  "ଷଷ୍ଠ",
  "ସପ୍ତମୀ",
  "ଅଷ୍ଟମୀ",
  "ନବମୀ",
  "ଦଶମୀ",
  "ଏକାଦଶୀ",
  "ଦ୍ୱାଦଶୀ",
  "ତ୍ରୟୋଦଶୀ",
  "ଚତୁର୍ଦ୍ଦଶୀ",
  "ପୂର୍ଣ୍ଣିମା",
];
const TITHI_NAMES_KRISHNA = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Amavasya",
];
const TITHI_NAMES_ODIA_KRISHNA = [
  "ପ୍ରତିପଦ",
  "ଦ୍ୱିତୀୟ",
  "ତୃତୀୟ",
  "ଚତୁର୍ଥ",
  "ପଞ୍ଚମୀ",
  "ଷଷ୍ଠ",
  "ସପ୍ତମୀ",
  "ଅଷ୍ଟମୀ",
  "ନବମୀ",
  "ଦଶମୀ",
  "ଏକାଦଶୀ",
  "ଦ୍ୱାଦଶୀ",
  "ତ୍ରୟୋଦଶୀ",
  "ଚତୁର୍ଦ୍ଦଶୀ",
  "ଅମାବାସ୍ୟା",
];

export function getPanchang(date: Date): PanchangInfo {
  const diff = date.getTime() - KNOWN_NEW_MOON;
  const cyclePos = ((diff % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  const dayInCycle = cyclePos / (24 * 60 * 60 * 1000);

  const tithiRaw = Math.floor((dayInCycle / 29.53059) * 30) % 30;
  const tithi = tithiRaw + 1;

  if (tithi <= 15) {
    return {
      tithi,
      tithiName: TITHI_NAMES_SHUKLA[tithi - 1],
      tithiOdia: TITHI_NAMES_ODIA_SHUKLA[tithi - 1],
      paksha: "Shukla",
      pakshaOdia: "ଶୁକ୍ଳ",
    };
  }
  const krishnaTithi = tithi - 15;
  return {
    tithi: krishnaTithi,
    tithiName: TITHI_NAMES_KRISHNA[krishnaTithi - 1],
    tithiOdia: TITHI_NAMES_ODIA_KRISHNA[krishnaTithi - 1],
    paksha: "Krishna",
    pakshaOdia: "କୃଷ୍ଣ",
  };
}

export const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
