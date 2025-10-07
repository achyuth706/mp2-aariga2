import axios from "axios";
import type { PokemonDetail, PokemonListItem, TypeOption } from "../types";
import mock from "../data/pokemon-mock.json";

const api = axios.create({
    baseURL: "https://pokeapi.co/api/v2",
    timeout: 15000,
});


const cache = new Map<string, unknown>();
function memo<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (cache.has(key)) return Promise.resolve(cache.get(key) as T);
    return fetcher().then((v) => {
        cache.set(key, v);
        return v;
    });
}

export async function getPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
    return memo(`detail-${idOrName}`, async () => {
        try {
            const { data } = await api.get<PokemonDetail>(`/pokemon/${idOrName}`);
            return data;
        } catch {
            const hit = (mock as any[]).find((m) => m.id === Number(idOrName));
            if (hit) return hit as PokemonDetail;
            throw new Error("detail fetch failed");
        }
    });
}

export async function getAllTypes(): Promise<TypeOption[]> {
    return memo("types", async () => {
        try {
            const { data } = await api.get<{ results: { name: string }[] }>("/type");
            return data.results
                .map((t) => ({ name: t.name }))
                .filter((t) => !["shadow", "unknown"].includes(t.name));
        } catch {
            return [
                "grass", "poison", "fire", "water", "bug", "normal", "electric", "ground", "fairy", "fighting", "psychic", "rock", "ghost", "ice", "dragon", "dark", "steel", "flying",
            ].map((n) => ({ name: n }));
        }
    });
}

export async function getAllPokemonBasic(limit = 500): Promise<PokemonListItem[]> {
    return memo(`all-basic-${limit}`, async () => {
        try {
            const ids = Array.from({ length: limit }, (_, i) => i + 1);
            const window = 20;
            const chunks: number[][] = [];
            for (let i = 0; i < ids.length; i += window) chunks.push(ids.slice(i, i + window));

            const results: PokemonListItem[] = [];
            for (const group of chunks) {
                const batch = await Promise.all(
                    group.map((id) =>
                        api.get<PokemonDetail>(`/pokemon/${id}`).then(({ data }) => {
                            const image =
                                data.sprites.other?.["official-artwork"]?.front_default ??
                                data.sprites.front_default ??
                                "";
                            return { id: data.id, name: data.name, image, types: data.types.map((t) => t.type.name), base_experience: data.base_experience };
                        })
                    )
                );
                results.push(...batch);
            }
            return results;
        } catch {
            return (mock as PokemonDetail[]).map((d) => {
                const image =
                    d.sprites.other?.["official-artwork"]?.front_default ??
                    d.sprites.front_default ??
                    "";
                return { id: d.id, name: d.name, image, types: d.types.map((t) => t.type.name), base_experience: d.base_experience };
            });
        }
    });
}
