import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPokemonBasic, getAllTypes } from "../api/pokemon";
import type { PokemonListItem } from "../types";
import TypeChips from "../components/TypeChips";
import SearchBar from "../components/SearchBar";
import { useCollection } from "../context/CollectionContext";

type SortKey = "id" | "name";

export default function GalleryView() {
    const [data, setData] = useState<PokemonListItem[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [q, setQ] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("id");
    const [asc, setAsc] = useState(true);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const { setIds } = useCollection();

    useEffect(() => {
        setStatus("loading");
        Promise.all([getAllPokemonBasic(500), getAllTypes()])
            .then(([pokemon, ts]) => {
                setData(pokemon);
                setTypes(ts.map((t) => t.name));
                setStatus("idle");
            })
            .catch(() => setStatus("error"));
    }, []);

    const visible = useMemo(() => {
        const query = q.trim().toLowerCase();

        let out = data;

        if (query) {
            out = out.filter(
                (p) => p.name.includes(query) || String(p.id) === query
            );
        }

        if (selected.length) {
            out = out.filter((p) => selected.every((t) => p.types.includes(t)));
        }

        const sorted = out.slice().sort((a, b) => {
            const A = sortKey === "id" ? a.id : a.name;
            const B = sortKey === "id" ? b.id : b.name;
            const cmp = A < B ? -1 : A > B ? 1 : 0;
            return asc ? cmp : -cmp;
        });

        setIds(sorted.map((p) => p.id));

        return sorted;
    }, [data, q, selected, sortKey, asc, setIds]);

    function toggleType(name: string) {
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    }

    if (status === "loading") return <p className="hint">Loading…</p>;
    if (status === "error") return <p className="error">Couldn’t load gallery.</p>;

    return (
        <section className="panel">

            <div className="toolbar">
                <SearchBar
                    value={q}
                    onChange={setQ}
                    placeholder="Search by name or exact ID"
                />
                <div className="sorter">
                    <label>
                        Sort by{" "}
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            aria-label="Sort key"
                        >
                            <option value="name">Name</option>
                            <option value="id">ID</option>
                            <option value="base_experience">Base Experience</option>

                        </select>
                    </label>
                    <button onClick={() => setAsc((v) => !v)} aria-label="Toggle order">
                        {asc ? "Ascending" : "Descending"}
                    </button>
                </div>
            </div>


            <TypeChips
                all={types}
                selected={selected}
                toggle={toggleType}
                clear={() => setSelected([])}
            />


            {visible.length === 0 ? (
                <p className="hint">No Pokémon match those filters.</p>
            ) : (
                <div className="grid">
                    {visible.map((p) => (
                        <Link
                            to={`/pokemon/${p.id}`}
                            state={{ from: "gallery" }}
                            className="card"
                        >
                            <img src={p.image} alt={p.name} />
                            <div className="cardBody">
                                <h3>#{p.id} {p.name}</h3>
                                <p className="muted">{p.types.join(", ")}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
