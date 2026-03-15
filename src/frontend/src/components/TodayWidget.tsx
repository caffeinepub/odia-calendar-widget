import { motion } from "motion/react";
import {
  ENGLISH_MONTHS,
  ODIA_DAYS,
  getOdiaMonth,
  getPanchang,
  toOdiaNumerals,
} from "../lib/odiaCalendar";

export function TodayWidget() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayInfo = ODIA_DAYS[dayOfWeek];
  const odiaMonth = getOdiaMonth(today);
  const panchang = getPanchang(today);

  const gregDay = today.getDate();
  const gregMonth = ENGLISH_MONTHS[today.getMonth()];
  const gregYear = today.getFullYear();

  return (
    <motion.div
      data-ocid="today.card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl shadow-widget"
    >
      {/* Festive gradient header */}
      <div className="festive-gradient p-6 text-primary-foreground relative">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-8 -translate-x-8" />

        {/* Day name in Odia */}
        <div className="relative z-10">
          <p className="font-odia text-sm font-medium text-white/80 mb-1 tracking-wide">
            {dayInfo.nameOdia}
          </p>
          <p className="text-xs text-white/60 mb-4">{dayInfo.nameEnglish}</p>

          {/* Large date in Odia numerals */}
          <div className="flex items-baseline gap-3">
            <span className="font-odia text-7xl font-bold leading-none text-white">
              {toOdiaNumerals(gregDay)}
            </span>
            <div className="flex flex-col">
              <span className="font-odia text-2xl font-semibold text-white/90">
                {odiaMonth.nameOdia}
              </span>
              <span className="text-sm text-white/70">
                {odiaMonth.nameEnglish}
              </span>
            </div>
          </div>

          {/* Gregorian date */}
          <p className="text-white/60 text-sm mt-3">
            {gregDay} {gregMonth} {gregYear}
          </p>
        </div>
      </div>

      {/* Panchang info */}
      <div className="bg-card p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">
          ପଞ୍ଚାଙ୍ଗ · Panchang
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">ପକ୍ଷ · Paksha</p>
            <p className="font-odia text-sm font-semibold text-foreground">
              {panchang.pakshaOdia} ପକ୍ଷ
            </p>
            <p className="text-xs text-muted-foreground">
              {panchang.paksha} Paksha
            </p>
          </div>
          <div className="bg-secondary rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">ତିଥି · Tithi</p>
            <p className="font-odia text-sm font-semibold text-foreground">
              {panchang.tithiOdia}
            </p>
            <p className="text-xs text-muted-foreground">
              {panchang.tithiName}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
