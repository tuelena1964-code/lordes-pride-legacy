const steps = [
  { title: "Знакомство", desc: "Вы оставляете заявку и рассказываете немного о себе" },
  { title: "Общение", desc: "Мы обсуждаем, какой характер подойдёт именно вам" },
  { title: "Подбор", desc: "Щенок подбирается с учётом образа жизни" },
  { title: "Резерв", desc: "Щенок закрепляется после согласования" },
];

const SelectionSection = () => {
  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-center mb-16 tracking-wider">
          Подбор щенка
        </h2>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-8">
              <span className="text-primary/40 text-sm tracking-widest mt-1 shrink-0">0{i + 1}</span>
              <div>
                <h3 className="text-xl font-light text-foreground tracking-wide mb-2">{step.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectionSection;
