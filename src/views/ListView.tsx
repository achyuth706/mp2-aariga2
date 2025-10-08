import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPokemonBasic } from "../api/pokemon";
import type { PokemonListItem } from "../types";
import SearchBar from "../components/SearchBar";
import { useCollection } from "../context/CollectionContext";

type SortKey = "name" | "id" | "base_experience";

export default function ListView() {
    const [data, setData] = useState<PokemonListItem[]>([]);
    const [q, setQ] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [asc, setAsc] = useState(true);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const { setIds } = useCollection();

    useEffect(() => {
        setStatus("loading");
        getAllPokemonBasic(1025)
            .then((res) => { setData(res); setStatus("idle"); })
            .catch(() => setStatus("error"));
    }, []);

    const filtered = useMemo(() => {
        const ql = q.trim().toLowerCase();
        let out = ql
            ? data.filter((p) => p.name.includes(ql) || String(p.id) === ql)
            : data.slice();
        out.sort((a, b) => {
            const A = sortKey === "name" ? a.name : a.id;
            const B = sortKey === "name" ? b.name : b.id;
            const cmp = A < B ? -1 : A > B ? 1 : 0;
            return asc ? cmp : -cmp;
        });
        setIds(out.map((p) => p.id));
        return out;
    }, [data, q, sortKey, asc, setIds]);

    if (status === "loading") return <p className="hint">Loading…</p>;
    if (status === "error") return <p className="error">Could not load data.</p>;

    return (
        <section className="panel">
            <div className="toolbar">
                <SearchBar value={q} onChange={setQ} placeholder="Search by name or exact ID" />
                <div className="sorter">
                    <label>
                        Sort by{" "}
                        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
                            <option value="name">Name</option>
                            <option value="id">ID</option>
                            <option value="base_experience">Base Experience</option>
                        </select>
                    </label>
                    <button onClick={() => setAsc((v) => !v)}>{asc ? "Ascending" : "Descending"}</button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="hint">No results.</p>
            ) : (
                <ul className="list">
                    {filtered.map((p) => (
                        <li key={p.id} className="listItem">
                            <Link
                                to={`/pokemon/${p.id}`}
                                state={{ from: "list" }}
                                className="itemLink"
                            >
                                <img src={p.image} alt={p.name} />
                                <div>
                                    <h3>#{p.id} {p.name}</h3>
                                    <p className="muted">{p.types.join(", ")}</p>
                                </div>
                            </Link>

                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
