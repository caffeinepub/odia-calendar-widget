import { Badge } from "@/components/ui/badge";
import { CalendarDays, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Festival } from "../backend.d";
import { ENGLISH_MONTHS, toOdiaNumerals } from "../lib/odiaCalendar";

interface FestivalListProps {
  festivals: Festival[];
  isLoading: boolean;
  currentMonth: number; // 1-12
}

export function FestivalList({
  festivals,
  isLoading,
  currentMonth,
}: FestivalListProps) {
  const monthFestivals = festivals
    .filter((f) => Number(f.month) === currentMonth)
    .sort((a, b) => Number(a.day) - Number(b.day));

  if (isLoading) {
    return (
      <div data-ocid="festival.loading_state" className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl shimmer" />
        ))}
      </div>
    );
  }

  if (monthFestivals.length === 0) {
    return (
      <div
        data-ocid="festival.empty_state"
        className="text-center py-8 text-muted-foreground"
      >
        <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No festivals this month</p>
      </div>
    );
  }

  return (
    <div data-ocid="festival.list" className="space-y-2">
      {monthFestivals.map((festival, idx) => (
        <motion.div
          key={festival.id.toString()}
          data-ocid={`festival.item.${idx + 1}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.06, duration: 0.3 }}
          className="flex items-start gap-3 p-3 rounded-xl bg-card hover:bg-secondary/50 transition-colors border border-border/60 group"
        >
          {/* Date badge */}
          <div className="flex-shrink-0 w-10 h-10 festive-gradient rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="text-white text-sm font-bold leading-none">
              {Number(festival.day)}
            </span>
            <span className="font-odia text-white/70 text-[8px] leading-none">
              {toOdiaNumerals(Number(festival.day))}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-odia text-sm font-semibold text-foreground leading-tight">
                {festival.nameOdia}
              </p>
              <Star className="h-3 w-3 text-gold fill-gold flex-shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {festival.nameEnglish}
            </p>
            {festival.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1 hidden sm:block">
                {festival.description}
              </p>
            )}
          </div>

          {/* Month badge */}
          <Badge
            variant="secondary"
            className="flex-shrink-0 text-xs bg-secondary text-secondary-foreground font-medium"
          >
            {ENGLISH_MONTHS[currentMonth - 1]?.slice(0, 3)}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}
