import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import PuppyPhotos from "@/components/admin/PuppyPhotos";

type Submission = Tables<"submissions">;
type Puppy = Tables<"puppies">;

const STATUS_OPTIONS = ["Новая", "В работе", "Обработана"];
const PUPPY_STATUS_OPTIONS = [
  { value: "available", label: "Доступен" },
  { value: "reserved", label: "Резерв" },
  { value: "sold", label: "Продан" },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"submissions" | "puppies">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  // Puppy form
  const [puppyForm, setPuppyForm] = useState({ name: "", trait: "", status: "available" });
  const [puppyFile, setPuppyFile] = useState<File | null>(null);
  const [editingPuppy, setEditingPuppy] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin-login");
        return;
      }
      fetchData();
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin-login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const [subRes, pupRes] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("puppies").select("*").order("sort_order", { ascending: true }),
    ]);
    if (subRes.data) setSubmissions(subRes.data);
    if (pupRes.data) setPuppies(pupRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("submissions").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    } else {
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      if (selectedSubmission?.id === id) setSelectedSubmission({ ...selectedSubmission, status });
      toast({ title: "Статус обновлён" });
    }
  };

  const uploadPuppyPhoto = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `puppies/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file);
    if (error) {
      toast({ title: "Ошибка загрузки фото", variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const addPuppy = async () => {
    if (!puppyForm.name.trim()) {
      toast({ title: "Введите имя щенка", variant: "destructive" });
      return;
    }
    let imageUrl: string | null = null;
    if (puppyFile) {
      imageUrl = await uploadPuppyPhoto(puppyFile);
    }
    const { error } = await supabase.from("puppies").insert({
      name: puppyForm.name.trim(),
      trait: puppyForm.trait.trim() || null,
      status: puppyForm.status,
      image_url: imageUrl,
      sort_order: puppies.length,
    });
    if (error) {
      toast({ title: "Ошибка добавления", variant: "destructive" });
    } else {
      toast({ title: "Щенок добавлен" });
      setPuppyForm({ name: "", trait: "", status: "available" });
      setPuppyFile(null);
      fetchData();
    }
  };

  const updatePuppy = async (id: string, updates: Partial<Puppy>) => {
    const { error } = await supabase.from("puppies").update(updates).eq("id", id);
    if (error) {
      toast({ title: "Ошибка обновления", variant: "destructive" });
    } else {
      toast({ title: "Обновлено" });
      fetchData();
    }
  };

  const deletePuppy = async (id: string) => {
    if (!confirm("Удалить щенка?")) return;
    const { error } = await supabase.from("puppies").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    } else {
      toast({ title: "Удалено" });
      fetchData();
    }
  };

  const updatePuppyPhoto = async (id: string, file: File) => {
    const imageUrl = await uploadPuppyPhoto(file);
    if (imageUrl) {
      await updatePuppy(id, { image_url: imageUrl });
    }
  };

  const inputClass = "w-full bg-card border border-border px-3 py-2 text-foreground text-sm font-light focus:border-primary/60 outline-none transition-colors";

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-light">Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-light text-foreground tracking-wider">Панель управления</h1>
          <button onClick={handleLogout} className="text-sm text-muted-foreground/50 hover:text-primary transition-colors">
            Выйти
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-border">
          <button
            onClick={() => { setTab("submissions"); setSelectedSubmission(null); }}
            className={`pb-3 text-sm tracking-wider uppercase transition-colors ${tab === "submissions" ? "text-primary border-b border-primary" : "text-muted-foreground/50 hover:text-foreground"}`}
          >
            Заявки ({submissions.length})
          </button>
          <button
            onClick={() => setTab("puppies")}
            className={`pb-3 text-sm tracking-wider uppercase transition-colors ${tab === "puppies" ? "text-primary border-b border-primary" : "text-muted-foreground/50 hover:text-foreground"}`}
          >
            Щенки ({puppies.length})
          </button>
        </div>

        {/* Submissions tab */}
        {tab === "submissions" && !selectedSubmission && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground/70">
                  <th className="pb-3 font-light">Дата</th>
                  <th className="pb-3 font-light">Имя</th>
                  <th className="pb-3 font-light">Город</th>
                  <th className="pb-3 font-light">Телефон</th>
                  <th className="pb-3 font-light">Статус</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSubmission(s)}
                    className="border-b border-border/50 cursor-pointer hover:bg-card/50 transition-colors"
                  >
                    <td className="py-3 text-muted-foreground font-light">
                      {new Date(s.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="py-3 text-foreground font-light">{s.name}</td>
                    <td className="py-3 text-muted-foreground font-light">{s.city || "—"}</td>
                    <td className="py-3 text-muted-foreground font-light">{s.phone}</td>
                    <td className="py-3">
                      <span className={`text-xs tracking-wider uppercase ${
                        s.status === "Новая" ? "text-primary" :
                        s.status === "В работе" ? "text-yellow-500" : "text-muted-foreground/50"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground/50 font-light">Заявок пока нет</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Submission detail */}
        {tab === "submissions" && selectedSubmission && (
          <div>
            <button onClick={() => setSelectedSubmission(null)} className="text-sm text-primary/70 hover:text-primary mb-6 tracking-wider">
              ← Назад к списку
            </button>
            <div className="bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-light text-foreground">{selectedSubmission.name}</h2>
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedSubmission.created_at).toLocaleString("ru-RU")}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground/50">Город:</span> <span className="text-foreground ml-2">{selectedSubmission.city || "—"}</span></div>
                <div><span className="text-muted-foreground/50">Телефон:</span> <span className="text-foreground ml-2">{selectedSubmission.phone}</span></div>
                <div><span className="text-muted-foreground/50">Опыт:</span> <span className="text-foreground ml-2">{selectedSubmission.experience || "—"}</span></div>
                <div><span className="text-muted-foreground/50">Кого ищет:</span> <span className="text-foreground ml-2">{selectedSubmission.looking_for || "—"}</span></div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground/50">Образ жизни:</span>
                <p className="text-foreground mt-1">{selectedSubmission.lifestyle || "—"}</p>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground/50">О себе:</span>
                <p className="text-foreground mt-1">{selectedSubmission.about || "—"}</p>
              </div>
              <div className="flex gap-2 pt-4">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateSubmissionStatus(selectedSubmission.id, status)}
                    className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors ${
                      selectedSubmission.status === status
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Puppies tab */}
        {tab === "puppies" && (
          <div className="space-y-8">
            {/* Add puppy form */}
            <div className="bg-card p-6">
              <h3 className="text-sm tracking-wider uppercase text-muted-foreground/70 mb-4">Добавить щенка</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  placeholder="Имя *"
                  value={puppyForm.name}
                  onChange={(e) => setPuppyForm({ ...puppyForm, name: e.target.value })}
                  className={inputClass}
                />
                <input
                  placeholder="Характеристика"
                  value={puppyForm.trait}
                  onChange={(e) => setPuppyForm({ ...puppyForm, trait: e.target.value })}
                  className={inputClass}
                />
                <select
                  value={puppyForm.status}
                  onChange={(e) => setPuppyForm({ ...puppyForm, status: e.target.value })}
                  className={inputClass}
                >
                  {PUPPY_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPuppyFile(e.target.files?.[0] || null)}
                  className={`${inputClass} file:bg-transparent file:border-0 file:text-muted-foreground file:text-xs`}
                />
              </div>
              <button
                onClick={addPuppy}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Добавить
              </button>
            </div>

            {/* Puppies list */}
            <div className="space-y-4">
              {puppies.map((p) => (
                <div key={p.id} className="bg-card p-4 flex items-center gap-4">
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover" />
                  )}
                  <div className="flex-1">
                    {editingPuppy === p.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          defaultValue={p.name}
                          onBlur={(e) => updatePuppy(p.id, { name: e.target.value })}
                          className={inputClass}
                        />
                        <input
                          defaultValue={p.trait || ""}
                          onBlur={(e) => updatePuppy(p.id, { trait: e.target.value || null })}
                          className={inputClass}
                        />
                        <select
                          defaultValue={p.status}
                          onChange={(e) => updatePuppy(p.id, { status: e.target.value })}
                          className={inputClass}
                        >
                          {PUPPY_STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <span className="text-foreground font-light">{p.name}</span>
                        <span className="text-muted-foreground/50 text-xs ml-3">
                          {PUPPY_STATUS_OPTIONS.find((o) => o.value === p.status)?.label || p.status}
                        </span>
                        {p.trait && <span className="text-muted-foreground/50 text-xs ml-3">{p.trait}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <label className="text-xs text-muted-foreground/50 hover:text-primary cursor-pointer transition-colors">
                      Фото
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) updatePuppyPhoto(p.id, f);
                        }}
                      />
                    </label>
                    <button
                      onClick={() => setEditingPuppy(editingPuppy === p.id ? null : p.id)}
                      className="text-xs text-muted-foreground/50 hover:text-primary transition-colors"
                    >
                      {editingPuppy === p.id ? "Готово" : "Ред."}
                    </button>
                    <button
                      onClick={() => deletePuppy(p.id)}
                      className="text-xs text-destructive/70 hover:text-destructive transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
              {puppies.length === 0 && (
                <p className="text-center text-muted-foreground/50 font-light py-8">Щенков пока нет</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
