import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import puppy1 from "@/assets/puppy1.jpg";
import puppy2 from "@/assets/puppy2.jpg";
import puppy3 from "@/assets/puppy3.jpg";

interface PuppyPhoto {
  id: string;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
}

interface Puppy {
  id: string;
  name: string;
  status: string;
  trait: string | null;
  image_url: string | null;
  photos: PuppyPhoto[];
}

const fallbackPuppies: Puppy[] = [
  { id: "f1", name: "Аврора", status: "available", trait: "Спокойная и ласковая", image_url: puppy1, photos: [] },
  { id: "f2", name: "Бернард", status: "reserved", trait: "Любопытный и активный", image_url: puppy2, photos: [] },
  { id: "f3", name: "Клара", status: "available", trait: "Нежная и внимательная", image_url: puppy3, photos: [] },
];

const PuppyCard = ({ puppy }: { puppy: Puppy }) => {
  const [idx, setIdx] = useState(0);
  const photos = puppy.photos.length > 0
    ? [...puppy.photos].sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order)
    : puppy.image_url
    ? [{ id: "main", image_url: puppy.image_url, is_cover: true, sort_order: 0 }]
    : [];

  const hasMultiple = photos.length > 1;
  const current = photos[idx];

  return (
    <div className="group">
      <div className="aspect-square overflow-hidden mb-6 relative">
        {current ? (
          <img
            src={current.image_url}
            alt={puppy.name}
            loading="lazy"
            width={800}
            height={800}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-card" />
        )}
        {hasMultiple && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)}
              aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/40 hover:bg-background/70 text-foreground transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % photos.length)}
              aria-label="Следующее фото"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/40 hover:bg-background/70 text-foreground transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-primary" : "bg-background/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-light text-foreground tracking-wide">{puppy.name}</h3>
          <span
            className={`text-xs tracking-widest uppercase ${
              puppy.status === "available" ? "text-primary" : "text-muted-foreground/50"
            }`}
          >
            {puppy.status === "available" ? "Доступен" : puppy.status === "reserved" ? "Зарезервирован" : "Продан"}
          </span>
        </div>
        {puppy.trait && <p className="text-sm text-muted-foreground font-light">{puppy.trait}</p>}
      </div>
      <a
        href="#lineage"
        className="inline-block mt-4 text-xs tracking-widest uppercase text-primary/70 hover:text-primary transition-colors border-b border-primary/20 hover:border-primary/50 pb-px"
      >
        Смотреть линию
      </a>
    </div>
  );
};

const LitterSection = () => {
  const [puppies, setPuppies] = useState<Puppy[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const [pupRes, photoRes] = await Promise.all([
        supabase.from("puppies").select("*").order("sort_order", { ascending: true }),
        supabase.from("puppy_photos").select("*").order("sort_order", { ascending: true }),
      ]);
      if (pupRes.data && pupRes.data.length > 0) {
        const photos = photoRes.data || [];
        setPuppies(
          pupRes.data.map((p) => ({
            ...p,
            photos: photos.filter((ph) => ph.puppy_id === p.id),
          }))
        );
      } else {
        setPuppies(fallbackPuppies);
      }
    };
    load();
  }, []);

  const list = puppies ?? fallbackPuppies;
  const visible = list.filter((p) => p.status !== "sold");
  const allReserved = visible.length > 0 && visible.every((p) => p.status === "reserved");
  const noPuppies = visible.length === 0;

  return (
    <section id="litter" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-center mb-16 tracking-wider">
          Актуальный помёт
        </h2>

        {noPuppies ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground font-light mb-4">
              Ожидается следующий помёт
            </p>
            <p className="text-muted-foreground/70">
              Можно{" "}
              <a href="#request" className="text-primary hover:text-primary/80 transition-colors border-b border-primary/30">
                оставить заявку
              </a>{" "}
              заранее
            </p>
          </div>
        ) : allReserved ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground font-light mb-4">
              Все щенки этого помёта зарезервированы
            </p>
            <p className="text-muted-foreground/70">
              Можно{" "}
              <a href="#request" className="text-primary hover:text-primary/80 transition-colors border-b border-primary/30">
                оставить заявку
              </a>{" "}
              на следующий
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visible.map((puppy) => (
              <PuppyCard key={puppy.id} puppy={puppy} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LitterSection;
