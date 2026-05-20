import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CARD_IMAGE_SLOTS: { group: string; id: string; label: string; fallback: string }[] = [
  // Program Highlights
  { group: "Program Highlights", id: "ph_education", label: "Education", fallback: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200" },
  { group: "Program Highlights", id: "ph_women", label: "Women Empowerment", fallback: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=1200" },
  { group: "Program Highlights", id: "ph_culture", label: "Culture & Values", fallback: "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1200" },
  { group: "Program Highlights", id: "ph_balasangam", label: "BalaSangam", fallback: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200" },
  { group: "Program Highlights", id: "ph_yoga", label: "Yoga Day", fallback: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1200" },
  { group: "Program Highlights", id: "ph_seva_bastis", label: "Seva Bastis", fallback: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200" },
];

export function useCardImages() {
  return useQuery({
    queryKey: ["site_settings", "card_images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "card_images")
        .maybeSingle();
      return (data?.value as Record<string, string>) ?? {};
    },
  });
}
