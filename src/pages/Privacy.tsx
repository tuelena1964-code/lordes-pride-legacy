import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="text-primary/70 hover:text-primary text-sm tracking-widest uppercase border-b border-primary/20 hover:border-primary/50 pb-px transition-colors">
          ← На главную
        </Link>

        <h1 className="text-3xl md:text-4xl font-light text-foreground mt-8 mb-12 tracking-wider">
          Политика конфиденциальности
        </h1>

        <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-sm">
          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта питомника кавалер кинг чарльз спаниелей «Лордес Прайд» (далее — Сайт).
            </p>
          </section>

          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">2. Сбор персональных данных</h2>
            <p>
              Мы собираем следующие данные, которые вы предоставляете при заполнении формы заявки на сайте:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Имя</li>
              <li>Город</li>
              <li>Номер телефона</li>
              <li>Информация об опыте содержания собак</li>
              <li>Предпочтения по выбору щенка</li>
              <li>Информация об образе жизни</li>
              <li>Дополнительная информация о себе</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">3. Цели обработки данных</h2>
            <p>Персональные данные обрабатываются в следующих целях:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Обработка заявок на приобретение щенка</li>
              <li>Связь с потенциальными владельцами</li>
              <li>Подбор подходящего щенка</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">4. Защита данных</h2>
            <p>
              Мы принимаем необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">5. Передача данных третьим лицам</h2>
            <p>
              Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">6. Права пользователя</h2>
            <p>Вы имеете право:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Запросить информацию о хранимых персональных данных</li>
              <li>Потребовать удаления ваших персональных данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">7. Срок хранения</h2>
            <p>
              Персональные данные хранятся в течение срока, необходимого для достижения целей их обработки, либо до момента отзыва согласия пользователем.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-foreground mb-3 tracking-wide">8. Контактная информация</h2>
            <p>
              По вопросам, связанным с обработкой персональных данных, вы можете связаться с нами через форму на сайте.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
