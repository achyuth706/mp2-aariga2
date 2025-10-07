type Props = {
    all: string[];
    selected: string[];
    toggle: (name: string) => void;
    clear: () => void;
};

export default function TypeChips({ all, selected, toggle, clear }: Props) {
    return (
        <div className="chipBar">
            <div className="chips">
                {all.map((name) => (
                    <button
                        key={name}
                        className={`chip ${selected.includes(name) ? "chipOn" : ""}`}
                        onClick={() => toggle(name)}
                        aria-pressed={selected.includes(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            {selected.length > 0 && (
                <button className="linklike" onClick={clear}>Clear filters</button>
            )}
        </div>
    );
}
