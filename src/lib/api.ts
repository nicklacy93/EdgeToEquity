export async function apiGenerate(payload: any) {
    const r = await fetch('/api/strategy/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error(`generate ${r.status}`);
    return r.json();
}
export async function apiEdit(payload: any) {
    const r = await fetch('/api/strategy/edit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error(`edit ${r.status}`);
    return r.json();
}
export async function apiCompile(spec: any) {
    const r = await fetch('/api/strategy/compile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spec) });
    if (!r.ok) throw new Error(`compile ${r.status}`);
    return r.json();
}
export async function apiImport(payload: any) {
    const r = await fetch('/api/strategy/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error(`import ${r.status}`);
    return r.json();
}

