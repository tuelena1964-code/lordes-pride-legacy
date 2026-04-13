const approaches = [
  "Ограниченное количество помётов",
  "Устойчивый, спокойный характер",
  "Внимание к породному типу",
  "Осознанный подбор владельцев",
];

const ApproachSection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-center mb-16 tracking-wider">
          Подход
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {approaches.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6"
            >
              <span className="text-primary/60 text-sm tracking-widest mt-1">0{i + 1}</span>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
