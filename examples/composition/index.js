const { ConfigLoader } = require('../../src');
const path = require('path');

async function main() {
  const loader = new ConfigLoader({
    searchPaths: [path.join(__dirname, 'patterns')],
  });

  const config = await loader.load('./config.yaml');

  console.log('Composed config:', JSON.stringify(config, null, 2));
}

main().catch(console.error);
