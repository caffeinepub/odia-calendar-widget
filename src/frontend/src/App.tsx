import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CalendarDays, Star, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CalendarWidget } from "./components/CalendarWidget";
import { FestivalList } from "./components/FestivalList";
import { TodayWidget } from "./components/TodayWidget";
import { useGetAllFestivals } from "./hooks/useQueries";
import { useSeedFestivals } from "./hooks/useSeedFestivals";
import { ENGLISH_MONTHS } from "./lib/odiaCalendar";

const queryClient = new QueryClient();

function OdiaCalendarApp() {
  useSeedFestivals();
  const { data: festivals = [], isLoading } = useGetAllFestivals();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  return (
    <div className="min-h-screen mandala-bg">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 festive-gradient rounded-xl flex items-center justify-center shadow-widget">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-odia text-lg font-bold text-foreground leading-tight">
              ଓଡ଼ିଆ କ୍ୟାଲେଣ୍ଡର
            </h1>
            <p className="text-xs text-muted-foreground">
              Odia Calendar · {ENGLISH_MONTHS[today.getMonth()]}{" "}
              {today.getFullYear()}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Today Widget */}
        <TodayWidget />

        {/* Calendar + Festivals Tabs */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="w-full bg-card border border-border rounded-xl p-1 h-auto">
            <TabsTrigger
              data-ocid="calendar.tab"
              value="calendar"
              className="flex-1 rounded-lg data-[state=active]:festive-gradient data-[state=active]:text-white data-[state=active]:shadow-xs py-2.5 gap-1.5 transition-all"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="font-odia text-sm">କ୍ୟାଲେଣ୍ଡର</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="festival.tab"
              value="festivals"
              className="flex-1 rounded-lg data-[state=active]:festive-gradient data-[state=active]:text-white data-[state=active]:shadow-xs py-2.5 gap-1.5 transition-all"
            >
              <Star className="h-4 w-4" />
              <span className="font-odia text-sm">ପର୍ବ ପର୍ବାଣି</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-4">
            <CalendarWidget festivals={festivals} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="festivals" className="mt-4">
            <div className="bg-card rounded-2xl shadow-widget p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 festive-gradient rounded-full" />
                <h2 className="font-odia text-base font-semibold text-foreground">
                  ଏହି ମାସର ପର୍ବ
                </h2>
                <span className="text-sm text-muted-foreground">
                  — Festivals this month
                </span>
              </div>
              <FestivalList
                festivals={festivals}
                isLoading={isLoading}
                currentMonth={currentMonth}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* All Upcoming Festivals Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-card rounded-2xl shadow-widget p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="font-odia text-base font-semibold text-foreground">
              ଆସନ୍ତା ପର୍ବ
            </h2>
            <span className="text-sm text-muted-foreground">
              — Upcoming Festivals
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-lg shimmer" />
              ))}
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-border">
              {festivals
                .filter((f) => {
                  const fDate = new Date(
                    today.getFullYear(),
                    Number(f.month) - 1,
                    Number(f.day),
                  );
                  return fDate >= today;
                })
                .sort((a, b) => {
                  const aDate = new Date(
                    today.getFullYear(),
                    Number(a.month) - 1,
                    Number(a.day),
                  );
                  const bDate = new Date(
                    today.getFullYear(),
                    Number(b.month) - 1,
                    Number(b.day),
                  );
                  return aDate.getTime() - bDate.getTime();
                })
                .slice(0, 5)
                .map((festival, idx) => {
                  const fDate = new Date(
                    today.getFullYear(),
                    Number(festival.month) - 1,
                    Number(festival.day),
                  );
                  const diffDays = Math.ceil(
                    (fDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
                  );
                  return (
                    <motion.div
                      key={festival.id.toString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.07 }}
                      className="flex items-center justify-between py-2.5 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-odia text-sm font-semibold text-foreground">
                          {festival.nameOdia}
                        </span>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {festival.nameEnglish}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {ENGLISH_MONTHS[Number(festival.month) - 1]?.slice(
                            0,
                            3,
                          )}{" "}
                          {Number(festival.day)}
                        </span>
                        {diffDays <= 7 && (
                          <span className="text-xs bg-primary/15 text-primary font-semibold px-2 py-0.5 rounded-full">
                            {diffDays === 0 ? "Today" : `${diffDays}d`}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              {festivals.filter((f) => {
                const fDate = new Date(
                  today.getFullYear(),
                  Number(f.month) - 1,
                  Number(f.day),
                );
                return fDate >= today;
              }).length === 0 && (
                <p className="text-sm text-muted-foreground py-3 text-center">
                  No upcoming festivals this year
                </p>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OdiaCalendarApp />
    </QueryClientProvider>
  );
}
