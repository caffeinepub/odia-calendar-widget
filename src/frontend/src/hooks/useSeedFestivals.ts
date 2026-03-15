import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useActor } from "./useActor";

const SEED_FESTIVALS = [
  {
    nameOdia: "ରଥ ଯାତ୍ରା",
    nameEnglish: "Rath Yatra",
    description: "Famous chariot festival of Lord Jagannath in Puri",
    month: 7,
    day: 7,
  },
  {
    nameOdia: "ରଜ ପର୍ବ",
    nameEnglish: "Raja Parba",
    description: "Three-day festival celebrating womanhood and Mother Earth",
    month: 6,
    day: 14,
  },
  {
    nameOdia: "ନୂଆଖାଇ",
    nameEnglish: "Nuakhai",
    description: "Harvest festival of Western Odisha, first eating of new rice",
    month: 9,
    day: 1,
  },
  {
    nameOdia: "ଦୁର୍ଗା ପୂଜା",
    nameEnglish: "Durga Puja",
    description: "Worship of Goddess Durga during Navratri",
    month: 10,
    day: 10,
  },
  {
    nameOdia: "ଦୀପାବଳି",
    nameEnglish: "Diwali",
    description:
      "Festival of lights, celebration of victory of light over darkness",
    month: 11,
    day: 1,
  },
  {
    nameOdia: "କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା",
    nameEnglish: "Kartik Purnima",
    description:
      "Full moon of Kartika month, sacred bathing and lighting of Kartika deepas",
    month: 11,
    day: 15,
  },
  {
    nameOdia: "ମହା ଶିବରାତ୍ରୀ",
    nameEnglish: "Maha Shivratri",
    description:
      "Night of Lord Shiva, fasting and worship throughout the night",
    month: 2,
    day: 26,
  },
  {
    nameOdia: "ହୋଲି",
    nameEnglish: "Holi",
    description:
      "Festival of colors and spring, celebrating triumph of good over evil",
    month: 3,
    day: 25,
  },
  {
    nameOdia: "ପଣା ସଂକ୍ରାନ୍ତି",
    nameEnglish: "Pana Sankranti",
    description:
      "Odia New Year, solar new year celebrated with traditional sweet drink",
    month: 4,
    day: 14,
  },
  {
    nameOdia: "କୁମାର ପୂର୍ଣ୍ଣିମା",
    nameEnglish: "Kumar Purnima",
    description:
      "Full moon of Ashvina, celebrated by unmarried women praying for a good husband",
    month: 10,
    day: 17,
  },
];

export function useSeedFestivals() {
  const { actor, isFetching } = useActor();
  const seeded = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!actor || isFetching || seeded.current) return;

    const seed = async () => {
      seeded.current = true;
      try {
        const existing = await actor.getAllFestivals();
        if (existing.length === 0) {
          await Promise.all(
            SEED_FESTIVALS.map((f) =>
              actor.addFestival(
                f.nameOdia,
                f.nameEnglish,
                f.description,
                BigInt(f.month),
                BigInt(f.day),
              ),
            ),
          );
          queryClient.invalidateQueries({ queryKey: ["festivals"] });
        }
      } catch (e) {
        console.error("Failed to seed festivals", e);
      }
    };

    seed();
  }, [actor, isFetching, queryClient]);
}
