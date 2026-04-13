import { useState } from "react";

const faqs = [
  {
    q: "Когда щенок готов к переезду?",
    a: "Щенок готов к переезду после двух вакцинаций и завершения карантина. К этому моменту он проходит первичную социализацию и готов к смене дома.",
  },
  {
    q: "Какие документы передаются?",
    a: "При передаче оформляется договор купли-продажи и акт приёма-передачи. Щенок передаётся с метрикой РКФ и ветеринарным паспортом с отметками о вакцинациях и обработках.",
  },
  {
    q: "Подходит ли порода для квартиры?",
    a: "Кавалеры предназначены для проживания в доме или квартире и не подходят для уличного содержания.",
  },
  {
    q: "Как кавалеры относятся к детям и животным?",
    a: "Кавалеры обычно легко находят контакт с детьми и спокойно уживаются с другими животными при правильной социализации.",
  },
  {
    q: "Как проходит резерв?",
    a: "Резерв возможен после общения и понимания, что щенок подходит вам.",
  },
  {
    q: "Возможна ли доставка?",
    a: "Обсуждается индивидуально.",
  },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-center mb-16 tracking-wider">
          Важные нюансы
        </h2>

        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i} className="py-6">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left flex items-center justify-between gap-4"
              >
                <span className="text-lg font-light text-foreground tracking-wide">{faq.q}</span>
                <span className="text-primary/50 text-2xl shrink-0 transition-transform duration-300" style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}>
                  +
                </span>
              </button>
              {open === i && (
                <p className="mt-4 text-muted-foreground font-light leading-relaxed pl-0">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
