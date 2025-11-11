const { ConfigLoader } = require('../../src');

async function main() {
  const loader = new ConfigLoader();
  const config = await loader.load('./config.yaml');
  
  console.log('Loaded config:', JSON.stringify(config, null, 2));
}

main().catch(console.error);
