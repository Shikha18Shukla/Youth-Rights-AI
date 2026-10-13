/**
 * Temporary diagnostic script for MongoDB Atlas DNS resolution testing.
 * Tests Node.js DNS resolution for SRV and TXT records.
 * Does NOT print secrets or credentials.
 */

const dns = require('dns').promises;

const SRV_HOST = '_mongodb._tcp.cluster0.xu5olgv.mongodb.net';
const TXT_HOST = 'cluster0.xu5olgv.mongodb.net';

async function testDNS() {
  console.log('=== MongoDB Atlas DNS Diagnostic ===\n');

  // Test SRV resolution
  console.log(`Testing SRV: ${SRV_HOST}`);
  try {
    const srvRecords = await dns.resolveSrv(SRV_HOST);
    console.log('SRV SUCCESS:');
    srvRecords.forEach(r => {
      console.log(`  name=${r.name} port=${r.port} priority=${r.priority} weight=${r.weight}`);
    });
  } catch (err) {
    console.error(`SRV FAILED: ${err.code} - ${err.message}`);
  }

  console.log('');

  // Test TXT resolution
  console.log(`Testing TXT: ${TXT_HOST}`);
  try {
    const txtRecords = await dns.resolveTxt(TXT_HOST);
    console.log('TXT SUCCESS:');
    txtRecords.forEach(record => {
      // Only print the option string, never credentials
      const option = record[0];
      // Show only the parameter name (key=value) for diagnostic purposes
      const params = option.split('&').map(p => {
        const [key, val] = p.split('=');
        return val ? `${key}=<redacted>` : key;
      });
      console.log(`  ${params.join('&')}`);
    });
  } catch (err) {
    console.error(`TXT FAILED: ${err.code} - ${err.message}`);
  }

  console.log('');

  // Test direct resolution of the base hostname
  console.log(`Testing A record: ${TXT_HOST}`);
  try {
    const addresses = await dns.resolve4(TXT_HOST);
    console.log('A RECORD SUCCESS:');
    addresses.forEach(a => console.log(`  ${a}`));
  } catch (err) {
    console.error(`A RECORD FAILED: ${err.code} - ${err.message}`);
  }

  console.log('');

  // Test resolution of shard hosts obtained from SRV
  try {
    const srvRecords = await dns.resolveSrv(SRV_HOST);
    console.log('Testing shard host resolution:');
    for (const record of srvRecords) {
      try {
        const addresses = await dns.resolve4(record.name);
        console.log(`  ${record.name}: ${addresses.join(', ')}`);
      } catch (err) {
        console.error(`  ${record.name}: FAILED - ${err.code}`);
      }
    }
  } catch (err) {
    console.error(`Shard host test skipped: ${err.message}`);
  }

  console.log('\n=== Diagnostic Complete ===');
}

testDNS().catch(err => {
  console.error('Diagnostic script error:', err);
  process.exit(1);
});
