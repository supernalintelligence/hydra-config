# Hydra Config

Hydra-style hierarchical YAML configuration with composition, patterns, and deep merge for JavaScript.

[![npm version](https://badge.fury.io/js/%40supernal%2Fhydra-config.svg)](https://www.npmjs.com/package/%40supernal%2Fhydra-config)
[![CI](https://github.com/supernalintelligence/hydra-config/workflows/CI/badge.svg)](https://github.com/supernalintelligence/hydra-config/actions)
[![Coverage Status](https://coveralls.io/repos/github/supernalintelligence/hydra-config/badge.svg)](https://coveralls.io/github/supernalintelligence/hydra-config)

## Why Hydra Config?

Inspired by Facebook's [Hydra](https://hydra.cc/) for Python, this library brings powerful configuration composition to JavaScript projects.

### Features

- **🔄 Composable**: Build configs from reusable patterns
- **📊 Hierarchical**: Define defaults, override as needed
- **🔍 Type-Safe**: Optional schema validation
- **🎯 Framework-Agnostic**: Works with any JS project
- **🪶 Lightweight**: Only requires `yaml` and `fs-extra`
- **💪 Battle-Tested**: Used in production by Supernal Coding

## Installation

```bash
npm install @supernal/hydra-config
```

## Quick Start

```javascript
const { ConfigLoader } = require('@supernal/hydra-config');

const loader = new ConfigLoader({
  searchPaths: [
    './config/patterns',  // Your patterns
    './node_modules/@supernal/hydra-config/patterns',  // Default patterns
  ],
});

const config = await loader.load('./config/project.yaml');
console.log(config);
```

## Usage

### Basic Configuration

```yaml
# config/project.yaml
project:
  name: 'my-app'
  version: '1.0.0'

database:
  host: 'localhost'
  port: 5432
```

### Composition with Defaults

```yaml
# config/project.yaml
defaults:
  - base: production
  - database: postgres
  - cache: redis
  - _self_  # Apply user overrides last

project:
  name: 'my-app'  # Override from patterns

database:
  host: 'custom-host'  # Override specific values
```

### Pattern Files

```yaml
# config/patterns/database/postgres.yaml
database:
  type: 'postgres'
  host: 'localhost'
  port: 5432
  ssl: true
  pool:
    min: 2
    max: 10
```

## API Reference

### ConfigLoader

Main class for loading and resolving configurations.

```javascript
const loader = new ConfigLoader(options);
```

**Options:**
- `searchPaths` (Array<string>): Directories to search for patterns
- `cache` (Map): Optional cache instance

**Methods:**

#### `load(configPath)`

Load and resolve a configuration file.

```javascript
const config = await loader.load('./config/project.yaml');
```

#### `get(configPath)`

Get configuration (uses cache if available).

```javascript
const config = await loader.get('./config/project.yaml');
```

#### `clearCache()`

Clear the configuration cache.

```javascript
loader.clearCache();
```

### Error Classes

- `YAMLSyntaxError`: Invalid YAML syntax
- `PatternNotFoundError`: Referenced pattern not found
- `CircularDependencyError`: Circular dependency in defaults

## Advanced Features

### Deep Merge Strategies

```yaml
# Append arrays (default)
features: [auth, admin]

# Replace arrays
features:
  __replace__: true
  values: [public-only]
```

### Pattern Search Paths

Patterns are searched in order:
1. User patterns (first in searchPaths)
2. Shipped patterns (later in searchPaths)

This allows users to override default patterns.

### Circular Dependency Detection

The system automatically detects and reports circular dependencies:

```
CircularDependencyError: Circular dependency detected
  base → db-config → advanced → base
```

## Examples

See the [examples/](examples/) directory for complete working examples:

- [Basic Usage](examples/basic/)
- [Composition](examples/composition/)
- [Pattern Library](examples/patterns/)

## Comparison to Other Solutions

| Feature        | Hydra Config | config | convict | rc |
| -------------- | ------------ | ------ | ------- | -- |
| YAML Patterns  | ✅           | ❌     | ❌      | ❌ |
| Composition    | ✅           | ❌     | ❌      | ❌ |
| Deep Merge     | ✅           | ⚠️     | ❌      | ⚠️ |
| Search Paths   | ✅           | ❌     | ❌      | ⚠️ |
| Error Messages | ✅ Rich      | Basic  | Basic   | Basic |

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT - See [LICENSE](LICENSE) for details.

## Credits

Inspired by [Hydra](https://hydra.cc/) by Facebook Research.

Built and maintained by [Supernal Intelligence](https://www.supernal.ai).
