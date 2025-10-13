const PREFIX = "listing_drafts_v1";
const keyDrafts = (uid) => (uid ? `${PREFIX}__${uid}` : PREFIX);
const keyCurrent = (uid) => (uid ? `${PREFIX}__current__${uid}` : `${PREFIX}__current`);

const read = (k) => {
    try { return JSON.parse(localStorage.getItem(k) || "{}"); }
    catch { return {}; }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const getAll = (uid) => read(keyDrafts(uid));
const setAll = (map, uid) => write(keyDrafts(uid), map);

const getCurrentId = (uid) => localStorage.getItem(keyCurrent(uid)) || null;
const setCurrentId = (id, uid) => {
    if (id) localStorage.setItem(keyCurrent(uid), id);
    else localStorage.removeItem(keyCurrent(uid));
};

const genId = () => (globalThis.crypto?.randomUUID?.() || String(Date.now()));

export const listingDrafts = {

    save(data, uid) {
        const id = data?.id || genId();
        const savedAt = new Date().toISOString();
        const entry = { ...data, id, savedAt };
        const all = getAll(uid);
        all[id] = entry;
        setAll(all, uid);
        setCurrentId(id, uid);
        return id;
    },

    update(id, patch, uid) {
        if (!id) return null;
        const all = getAll(uid);
        const prev = all[id] || { id };
        all[id] = { ...prev, ...patch, id, savedAt: new Date().toISOString() };
        setAll(all, uid);
        return all[id];
    },

    load(id, uid) {
        if (!id) return null;
        return getAll(uid)[id] || null;
    },

    remove(id, uid) {
        if (!id) return;
        const all = getAll(uid);
        delete all[id];
        setAll(all, uid);
        if (getCurrentId(uid) === id) setCurrentId(null, uid);
    },

    list(uid) {
        return Object.values(getAll(uid)).sort(
            (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
        );
    },

    getCurrentId,
    setCurrentId,

    clearAll(uid) {
        setAll({}, uid);
        setCurrentId(null, uid);
    },
};
