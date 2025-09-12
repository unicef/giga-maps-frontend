interface CacheConfig {
  useLocalStorage?: boolean;
  prefix?: string;
  defaultExpiration?: number; // in milliseconds
}

interface CacheItem {
  value: string;
  // expiration?: number;
}

type Language = 'en' | 'es' | 'pt' | string; // extendable for more languages

class TranslationCacheUtility {
  private cache: Map<string, CacheItem>;
  private config: CacheConfig;

  constructor(config: CacheConfig = {}) {
    this.cache = new Map();
    this.config = {
      useLocalStorage: config.useLocalStorage || false,
      prefix: config.prefix || 'cache_',
      // defaultExpiration: config.defaultExpiration || 24 * 60 * 60 * 1000, // 24 hours
    };

    if (this.config.useLocalStorage) {
      this.loadFromLocalStorage();
    }
  }

  private getKey(key: string, language: Language): string {
    return `${this.config.prefix}${language}_${key}`;
  }

  set(key: string, value: string, language: Language, expiration?: number): void {
    const cacheKey = this.getKey(key, language);
    const item: CacheItem = {
      value,
      // expiration: expiration || (Date.now() + this.config.defaultExpiration!),
    };

    this.cache.set(cacheKey, item);

    if (this.config.useLocalStorage) {
      this.saveToLocalStorage();
    }
  }

  get(key: string, language: Language): string | undefined {
    const cacheKey = this.getKey(key, language);
    const item = this.cache.get(cacheKey);

    if (item/* && (!item.expiration || item.expiration > Date.now())*/) {
      return item.value;
    }

    if (item) {
      this.cache.delete(cacheKey);
      if (this.config.useLocalStorage) {
        this.saveToLocalStorage();
      }
    }

    return undefined;
  }

  hasKey(key: string, language: Language): boolean {
    const cacheKey = this.getKey(key, language);
    return this.cache.has(cacheKey);
  }

  setMultiple(items: Record<string, string>, language: Language): void {
    Object.entries(items).forEach(([key, value]) => {
      this.set(key, value, language);
    });
  }

  getMultiple(keys: string[], language: Language): Record<string, string | undefined> {
    return keys.reduce((acc, key) => {
      acc[key] = this.get(key, language);
      return acc;
    }, {} as Record<string, string | undefined>);
  }

  remove(key: string, language: Language): void {
    const cacheKey = this.getKey(key, language);
    this.cache.delete(cacheKey);

    if (this.config.useLocalStorage) {
      this.saveToLocalStorage();
    }
  }

  clear(): void {
    this.cache.clear();

    if (this.config.useLocalStorage) {
      this.clearLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const serialized = JSON.stringify(Array.from(this.cache.entries()));
      localStorage.setItem(this.config.prefix!, serialized);
    }
  }

  private loadFromLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const serialized = localStorage.getItem(this.config.prefix!);
      if (serialized) {
        const items: [string, CacheItem][] = JSON.parse(serialized);
        items.forEach(([key, value]) => this.cache.set(key, value));
      }
    }
  }

  private clearLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.config.prefix!);
    }
  }

  // New method to initialize cache with i18n resources
  async initializeWithI18nResources(resources: Record<string, Record<string, string>>): Promise<void> {
    const { en, ...othersResources } = resources;
    const othersLng = Object.keys(othersResources);
    const newResources = {} as Record<string, Record<string, string>>;
    for (let key in en) {
      const newKey = en[key];
      for (let lng of othersLng) {
        if (!newResources[lng]) {
          newResources[lng] = {};
        }
        newResources[lng][newKey] = othersResources[lng][key];
      }
    }
    for (let lang in newResources) { // for each language (resource )
      this.setMultiple(newResources[lang] as Record<string, string>, lang);
    }

    console.log('Cache initialized with i18n resources');
  }
}

export default TranslationCacheUtility;

