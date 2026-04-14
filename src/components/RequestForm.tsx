import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RequestForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    phone: "",
    experience: "",
    looking_for: "",
    lifestyle: "",
    about: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast({ title: "Пожалуйста, заполните обязательные поля", variant: "destructive" });
      return;
    }
    if (!agreed) {
      toast({ title: "Необходимо согласие на обработку персональных данных", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Save to database
      const { error } = await supabase.from("submissions").insert({
        name: form.name.trim(),
        city: form.city.trim() || null,
        phone: form.phone.trim(),
        experience: form.experience.trim() || null,
        looking_for: form.looking_for.trim() || null,
        lifestyle: form.lifestyle.trim() || null,
        about: form.about.trim() || null,
      });

      if (error) throw error;

      // Send email notification
      await supabase.functions.invoke("send-submission-email", {
        body: form,
      });

      toast({ title: "Заявка отправлена", description: "Мы свяжемся с вами в ближайшее время" });
      setForm({ name: "", city: "", phone: "", experience: "", looking_for: "", lifestyle: "", about: "" });
      setAgreed(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Ошибка при отправке", description: "Попробуйте ещё раз", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-border focus:border-primary/60 outline-none py-3 text-foreground placeholder:text-muted-foreground/40 font-light transition-colors duration-300";

  return (
    <section id="request" className="section-padding section-alt">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-center mb-16 tracking-wider">
          Запрос щенка
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Имя *" className={inputClass} maxLength={100} />
          <input name="city" value={form.city} onChange={handleChange} placeholder="Город" className={inputClass} maxLength={100} />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Телефон *" className={inputClass} maxLength={50} />
          <input name="experience" value={form.experience} onChange={handleChange} placeholder="Был ли опыт содержания собак" className={inputClass} maxLength={200} />
          <input name="looking_for" value={form.looking_for} onChange={handleChange} placeholder="Кого вы ищете" className={inputClass} maxLength={200} />
          <textarea name="lifestyle" value={form.lifestyle} onChange={handleChange} placeholder="Образ жизни" className={`${inputClass} resize-none min-h-[80px]`} maxLength={500} />
          <textarea name="about" value={form.about} onChange={handleChange} placeholder="О себе" className={`${inputClass} resize-none min-h-[80px]`} maxLength={1000} />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-[hsl(36,33%,63%)]"
            />
            <span className="text-sm text-muted-foreground/70 font-light">
              Я соглашаюсь на{" "}
              <a href="/privacy" target="_blank" className="text-primary hover:text-primary/80 border-b border-primary/30 transition-colors">
                обработку персональных данных
              </a>
            </span>
          </label>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "Отправка..." : "Отправить запрос"}
            </button>
          </div>
        </form>

        <p className="text-center text-muted-foreground/50 text-sm font-light mt-8">
          Мы свяжемся с вами в течение нескольких дней
        </p>
      </div>
    </section>
  );
};

export default RequestForm;
