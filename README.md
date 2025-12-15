# namechecker

A simple CLI tool to check username/ID availability across multiple platforms.

## Features

- Check if a username is available on GitHub and npm org
- Fast concurrent checks across all platforms
- Color-coded output (green for available, red for taken)
- Direct links to creation pages when username is available
- Built with TypeScript and Node.js native fetch API

## Usage

### Basic Usage

Check a single username:
```bash
npx @lmk123/namechecker@latest <username>
```

Check multiple usernames at once:
```bash
npx @lmk123/namechecker@latest <username1> <username2> <username3>
```

Examples:
```bash
npx @lmk123/namechecker@latest myawesomeorg
npx @lmk123/namechecker@latest myorg testname coolproject
```

## Example Output

### Single Username

```
Checking availability for: myawesomeorg

✓ Available - GitHub: https://github.com/myawesomeorg → Create: https://github.com/account/organizations/new?plan=free
✗ Taken - npm org: https://www.npmjs.com/org/myawesomeorg
```

### Multiple Usernames

```
============================================================

Checking availability for: myorg

✓ Available - GitHub: https://github.com/myorg → Create: https://github.com/account/organizations/new?plan=free
✗ Taken - npm org: https://www.npmjs.com/org/myorg


============================================================

Checking availability for: testname

✗ Taken - GitHub: https://github.com/testname
✓ Available - npm org: https://www.npmjs.com/org/testname → Create: https://www.npmjs.com/org/create
```

## Supported Platforms

Currently supports checking availability on:
- **GitHub**: Checks if `github.com/<username>` exists
- **npm org**: Checks if `npmjs.com/org/<username>` exists

## Adding More Platforms

To add support for additional platforms, edit `src/index.ts` and add a new entry to the `platforms` array:

```typescript
{
  name: 'Platform Name',
  url: (id: string) => `https://platform.com/${id}`,
  createUrl: 'https://platform.com/create',
  checkAvailable: async (id: string) => {
    const url = `https://platform.com/${id}`;
    return checkUrl(url);
  },
}
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run locally
node dist/index.js <username>
```

## Requirements

- Node.js >= 18.0.0 (uses native fetch API)

## License

MIT
