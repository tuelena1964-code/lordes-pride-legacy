import heroImage from "@/assets/hero-cavalier.jpg";
import SocialLinksInline from "@/components/SocialLinks";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Social links in top-right */}
      <div className="absolute top-6 right-6 z-20">
        <SocialLinksInline />
      </div>

      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Кавалер Кинг Чарльз Спаниель"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground tracking-wider mb-2">
            Лордес Прайд
          </h1>
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-body">
            Lordes Pride
          </p>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground font-light mb-12 tracking-wide">
          Собаки, с которыми хочется жить
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#litter"
            className="px-8 py-3 border border-primary/40 text-primary hover:bg-primary/10 transition-colors duration-300 tracking-widest uppercase text-sm"
          >
            Актуальный помёт
          </a>
          <a
            href="#request"
            className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 tracking-widest uppercase text-sm"
          >
            Подобрать щенка
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-12 bg-muted-foreground/30" />
      </div>
    </section>
  );
};

export default HeroSection;
