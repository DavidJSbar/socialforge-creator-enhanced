import {
  retryWithBackoff,
  sleep,
  withTimeout,
  batchAsync,
  safeJSONParse,
} from '@/app/lib/async-utils';

describe('Async Utilities', () => {
  describe('sleep', () => {
    it('should wait for the specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(95); // Allow small margin
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, { initialDelayMs: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('always fails'));

      await expect(
        retryWithBackoff(fn, { maxRetries: 2, initialDelayMs: 10 })
      ).rejects.toThrow('always fails');
      expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });

    it('should call onRetry callback', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');
      
      const onRetry = jest.fn();

      await retryWithBackoff(fn, { onRetry, initialDelayMs: 10 });
      
      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
    });

    it('should use exponential backoff', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const delays: number[] = [];
      const onRetry = jest.fn((attempt) => {
        delays.push(Date.now());
      });

      await retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelayMs: 50,
        backoffMultiplier: 2,
        onRetry,
      });

      // Check that delays increase exponentially (with some tolerance)
      if (delays.length >= 2) {
        const firstDelay = delays[1] - delays[0];
        const secondDelay = delays.length > 2 ? delays[2] - delays[1] : 0;
        expect(secondDelay).toBeGreaterThan(firstDelay);
      }
    });
  });

  describe('withTimeout', () => {
    it('should resolve if promise completes within timeout', async () => {
      const promise = new Promise((resolve) => setTimeout(() => resolve('success'), 50));
      const result = await withTimeout(promise, 200);
      expect(result).toBe('success');
    });

    it('should reject if promise exceeds timeout', async () => {
      const promise = new Promise((resolve) => setTimeout(() => resolve('too late'), 200));
      
      await expect(withTimeout(promise, 50)).rejects.toThrow('Operation timed out');
    });

    it('should use custom error message', async () => {
      const promise = new Promise((resolve) => setTimeout(() => resolve('delayed'), 200));
      
      await expect(
        withTimeout(promise, 50, 'Custom timeout message')
      ).rejects.toThrow('Custom timeout message');
    });
  });

  describe('batchAsync', () => {
    it('should process all items', async () => {
      const items = [1, 2, 3, 4, 5];
      const fn = jest.fn((x) => Promise.resolve(x * 2));

      const results = await batchAsync(items, fn, 2);

      expect(results).toHaveLength(5);
      expect(results).toEqual([2, 4, 6, 8, 10]);
      expect(fn).toHaveBeenCalledTimes(5);
    });

    it('should respect concurrency limit', async () => {
      const items = [1, 2, 3, 4, 5];
      let concurrent = 0;
      let maxConcurrent = 0;

      const fn = async (x: number) => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await sleep(50);
        concurrent--;
        return x * 2;
      };

      await batchAsync(items, fn, 2);

      expect(maxConcurrent).toBeLessThanOrEqual(2);
    });

    it('should handle empty array', async () => {
      const results = await batchAsync([], (x) => Promise.resolve(x), 5);
      expect(results).toEqual([]);
    });

    it('should handle errors in processing', async () => {
      const items = [1, 2, 3];
      const fn = jest.fn((x) => {
        if (x === 2) return Promise.reject(new Error('Error at 2'));
        return Promise.resolve(x * 2);
      });

      await expect(batchAsync(items, fn, 2)).rejects.toThrow('Error at 2');
    });
  });

  describe('safeJSONParse', () => {
    it('should parse valid JSON', () => {
      const result = safeJSONParse('{"key": "value"}', {});
      expect(result).toEqual({ key: 'value' });
    });

    it('should return fallback for invalid JSON', () => {
      const fallback = { default: true };
      const result = safeJSONParse('invalid json', fallback);
      expect(result).toEqual(fallback);
    });

    it('should handle arrays', () => {
      const result = safeJSONParse('[1, 2, 3]', []);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return fallback for empty string', () => {
      const fallback = { empty: true };
      const result = safeJSONParse('', fallback);
      expect(result).toEqual(fallback);
    });

    it('should parse complex nested objects', () => {
      const json = '{"user": {"name": "John", "age": 30}}';
      const result = safeJSONParse(json, {});
      expect(result).toEqual({ user: { name: 'John', age: 30 } });
    });
  });
});
