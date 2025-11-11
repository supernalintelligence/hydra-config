const path = require('path');
const fs = require('fs-extra');
const {
  ConfigLoader,
  YAMLSyntaxError,
  PatternNotFoundError,
} = require('../src');

describe('ConfigLoader', () => {
  let loader;
  const fixturesDir = path.join(__dirname, 'fixtures/config');
  const patternsDir = path.join(__dirname, '..', 'src', 'patterns');

  beforeEach(() => {
    loader = new ConfigLoader({
      searchPaths: [patternsDir],
    });
  });

  afterEach(() => {
    loader.clearCache();
  });

  describe('parseYAML', () => {
    it('should parse valid YAML', async () => {
      const validPath = path.join(fixturesDir, 'valid/simple.yaml');
      const config = await loader.parseYAML(validPath);

      expect(config).toHaveProperty('version');
      expect(config).toHaveProperty('workflow');
    });

    it('should throw YAMLSyntaxError for invalid YAML', async () => {
      const invalidPath = path.join(fixturesDir, 'invalid/syntax-error.yaml');

      await expect(loader.parseYAML(invalidPath)).rejects.toThrow(
        YAMLSyntaxError
      );
    });

    it('should include context lines in YAML error', async () => {
      const invalidPath = path.join(fixturesDir, 'invalid/syntax-error.yaml');

      try {
        await loader.parseYAML(invalidPath);
      } catch (error) {
        expect(error.message).toContain('|'); // Context lines have | separator
      }
    });
  });

  describe('load', () => {
    it('should load simple config without defaults', async () => {
      const simplePath = path.join(fixturesDir, 'valid/simple.yaml');
      const config = await loader.load(simplePath);

      expect(config.version).toBe('3.0.0');
      expect(config.workflow).toBe('minimal');
    });

    it('should resolve workflow reference', async () => {
      const withWorkflowPath = path.join(
        fixturesDir,
        'valid/with-workflow.yaml'
      );
      const config = await loader.load(withWorkflowPath);

      // Should include phases from minimal workflow
      expect(config.phases).toBeDefined();
      expect(config.phases).toHaveLength(1);
      expect(config.phases[0].name).toBe('default');
    });

    it('should merge user overrides on top', async () => {
      const withOverridesPath = path.join(
        fixturesDir,
        'valid/with-overrides.yaml'
      );
      const config = await loader.load(withOverridesPath);

      // User override
      expect(config.project.docs_dir).toBe('designs');

      // From workflow
      expect(config.phases).toBeDefined();
      expect(config.project.name).toBe('my-project'); // User override
    });
  });

  describe('caching', () => {
    it('should cache loaded config', async () => {
      const simplePath = path.join(fixturesDir, 'valid/simple.yaml');

      const config1 = await loader.load(simplePath);
      const config2 = await loader.get(simplePath);

      expect(config1).toBe(config2); // Same object reference
    });

    it('should load if not cached', async () => {
      const simplePath = path.join(fixturesDir, 'valid/simple.yaml');

      const config = await loader.get(simplePath);

      expect(config).toHaveProperty('version');
    });

    it('should clear cache', async () => {
      const simplePath = path.join(fixturesDir, 'valid/simple.yaml');

      const config1 = await loader.load(simplePath);
      loader.clearCache();
      const config2 = await loader.get(simplePath);

      expect(config1).not.toBe(config2); // Different objects after clear
    });
  });
});
