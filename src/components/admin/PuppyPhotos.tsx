import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
}

const PuppyPhotos = ({ puppyId }: { puppyId: string }) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("puppy_photos")
      .select("*")
      .eq("puppy_id", puppyId)
      .order("sort_order", { ascending: true });
    if (data) setPhotos(data);
  };

  useEffect(() => {
    load();
  }, [puppyId]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let added = 0;
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `puppies/${puppyId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("photos").upload(path, file);
      if (upErr) continue;
      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
      const { error: insErr } = await supabase.from("puppy_photos").insert({
        puppy_id: puppyId,
        image_url: urlData.publicUrl,
        sort_order: photos.length + added,
        is_cover: photos.length + added === 0,
      });
      if (!insErr) added++;
    }
    setUploading(false);
    toast({ title: `Загружено фото: ${added}` });
    load();
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Удалить фото?")) return;
    const { error } = await supabase.from("puppy_photos").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    } else {
      load();
    }
  };

  const setCover = async (id: string) => {
    await supabase.from("puppy_photos").update({ is_cover: false }).eq("puppy_id", puppyId);
    await supabase.from("puppy_photos").update({ is_cover: true }).eq("id", id);
    toast({ title: "Обложка обновлена" });
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const i = photos.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= photos.length) return;
    const a = photos[i];
    const b = photos[j];
    await supabase.from("puppy_photos").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("puppy_photos").update({ sort_order: a.sort_order }).eq("id", b.id);
    load();
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <div className="flex items-center gap-3 mb-3">
        <label className="text-xs text-muted-foreground/70 hover:text-primary cursor-pointer transition-colors tracking-wider uppercase">
          {uploading ? "Загрузка..." : "+ Добавить фото (можно несколько)"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
        <span className="text-xs text-muted-foreground/40">{photos.length} шт.</span>
      </div>
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {photos.map((p, i) => (
            <div key={p.id} className="relative group">
              <img src={p.image_url} alt="" className="w-full aspect-square object-cover" />
              {p.is_cover && (
                <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 tracking-wider uppercase">
                  Обложка
                </span>
              )}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-xs">
                {!p.is_cover && (
                  <button onClick={() => setCover(p.id)} className="text-primary hover:underline">
                    Сделать обложкой
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => move(p.id, -1)}
                    disabled={i === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => move(p.id, 1)}
                    disabled={i === photos.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button onClick={() => deletePhoto(p.id)} className="text-destructive hover:underline">
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PuppyPhotos;
