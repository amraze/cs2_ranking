import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CacheManager<T> {
    private cache = new Map<string, { data: T; timestamp: number }>();
    constructor() { }

    generateKey(key: CacheKey): string {
        const params = key.params
            ? Object.entries(key.params)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => `${k}=${encodeURIComponent(JSON.stringify(v))}`)
                .join('&')
            : '';

        return params
            ? `${key.entity}:${params}`
            : `${key.entity}`;
    }

    get(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        return entry.data;
    }

    set(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    clear(): void {
        this.cache.clear();
    }
}