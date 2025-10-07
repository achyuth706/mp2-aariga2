export type PokemonListItem = {
    id: number;
    name: string;
    image: string;     // official artwork or fallback sprite
    types: string[];
    base_experience: number;
};

export type PokemonDetail = {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    abilities: { ability: { name: string } }[];
    types: { type: { name: string } }[];
    sprites: {
        front_default: string | null;
        other?: { ["official-artwork"]?: { front_default: string | null } };
    };
};

export type TypeOption = { name: string };
