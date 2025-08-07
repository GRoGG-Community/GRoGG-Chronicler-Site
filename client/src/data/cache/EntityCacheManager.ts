import { CacheConfig } from '../../infrastructure/config/api.config';
import { Empire } from '../models/Empire';

interface CacheEntry<T> {
    data: T;
    timestamp: Date;
    ttl: number;
}

class EntityCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    
    set(key: string, data: T, ttl: number = CacheConfig.ttl): void {
        this.cache.set(key, {
            data,
            timestamp: new Date(),
            ttl
        });
    }
    
    get(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.data;
    }
    
    invalidate(key?: string): void {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
    
    private isExpired(entry: CacheEntry<T>): boolean {
        return Date.now() - entry.timestamp.getTime() > entry.ttl;
    }
}

export const EmpireCache = new EntityCache<Empire[]>();
export const EmpireInfoCache = new EntityCache<any>();
export const AccountCache = new EntityCache<any[]>();
export const TreatyCache = new EntityCache<any[]>();
export const MessageCache = new EntityCache<any[]>();
