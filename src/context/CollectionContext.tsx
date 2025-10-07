import React, { createContext, useContext, useMemo, useState } from "react";

type Ctx = { ids: number[]; setIds: (ids: number[]) => void };
const CollectionContext = createContext<Ctx | null>(null);

export const CollectionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [ids, setIds] = useState<number[]>([]);
    const value = useMemo(() => ({ ids, setIds }), [ids]);
    return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
};

export function useCollection() {
    const ctx = useContext(CollectionContext);
    if (!ctx) throw new Error("useCollection must be inside CollectionProvider");
    return ctx;
}
