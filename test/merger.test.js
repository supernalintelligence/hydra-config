const { ConfigMerger } = require('../../../supernal-code-package/lib/config');

describe('ConfigMerger', () => {
  let merger;

  beforeEach(() => {
    merger = new ConfigMerger();
  });

  describe('merge scalars', () => {
    it('should use last-wins strategy for scalar values', () => {
      const configs = [
        { name: 'first' },
        { name: 'second' },
        { name: 'third' },
      ];

      const result = merger.merge(configs);
      expect(result.name).toBe('third');
    });

    it('should preserve unoverridden values', () => {
      const configs = [{ a: 1, b: 2, c: 3 }, { b: 20 }];

      const result = merger.merge(configs);
      expect(result).toEqual({ a: 1, b: 20, c: 3 });
    });
  });

  describe('deep merge objects', () => {
    it('should deep merge nested objects', () => {
      const configs = [
        { project: { validation: { strict: true } } },
        { project: { validation: { auto_fix: true } } },
      ];

      const result = merger.merge(configs);
      expect(result.project.validation.strict).toBe(true);
      expect(result.project.validation.auto_fix).toBe(true);
    });

    it('should handle multiple nesting levels', () => {
      const configs = [
        { a: { b: { c: { d: 1 } } } },
        { a: { b: { c: { e: 2 } } } },
      ];

      const result = merger.merge(configs);
      expect(result.a.b.c.d).toBe(1);
      expect(result.a.b.c.e).toBe(2);
    });

    it('should override scalar with object', () => {
      const configs = [{ value: 'string' }, { value: { nested: true } }];

      const result = merger.merge(configs);
      expect(result.value).toEqual({ nested: true });
    });
  });

  describe('array merging', () => {
    it('should append arrays by default', () => {
      const configs = [
        { features: ['validation'] },
        { features: ['traceability'] },
      ];

      const result = merger.merge(configs);
      expect(result.features).toEqual(['validation', 'traceability']);
    });

    it('should replace arrays with __replace__ marker', () => {
      const configs = [
        { features: ['validation', 'traceability'] },
        { features: ['__replace__', 'custom'] },
      ];

      const result = merger.merge(configs);
      expect(result.features).toEqual(['custom']);
    });

    it('should handle empty arrays', () => {
      const configs = [{ items: [] }, { items: ['first'] }];

      const result = merger.merge(configs);
      expect(result.items).toEqual(['first']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty configs array', () => {
      const result = merger.merge([]);
      expect(result).toEqual({});
    });

    it('should handle single config', () => {
      const result = merger.merge([{ a: 1, b: 2 }]);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should not mutate source objects', () => {
      const config1 = { a: 1, nested: { b: 2 } };
      const config2 = { nested: { c: 3 } };

      merger.merge([config1, config2]);

      expect(config1.nested).toEqual({ b: 2 });
      expect(config2.nested).toEqual({ c: 3 });
    });
  });
});
