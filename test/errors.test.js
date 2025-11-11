const {
  YAMLSyntaxError,
  PatternNotFoundError,
  CircularDependencyError,
} = require('../src');

describe('Error Classes', () => {
  describe('YAMLSyntaxError', () => {
    it('should include file path, line, and column', () => {
      const mockError = {
        mark: { line: 5, column: 10 },
      };
      const content = 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6';

      const error = new YAMLSyntaxError(
        mockError,
        '/path/to/file.yaml',
        content
      );

      expect(error.name).toBe('YAMLSyntaxError');
      expect(error.filePath).toBe('/path/to/file.yaml');
      expect(error.lineNumber).toBe(5);
      expect(error.column).toBe(10);
      expect(error.message).toContain('/path/to/file.yaml:5:10');
    });

    it('should include context lines', () => {
      const mockError = {
        mark: { line: 3, column: 0 },
      };
      const content = 'line 1\nline 2\nline 3\nline 4\nline 5';

      const error = new YAMLSyntaxError(mockError, 'file.yaml', content);

      expect(error.message).toContain('line 1');
      expect(error.message).toContain('line 2');
      expect(error.message).toContain('> '); // Marker for error line
    });

    it('should handle missing mark', () => {
      const mockError = {};
      const content = 'some content';

      const error = new YAMLSyntaxError(mockError, 'file.yaml', content);

      expect(error.lineNumber).toBe(0);
      expect(error.column).toBe(0);
    });
  });

  describe('PatternNotFoundError', () => {
    it('should list available patterns', () => {
      const error = new PatternNotFoundError('nonexistent', 'workflows', [
        'minimal',
        'agile-4',
        'standard-flow',
      ]);

      expect(error.name).toBe('PatternNotFoundError');
      expect(error.patternName).toBe('nonexistent');
      expect(error.patternType).toBe('workflows');
      expect(error.message).toContain('minimal');
      expect(error.message).toContain('agile-4');
      expect(error.message).toContain('standard-flow');
    });

    it('should suggest similar pattern names', () => {
      const error = new PatternNotFoundError('agile4', 'workflows', [
        'minimal',
        'agile-4',
        'standard-flow',
      ]);

      expect(error.message).toContain('Did you mean "agile-4"?');
    });

    it('should not suggest if no good match', () => {
      const error = new PatternNotFoundError('xyz', 'workflows', [
        'minimal',
        'agile-4',
      ]);

      expect(error.message).not.toContain('Did you mean');
    });
  });

  describe('CircularDependencyError', () => {
    it('should show dependency chain', () => {
      const chain = ['workflows/a', 'workflows/b', 'workflows/a'];
      const error = new CircularDependencyError(chain);

      expect(error.name).toBe('CircularDependencyError');
      expect(error.dependencyChain).toEqual(chain);
      expect(error.message).toContain(
        'workflows/a -> workflows/b -> workflows/a'
      );
    });
  });
});
