import puppy1 from "@/assets/puppy1.jpg";
import puppy2 from "@/assets/puppy2.jpg";
import puppy3 from "@/assets/puppy3.jpg";

type PuppyStatus = "available" | "reserved";

interface Puppy {
  name: string;
  image: string;
  status: PuppyStatus;
  trait: string;
}

const puppies: Puppy[] = [
  { name: "Аврора", image: puppy1, status: "available", trait: "Спокойная и ласковая" },
  { name: "Бернард", image: puppy2, status: "reserved", trait: "Любопытный и активный" },
  { name: "Клара", image: puppy3, status: "available", trait: "Нежная и внимательная" },
];

const LitterSection = () => {
  const allReserved = puppies.every((p) => p.status === "reserved");
  const noPuppies = puppies.length === 0;

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
            {puppies.map((puppy, i) => (
              <div key={i} className="group">
                <div className="aspect-square overflow-hidden mb-6">
                  <img
                    src={puppy.image}
                    alt={puppy.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-light text-foreground tracking-wide">{puppy.name}</h3>
                    <span
                      className={`text-xs tracking-widest uppercase ${
                        puppy.status === "available" ? "text-primary" : "text-muted-foreground/50"
                      }`}
                    >
                      {puppy.status === "available" ? "Доступен" : "Зарезервирован"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light">{puppy.trait}</p>
                </div>
                <a
                  href="#lineage"
                  className="inline-block mt-4 text-xs tracking-widest uppercase text-primary/70 hover:text-primary transition-colors border-b border-primary/20 hover:border-primary/50 pb-px"
                >
                  Смотреть линию
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LitterSection;
