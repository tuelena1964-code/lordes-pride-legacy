import motherImg from "@/assets/mother.jpg";
import fatherImg from "@/assets/father.jpg";

const parents = [
  {
    role: "Мать",
    name: "Леди Виктория",
    image: motherImg,
    traits: ["Мягкий и ровный темперамент", "Выраженный породный тип"],
  },
  {
    role: "Отец",
    name: "Сэр Оливер",
    image: fatherImg,
    traits: ["Уверенный и спокойный характер", "Гармоничная анатомия"],
  },
];

const LineageSection = () => {
  return (
    <section id="lineage" className="section-padding section-alt">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-center mb-4 tracking-wider">
          Линия
        </h2>
        <p className="text-center text-muted-foreground font-light mb-16">
          Родители текущего помёта
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {parents.map((parent, i) => (
            <div key={i}>
              <div className="aspect-square overflow-hidden mb-6">
                <img
                  src={parent.image}
                  alt={parent.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs tracking-widest uppercase text-primary/60 mb-2">{parent.role}</p>
              <h3 className="text-2xl font-light text-foreground tracking-wide mb-4">{parent.name}</h3>
              <ul className="space-y-2">
                {parent.traits.map((trait, j) => (
                  <li key={j} className="text-sm text-muted-foreground font-light">
                    {trait}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LineageSection;
