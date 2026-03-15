import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Festival } from "../backend.d";
import {
  ENGLISH_MONTHS,
  ODIA_DAYS,
  getOdiaMonth,
  toOdiaNumerals,
} from "../lib/odiaCalendar";

interface CalendarWidgetProps {
  festivals: Festival[];
  isLoading: boolean;
}

export function CalendarWidget({ festivals, isLoading }: CalendarWidgetProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [direction, setDirection] = useState(1);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const gregMonthNum = month + 1;

  const odiaMonth = getOdiaMonth(new Date(year, month, 14));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const festivalMap = new Map<number, Festival[]>();
  for (const f of festivals) {
    if (Number(f.month) === gregMonthNum) {
      const day = Number(f.day);
      if (!festivalMap.has(day)) festivalMap.set(day, []);
      festivalMap.get(day)!.push(f);
    }
  }

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-card rounded-2xl shadow-widget overflow-hidden">
      {/* Header */}
      <div className="festive-gradient px-5 py-4 flex items-center justify-between">
        <Button
          data-ocid="calendar.prev_button"
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, y: direction > 0 ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center"
        >
          <p className="font-odia text-lg font-bold text-white leading-tight">
            {odiaMonth.nameOdia}
          </p>
          <p className="text-white/70 text-xs">
            {odiaMonth.nameEnglish} · {ENGLISH_MONTHS[month]} {year}
          </p>
        </motion.div>

        <Button
          data-ocid="calendar.next_button"
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 bg-secondary/50 border-b border-border">
        {ODIA_DAYS.map((d) => (
          <div key={d.nameShort} className="py-2 text-center">
            <span className="font-odia text-xs font-semibold text-muted-foreground">
              {d.nameShort}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {isLoading ? (
        <div data-ocid="calendar.loading_state" className="p-6">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: shimmer placeholders with no reorder
              <div key={`shimmer-${i}`} className="h-12 rounded-lg shimmer" />
            ))}
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-7 p-3 gap-1"
          >
            {cells.map((day, idx) => {
              if (day === null) {
                // biome-ignore lint/suspicious/noArrayIndexKey: empty padding cells, order never changes
                return <div key={`empty-${idx}`} className="h-12" />;
              }
              const dayFestivals = festivalMap.get(day) ?? [];
              const hasFestival = dayFestivals.length > 0;
              const todayCell = isToday(day);

              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    h-12 rounded-xl flex flex-col items-center justify-center cursor-default relative
                    transition-colors duration-150
                    ${todayCell ? "festive-gradient text-white shadow-widget" : "hover:bg-secondary"}
                    ${hasFestival && !todayCell ? "bg-accent/20 border border-gold/40" : ""}
                  `}
                  title={
                    hasFestival
                      ? dayFestivals.map((f) => f.nameEnglish).join(", ")
                      : undefined
                  }
                >
                  <span
                    className={`text-sm font-semibold leading-none ${
                      todayCell
                        ? "text-white"
                        : hasFestival
                          ? "text-maroon"
                          : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>
                  <span
                    className={`font-odia text-[9px] leading-none mt-0.5 ${
                      todayCell ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {toOdiaNumerals(day)}
                  </span>
                  {hasFestival && (
                    <span
                      className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                        todayCell ? "bg-white" : "bg-primary"
                      }`}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full festive-gradient inline-block" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          <span>Festival</span>
        </div>
      </div>
    </div>
  );
}
