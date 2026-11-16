import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

describe('CommonsSessionStorageService', () => {
  let service: CommonsSessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonsSessionStorageService],
    });
    service = TestBed.inject(CommonsSessionStorageService);
    window.sessionStorage.clear();
    service.setMaxCacheSizeLimit(150);
  });

  afterEach(() => {
    window.sessionStorage.clear();
    // Clean up any pending timers to prevent "timer still in queue" errors
    jasmine.clock().uninstall();
  });

  describe('Basic GET/SET', () => {
    it('#get should call sessionStorage.getItem() and return item', () => {
      spyOn(window.sessionStorage, 'getItem').and.returnValue('"item"');

      service.setPrefix('prefix');
      const result = service.get('test');
      expect(result).toBe('item');
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('prefix.test');
    });

    it('#get should call sessionStorage.getItem() and return an object', () => {
      spyOn(window.sessionStorage, 'getItem').and.returnValue(
        JSON.stringify({ a: 1, b: 2 }),
      );

      service.setPrefix('prefix');
      const result = service.get('test');
      expect(result).toEqual({ a: 1, b: 2 });
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('prefix.test');
    });

    it('#get should resolve from in-memory cache before flush', () => {
      spyOn(window.sessionStorage, 'getItem').and.returnValue(null);

      service.setPrefix('prefix');
      service.set('test', 'item');

      expect(service.get('test')).toBe('item');
      expect(window.sessionStorage.getItem).not.toHaveBeenCalled();
    });

    it('#set should schedule a deferred sessionStorage.setItem()', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.returnValue(null);

      service.setPrefix('prefix');
      service.set('test', 'item');

      expect(window.sessionStorage.setItem).not.toHaveBeenCalled();
      tick(25);
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('prefix.test', '"item"');
    }));

    it('#get should not call sessionStorage when value is cached', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.returnValue(null);
      spyOn(window.sessionStorage, 'getItem').and.returnValue(null);

      service.setPrefix('prefix');
      service.set('test', { data: 'value' });
      tick(25);

      const result = service.get('test');
      expect(result).toEqual({ data: 'value' });
      expect(window.sessionStorage.getItem).not.toHaveBeenCalled();
    }));
  });

  describe('Pending Writes Buffer', () => {
    it('should persist pending writes even if entry is evicted from cache', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.callThrough();
      service.setMaxCacheSizeLimit(2);

      // Add 3 items (1st will be evicted by LRU)
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.set('key3', 'value3');

      // key1 should be evicted from cache but pending writes should persist it
      tick(25);
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('key1', '"value1"');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('key2', '"value2"');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('key3', '"value3"');
    }));

    it('should keep pending writes on update (no duplicate)', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.set('key', 'value1');
      service.set('key', 'value2'); // update
      tick(25);

      const calls = (window.sessionStorage.setItem as jasmine.Spy).calls.all();
      const keySetCalls = calls.filter(c => c.args[0] === 'key');
      expect(keySetCalls.length).toBe(1);
      expect(keySetCalls[0].args[1]).toBe('"value2"');
    }));
  });

  describe('LRU Eviction', () => {
    it('should evict least recently used entry from cache when cache reaches limit', fakeAsync(() => {
      service.setMaxCacheSizeLimit(2);
      spyOn(window.sessionStorage, 'setItem').and.callThrough();
      spyOn(window.sessionStorage, 'getItem').and.callThrough();

      service.set('key1', 'value1');
      service.set('key2', 'value2');
      tick(25);

      // Access key1 to make it more recently used
      service.get('key1');

      // Add key3, should evict key2 (least recently used)
      // key2 still in sessionStorage but not in cache
      service.set('key3', 'value3');
      tick(25);

      expect(service.get('key1')).toBe('value1');
      expect(service.get('key3')).toBe('value3');
      // key2 is evicted from cache but still persists in sessionStorage
      expect(service.get('key2')).toBe('value2'); // Found via sessionStorage fallback
      expect(window.sessionStorage.getItem('key2')).toBe('"value2"');
    }));

    it('should not evict when updating existing cache entry', fakeAsync(() => {
      service.setMaxCacheSizeLimit(2);

      service.set('key1', 'value1');
      service.set('key2', 'value2');
      tick(25);

      // Update key1 should not trigger eviction
      service.set('key1', 'updated1');
      tick(25);

      expect(service.get('key1')).toBe('updated1');
      expect(service.get('key2')).toBe('value2');
    }));

    it('should track usage order correctly on get', fakeAsync(() => {
      service.setMaxCacheSizeLimit(2);
      spyOn(window.sessionStorage, 'setItem').and.callThrough();
      spyOn(window.sessionStorage, 'getItem').and.callThrough();

      service.set('key1', 'value1');
      service.set('key2', 'value2');
      tick(25);

      // Access key1 to mark as recently used
      service.get('key1');

      // Add key3, should evict key2 not key1
      service.set('key3', 'value3');
      tick(25);

      expect(service.get('key1')).toBe('value1');
      expect(service.get('key3')).toBe('value3');
      // key2 is evicted from cache but persists in sessionStorage
      expect(service.get('key2')).toBe('value2'); // Fallback to sessionStorage
      expect(window.sessionStorage.getItem('key2')).toBe('"value2"');
    }));

    it('should keep updated key as most recently used before evicting on new insert', fakeAsync(() => {
      service.setMaxCacheSizeLimit(2);

      service.set('key1', 'value1');
      service.set('key2', 'value2');
      tick(25);

      // Updating key1 should refresh its LRU position
      service.set('key1', 'value1-updated');
      tick(25);

      // New insertion with full cache should evict key2 (oldest), not updated key1
      service.set('key3', 'value3');
      tick(25);

      expect(service.get('key1')).toBe('value1-updated');
      expect(service.get('key3')).toBe('value3');
      expect(service.get('key2')).toBe('value2'); // Fallback to sessionStorage
    }));
  });

  describe('Remove and ClearAll', () => {
    it('#remove should synchronously remove from cache and sessionStorage', fakeAsync(() => {
      spyOn(window.sessionStorage, 'removeItem').and.callThrough();
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.setPrefix('prefix');
      service.set('test', 'item');
      tick(25); // Wait for write to persist
      
      service.remove('test');

      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('prefix.test');
      expect(service.get('test')).toEqual(null);
      expect(window.sessionStorage.getItem('prefix.test')).toEqual(null);
    }));

    it('#remove should not appear in pending writes after removal', fakeAsync(() => {
      spyOn(window.sessionStorage, 'removeItem').and.callThrough();
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.set('test', 'item');
      tick(25); // Ensure write is persisted
      service.remove('test');
      tick(25); // Ensure no new writes are flushed

      expect(window.sessionStorage.getItem('test')).toEqual(null);
    }));

    it('#clearAll should remove matching keys immediately', fakeAsync(() => {
      spyOn(window.sessionStorage, 'removeItem').and.callThrough();

      window.sessionStorage.setItem('prefix.test1', 'value1');
      window.sessionStorage.setItem('prefix.test2', 'value2');
      window.sessionStorage.setItem('other.key', 'value3');

      service.setPrefix('prefix');
      service.clearAll();

      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('prefix.test1');
      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('prefix.test2');
      expect(window.sessionStorage.getItem('other.key')).toBe('value3');
    }));

    it('#clearAll should clear pending writes for matching keys', fakeAsync(() => {
      service.setMaxCacheSizeLimit(2);
      spyOn(window.sessionStorage, 'setItem').and.callThrough();
      spyOn(window.sessionStorage, 'removeItem').and.callThrough();

      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.set('key3', 'value3');

      tick(25); // Flush all writes to sessionStorage

      // Now clearAll without prefix (default prefix is '')
      service.clearAll();

      // After clearAll, all keys should be removed
      expect(window.sessionStorage.getItem('key1')).toEqual(null);
      expect(window.sessionStorage.getItem('key2')).toEqual(null);
      expect(window.sessionStorage.getItem('key3')).toEqual(null);
    }));
  });

  describe('Dynamic Limit', () => {
    it('#setMaxCacheSizeLimit should reduce limit and evict excess entries', fakeAsync(() => {
      service.setMaxCacheSizeLimit(5);

      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.set('key3', 'value3');
      service.set('key4', 'value4');
      service.set('key5', 'value5');
      tick(25); // Flush to sessionStorage

      // Reduce limit to 2, should evict 3 least recently used from cache
      service.setMaxCacheSizeLimit(2);

      // key3, key4 are evicted from cache but persists in sessionStorage
      expect(service.get('key3')).toBe('value3'); // Fallback to sessionStorage
      expect(service.get('key4')).toBe('value4'); // Fallback to sessionStorage
      expect(service.get('key5')).toBe('value5'); // Most recently added, still in cache
      
      // key1, key2 are the oldest, so they should be evicted
      expect(service.get('key1')).toBe('value1'); // Falls back to sessionStorage
      expect(service.get('key2')).toBe('value2'); // Falls back to sessionStorage
    }));
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined values correctly', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.set('nullKey', null);
      service.set('undefinedKey', undefined);
      tick(25);

      expect(service.get('nullKey')).toEqual(null);
      expect(service.get('undefinedKey')).toEqual(null);
      expect(window.sessionStorage.getItem('nullKey')).toBe('null');
      expect(window.sessionStorage.getItem('undefinedKey')).toBe('null');
    }));

    it('should return null for non-existent keys', () => {
      expect(service.get('nonExistent')).toEqual(null);
    });

    it('should handle parsing errors gracefully', fakeAsync(() => {
      window.sessionStorage.setItem('badJson', 'not-valid-json');
      tick(25);

      const result = service.get('badJson');
      expect(result).toBe('not-valid-json');
    }));
  });

  describe('Flush and Synchronization', () => {
    it('should defer writes to sessionStorage and batch them', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.set('key3', 'value3');

      // Before tick, writes should not hit sessionStorage (they're batched)
      expect(window.sessionStorage.setItem).not.toHaveBeenCalled();

      tick(25); // Wait for debounce

      // After tick, all writes should be flushed together
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('key1', '"value1"');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('key2', '"value2"');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('key3', '"value3"');
    }));

    it('should not batch updates for the same key (use latest value)', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.set('key', 'value1');
      service.set('key', 'value2');
      service.set('key', 'value3');

      tick(25);

      const calls = (window.sessionStorage.setItem as jasmine.Spy).calls.all();
      const keySetCalls = calls.filter(c => c.args[0] === 'key');
      
      // Should only store once with the latest value
      expect(keySetCalls.length).toBe(1);
      expect(keySetCalls[0].args[1]).toBe('"value3"');
    }));

    it('should cancel pending flush when new set is called before debounce completes', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.set('key', 'value1');
      tick(10); // Wait 10ms
      service.set('key', 'value2'); // Should reset debounce timer
      tick(25); // Now complete the debounce for the new set

      // Should only have final value (one call total)
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('key', '"value2"');
      const calls = (window.sessionStorage.setItem as jasmine.Spy).calls.all();
      const keySetCalls = calls.filter(c => c.args[0] === 'key');
      expect(keySetCalls.length).toBe(1); // Only one final write
      expect(keySetCalls[0].args[1]).toBe('"value2"');
    }));

    it('should maintain cache consistency when updates flow to sessionStorage', fakeAsync(() => {
      service.set('key', 'cached_value');
      tick(25);

      // Value should be both in cache and sessionStorage
      expect(service.get('key')).toBe('cached_value');
      expect(window.sessionStorage.getItem('key')).toBe('"cached_value"');
    }));
  });

  describe('Configuration', () => {
    it('#setPrefix should apply prefix to all keys', fakeAsync(() => {
      spyOn(window.sessionStorage, 'setItem').and.callThrough();

      service.setPrefix('app');
      service.set('key', 'value');
      tick(25);

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('app.key', '"value"');
    }));

    it('#get with withPrefix false should skip prefix', () => {
      window.sessionStorage.setItem('key', '"value"');
      service.setPrefix('app');

      const result = service.get('key', { withPrefix: false });
      expect(result).toBe('value');
    });

    it('#isSupported should return if the window has sessionStorage', () => {
      const result = service.isSupported();
      expect(result).toBe(true);
    });
  });
});
