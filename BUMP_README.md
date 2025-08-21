# Version Bumping with bumpp

This project uses [bumpp](https://www.npmjs.com/package/bumpp) for automated version bumping across the monorepo.

## Usage

### Basic version bump
```bash
pnpm bump
```

This will:
- Interactively prompt you to select the version bump type (patch, minor, major, etc.)
- Update version numbers in all `packages/*/package.json` files
- Build the project
- Create a git commit with conventional commit message
- Create a git tag
- Push changes to remote

### Skip confirmation
```bash
pnpm bump --yes
```

### Bump to specific version
```bash
pnpm bump --yes --version 1.2.3
```

### Dry run (see what would happen)
```bash
pnpm bump --no-push --no-commit --no-tag
```

## Configuration

The bumpp configuration is in `bump.config.ts`:
- **Recursive**: Bumps all packages in the monorepo
- **Files**: Updates `packages/*/package.json`
- **Execute**: Runs `pnpm build` before committing
- **Commit/Tag/Push**: Enabled by default

## Integration with Changesets

This project also uses Changesets for release management. You can continue using either:

- `pnpm release` - Uses Changesets workflow
- `pnpm bump` - Uses bumpp for quick version bumps

bumpp is particularly useful for:
- Quick version bumps without changeset files
- Automated monorepo version management
- Conventional commit messages
- Immediate git operations