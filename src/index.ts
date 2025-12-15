#!/usr/bin/env node

interface PlatformChecker {
  name: string;
  url: (id: string) => string;
  createUrl: string;
  checkAvailable: (id: string) => Promise<boolean>;
}

async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
    });

    // 404 means available, other status codes mean taken or error
    return response.status === 404;
  } catch (error) {
    console.error(`Error checking ${url}:`, error);
    return false;
  }
}

const platforms: PlatformChecker[] = [
  {
    name: 'GitHub',
    url: (id: string) => `https://github.com/${id}`,
    createUrl: 'https://github.com/account/organizations/new?plan=free',
    checkAvailable: async (id: string) => {
      const url = `https://github.com/${id}`;
      return checkUrl(url);
    },
  },
  {
    name: 'npm org',
    url: (id: string) => `https://www.npmjs.com/org/${id}`,
    createUrl: 'https://www.npmjs.com/org/create',
    checkAvailable: async (id: string) => {
      // npm blocks HEAD requests to org pages, so we use the registry search API
      // to check if any packages exist under this scope
      const searchUrl = `https://registry.npmjs.org/-/v1/search?text=@${id}/&size=1`;
      try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        // If total is 0, no packages exist under this scope, so it's available
        return data.total === 0;
      } catch (error) {
        console.error(`Error checking npm org ${id}:`, error);
        return false;
      }
    },
  },
];

async function checkName(id: string, isMultiple: boolean = false) {
  if (isMultiple) {
    console.log(`\n${'='.repeat(60)}`);
  }
  console.log(`\nChecking availability for: ${id}\n`);

  const results = await Promise.all(
    platforms.map(async (platform) => {
      const isAvailable = await platform.checkAvailable(id);
      return {
        platform: platform.name,
        url: platform.url(id),
        createUrl: platform.createUrl,
        available: isAvailable,
      };
    })
  );

  results.forEach((result) => {
    const status = result.available ? '✓ Available' : '✗ Taken';
    const color = result.available ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    const urlInfo = result.available
      ? `${result.url} → Create: ${result.createUrl}`
      : result.url;
    console.log(`${color}${status}${reset} - ${result.platform}: ${urlInfo}`);
  });

  console.log();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: namechecker <id> [id2] [id3] ...');
    console.log('Examples:');
    console.log('  namechecker abcd');
    console.log('  namechecker abcd myorg testname');
    process.exit(1);
  }

  const ids = args.filter((id) => id && id.trim().length > 0);

  if (ids.length === 0) {
    console.error('Error: Please provide at least one valid ID');
    process.exit(1);
  }

  const isMultiple = ids.length > 1;

  for (const id of ids) {
    await checkName(id, isMultiple);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
