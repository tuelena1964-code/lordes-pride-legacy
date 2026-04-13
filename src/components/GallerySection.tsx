import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import gallery4 from "@/assets/gallery4.jpg";

const images = [
  { src: gallery1, alt: "Спящий кавалер", className: "col-span-1 row-span-1" },
  { src: gallery2, alt: "Детали", className: "col-span-1 row-span-1 md:col-span-2" },
  { src: gallery3, alt: "У окна", className: "col-span-1 row-span-1 md:row-span-2" },
  { src: gallery4, alt: "Щенки", className: "col-span-1 row-span-1 md:col-span-1" },
];

const GallerySection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-center mb-16 tracking-wider">
          Моменты
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className={`overflow-hidden ${img.className}`}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover min-h-[250px] hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
