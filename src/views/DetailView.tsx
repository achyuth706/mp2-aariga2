import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getPokemonDetail } from "../api/pokemon";
import type { PokemonDetail } from "../types";
import { useCollection } from "../context/CollectionContext";

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from as "list" | "gallery" | undefined;

  const [data, setData] = useState<PokemonDetail | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const { ids } = useCollection();

  useEffect(() => {
    if (!id) return;
    setStatus("loading");
    getPokemonDetail(id)
      .then((res) => { setData(res); setStatus("idle"); })
      .catch(() => setStatus("error"));
  }, [id]);

  const currentIndex = useMemo(() => {
    if (!data) return -1;
    const i = ids.indexOf(data.id);
    return i >= 0 ? i : data.id - 1;
  }, [ids, data]);

  function goPrev() {
    if (!data) return;
    if (ids.length) {
      const prev = (currentIndex - 1 + ids.length) % ids.length;
      nav(`/pokemon/${ids[prev]}`);
    } else {
      nav(`/pokemon/${data.id === 1 ? 500 : data.id - 1}`);
    }
  }

  function goNext() {
    if (!data) return;
    if (ids.length) {
      const next = (currentIndex + 1) % ids.length;
      nav(`/pokemon/${ids[next]}`);
    } else {
      nav(`/pokemon/${data.id === 500 ? 1 : data.id + 1}`);
    }
  }

  function goBack() {
    if (from === "gallery") nav("/gallery");
    else if (from === "list") nav("/");
    else nav("/"); // deep link fallback
  }

  if (status === "loading") return <p className="hint">Loading…</p>;
  if (status === "error" || !data) return <p className="error">Not found.</p>;

  const image =
    data.sprites.other?.["official-artwork"]?.front_default ??
    data.sprites.front_default ??
    "";

  return (
    <section className="detail">
 
      <div className="detailTop">
        <button className="btn btn-back" onClick={goBack}>
          ← Back {from === "gallery" ? "to Gallery" : "to List"}
        </button>
      </div>

      <div className="detailHeader">
        <h2>#{data.id} {data.name}</h2>
      </div>

      <div className="detailBody">
        <img className="hero" src={image} alt={data.name} />
        <ul className="facts">
          <li><strong>Types:</strong> {data.types.map(t => t.type.name).join(", ")}</li>
          <li><strong>Base exp:</strong> {data.base_experience}</li>
          <li><strong>Height:</strong> {data.height}</li>
          <li><strong>Weight:</strong> {data.weight}</li>
          <li><strong>Abilities:</strong> {data.abilities.map(a => a.ability.name).join(", ")}</li>
        </ul>
      </div>

  
      <div className="detailPager">
        <button className="btn btn-nav btn-prev" onClick={goPrev}>← Previous</button>
        <button className="btn btn-nav btn-next" onClick={goNext}>Next →</button>
      </div>
    </section>
  );

}
