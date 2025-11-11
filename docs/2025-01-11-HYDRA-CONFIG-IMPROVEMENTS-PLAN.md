# Hydra Config - Improvements Plan

**Date**: 2025-01-11  
**Status**: Planning Phase  
**Package**: `@supernal/hydra-config@1.0.0`

---

## Issue 1: Badge Problems ❌→✅

### Current State

The README shows:

- ❌ NPM badge: "not found"
- ✅ CI badge: "passing"
- ❌ Coverage badge: "unknown"

### Root Causes

#### 1. NPM Badge - Encoding Issue

```markdown
[![npm version](https://badge.fury.io/js/%40supernal%2Fhydra-config.svg)]
```

- URL encoding `%40` (@ symbol) and `%2F` (/ symbol) is correct
- Badge.fury.io may need time to index new packages
- Alternative: Use shields.io which is more reliable

#### 2. Coverage Badge - Not Setup

- Coveralls.io account not configured
- No coverage reports being uploaded
- Need to add coverage workflow step

### Fixes

#### Fix 1: Update NPM Badge

Use shields.io instead of badge.fury.io:

```markdown
[![npm version](https://img.shields.io/npm/v/@supernal/hydra-config.svg)](https://www.npmjs.com/package/@supernal/hydra-config)
[![npm downloads](https://img.shields.io/npm/dm/@supernal/hydra-config.svg)](https://www.npmjs.com/package/@supernal/hydra-config)
```

#### Fix 2: Setup Coverage

Two options:

**Option A: Remove Coverage Badge** (Quick)

- Simply remove the badge until coverage is setup
- Most pragmatic for now

**Option B: Setup Coveralls** (Complete)

1. Sign up at https://coveralls.io
2. Add repository
3. Add to `.github/workflows/ci.yml`:

```yaml
- name: Upload coverage
  uses: coverallsapp/github-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

**Recommendation**: Option A for now, Option B in v1.1.0

---

## Issue 2: Feature Completeness Plan 🚀

### Goal

Make hydra-config as complete as Python's Hydra + OmegaConf

### Current State (v1.0.0)

✅ **Core Features**:

- Hierarchical configuration
- Pattern composition
- Deep merge strategies
- Search paths
- Rich error messages
- Zero dependencies (except yaml)

❌ **Missing vs Hydra/OmegaConf**:

- CLI integration
- Command-line overrides
- Variable interpolation
- Type validation
- Schema support
- Config groups
- Structured configs
- Multirun support

### Roadmap

#### v1.1.0 - CLI Integration (Target: 2 weeks)

**Features**:

- `--config-path` - Specify config directory
- `--config-name` - Specify config file
- `++key=value` - Override config values
- `+key=value` - Add new config values
- `~key` - Delete config values
- `--help` - Show config schema

**Implementation**:

```javascript
const { ConfigCLI } = require('@supernal/hydra-config');

const cli = new ConfigCLI({
  searchPaths: ['./config'],
  defaultConfig: 'project.yaml',
});

// Parse CLI args and merge with config
const config = await cli.load(process.argv);
```

**Example Usage**:

```bash
node app.js --config-name=dev.yaml ++database.host=localhost
```

#### v1.2.0 - Variable Interpolation (Target: 1 month)

**Features**:

- `${variable}` - Variable interpolation
- `${env:VAR}` - Environment variables
- `${file:path}` - File content interpolation
- Nested references

**Example**:

```yaml
database:
  host: ${env:DB_HOST}
  url: 'postgres://${database.host}:5432'
```

#### v1.3.0 - Type Validation & Schemas (Target: 6 weeks)

**Features**:

- JSON Schema validation
- Type coercion
- Required fields
- Default values

**Example**:

```javascript
const loader = new ConfigLoader({
  schema: './config.schema.json',
  validate: true,
});
```

#### v1.4.0 - Config Groups (Target: 2 months)

**Features**:

- Group-based composition
- Multiple config variants
- Environment-specific configs

**Example**:

```yaml
defaults:
  - db: postgres
  - cache: redis
  - _self_
# Select variants:
# db=[postgres|mysql|sqlite]
# cache=[redis|memcached|none]
```

#### v2.0.0 - Advanced Features (Target: 3 months)

**Features**:

- Structured configs (TypeScript/Zod integration)
- Multirun support
- Config inheritance
- Plugin system
- Watch mode (hot reload)

---

## Issue 3: Package Usage in Supernal Coding ✅

### Current State

**Good News**: We're NOT using the local config system yet in supernal-coding!

This means:

- ✅ No migration needed
- ✅ Clean slate for using the published package
- ✅ Can start with best practices from the start

### Search Results

```bash
grep -r "@supernal/hydra-config\|lib/config" supernal-code-package/
# Result: No matches (excluding node_modules)
```

### When We Need It

The config system was designed for supernal-coding but hasn't been integrated yet. Future use cases:

1. **Project Configuration** - `.supernal/project.yaml`
2. **Workflow Patterns** - Reusable workflow templates
3. **Phase Configuration** - Phase-specific settings
4. **User Overrides** - Local configuration

### Integration Plan (When Needed)

```bash
# 1. Install published package
npm install @supernal/hydra-config

# 2. Create wrapper (optional, for supernal-specific defaults)
# supernal-code-package/lib/config/index.js
const { ConfigLoader } = require('@supernal/hydra-config');

class SupernalConfig extends ConfigLoader {
  constructor(options = {}) {
    super({
      searchPaths: [
        process.cwd() + '/.supernal/patterns',
        __dirname + '/../patterns',
      ],
      ...options,
    });
  }
}

module.exports = { SupernalConfig };

# 3. Use in code
const { SupernalConfig } = require('./lib/config');
const config = await new SupernalConfig().load('.supernal/project.yaml');
```

**Status**: ✅ Ready to use when needed, no migration required

---

## Summary

### Immediate Actions (Today)

1. **Fix Badges** (5 minutes)
   - Update npm badge to shields.io
   - Remove coverage badge temporarily
   - Commit and push to hydra-config repo

2. **Create Feature Roadmap** (Done)
   - Document v1.1.0 - v2.0.0 plans
   - Add to GitHub issues/milestones

### Short Term (This Week)

3. **Start v1.1.0 Development**
   - Create feature branch
   - Implement CLI integration
   - Write tests and docs

### Medium Term (This Month)

4. **Variable Interpolation** (v1.2.0)
5. **Type Validation** (v1.3.0)

### Long Term (3 Months)

6. **Config Groups** (v1.4.0)
7. **Advanced Features** (v2.0.0)

---

## Badge Fix Implementation

### Updated README Badges Section

```markdown
[![npm version](https://img.shields.io/npm/v/@supernal/hydra-config.svg)](https://www.npmjs.com/package/@supernal/hydra-config)
[![npm downloads](https://img.shields.io/npm/dm/@supernal/hydra-config.svg)](https://www.npmjs.com/package/@supernal/hydra-config)
[![CI](https://github.com/supernalintelligence/hydra-config/workflows/CI/badge.svg)](https://github.com/supernalintelligence/hydra-config/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

**Changes**:

- ✅ NPM version badge → shields.io
- ✅ Added downloads badge
- ✅ Kept CI badge (working)
- ❌ Removed coverage badge (not setup yet)
- ✅ Added license badge

---

## CLI Integration Design (v1.1.0)

### API Design

```javascript
const { ConfigCLI, ConfigLoader } = require('@supernal/hydra-config');

// Option 1: CLI Helper
const cli = new ConfigCLI({
  loader: new ConfigLoader({
    searchPaths: ['./config'],
  }),
  defaults: {
    configPath: './config',
    configName: 'project.yaml',
  },
});

const config = await cli.loadFromArgs(process.argv);

// Option 2: Manual Parsing
const loader = new ConfigLoader();
const baseConfig = await loader.load('./config/project.yaml');
const overrides = ConfigCLI.parseArgs(process.argv);
const finalConfig = ConfigCLI.merge(baseConfig, overrides);
```

### CLI Syntax (Hydra-compatible)

```bash
# Basic usage
node app.js --config-name=dev.yaml

# Override values
node app.js ++database.host=localhost

# Add new values
node app.js +debug=true

# Delete values
node app.js ~cache

# Multiple overrides
node app.js ++db.host=localhost ++db.port=5432 +debug=true

# Help
node app.js --help
```

### Implementation Steps

1. **Parser** - Parse CLI arguments
2. **Merger** - Merge overrides with base config
3. **Validator** - Validate override syntax
4. **Help Generator** - Generate help from schema
5. **Tests** - Comprehensive CLI tests
6. **Documentation** - CLI usage guide

---

## Next Steps

Run this to fix the badges:

```bash
cd hydra-config
# Edit README.md badges section
git add README.md
git commit -m "fix: update badges to use shields.io

- Changed npm badge to shields.io (more reliable)
- Added downloads badge
- Removed coverage badge (not setup yet)
- Added license badge"
git push
```

Then create GitHub issues for:

- [ ] v1.1.0: CLI Integration
- [ ] v1.2.0: Variable Interpolation
- [ ] v1.3.0: Type Validation
- [ ] v1.4.0: Config Groups
- [ ] v2.0.0: Advanced Features

**Estimated Timeline**:

- Badge fix: 5 minutes ✅
- v1.1.0: 2 weeks
- v1.2.0: 1 month
- v1.3.0: 6 weeks
- v1.4.0: 2 months
- v2.0.0: 3 months

**Total to feature parity with Hydra**: ~3-4 months of development
