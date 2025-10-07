import { useEffect, useMemo, useState } from "react";

type Props = { value: string; onChange: (v: string) => void; placeholder?: string };

export default function SearchBar({ value, onChange, placeholder = "Search..." }: Props) {
    const [local, setLocal] = useState(value);
    useEffect(() => setLocal(value), [value]);

    const debounced = useMemo(() => {
        let t: number | undefined;
        return (v: string) => {
            setLocal(v);
            if (t) window.clearTimeout(t);
            t = window.setTimeout(() => onChange(v), 150);
        };
    }, [onChange]);

    return (
        <input
            className="input"
            value={local}
            onChange={(e) => debounced(e.target.value)}
            placeholder={placeholder}
            aria-label="Search"
        />
    );
}
