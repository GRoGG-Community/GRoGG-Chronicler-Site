import { useState, useEffect } from "react";
import { LoadingMessage } from "../Messages";
import TreatyList from "./TreatyList";

export default function TreatyListController({
    treaties: initialTreaties,
    loaded: initialLoaded,
    onView,
    canEditTreaty,
    onEdit,
    search,
    sort
}) {
    const [treaties, setTreaties] = useState(initialTreaties ?? undefined);
    const [loaded, setLoaded] = useState(initialLoaded ?? false);

    useEffect(() => {
        if (initialTreaties) {
            setTreaties(initialTreaties);
            setLoaded(initialLoaded ?? true);
        }
    }, [initialTreaties, initialLoaded]);
    useEffect(() => {
        if (initialTreaties) return;
        fetch('/treaties.json')
            .then(res => res.json())
            .then(data => {
                setTreaties(Array.isArray(data) ? data : []);
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, [initialTreaties]);

    if (!loaded || treaties === undefined) {
        return <LoadingMessage>Loading treaties...</LoadingMessage>;
    }

    const filteredTreaties = search?.trim()
        ? treaties.filter(t =>
            (t.title && t.title.toLowerCase().includes(search.toLowerCase())) ||
            (t.content && t.content.toLowerCase().includes(search.toLowerCase())) ||
            (t.owner && t.owner.toLowerCase().includes(search.toLowerCase())) ||
            (Array.isArray(t.participants) && t.participants.some(p => p.toLowerCase().includes(search.toLowerCase())))
        )
        : treaties;
    const sortedTreaties = [...filteredTreaties].sort((a, b) => {
        if (sort === 'title') return a.title.localeCompare(b.title);
        if (sort === 'owner') return a.owner.localeCompare(b.owner);
        return 0;
    });

    return (
        <TreatyList
            treaties={sortedTreaties}
            loaded={loaded}
            onView={onView}
            canEditTreaty={canEditTreaty}
            onEdit={onEdit}
        />
    );
}
