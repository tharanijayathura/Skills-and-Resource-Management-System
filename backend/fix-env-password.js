import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

console.log('🔧 Fixing .env file password issue...\n');

// Read current .env
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  // Remove BOM if present
  envContent = envContent.replace(/^\uFEFF/, '');
} else {
  console.log('❌ .env file not found!');
  process.exit(1);
}

// Get password from command line
const password = process.argv[2];

if (!password) {
  console.log('❌ ERROR: MySQL password is required!\n');
  console.log('Usage: node fix-env-password.js YOUR_MYSQL_PASSWORD\n');
  console.log('Example:');
  console.log('  node fix-env-password.js MyPassword123\n');
  console.log('Or if your MySQL has no password (not recommended):');
  console.log('  node fix-env-password.js ""\n');
  process.exit(1);
}

// Update DB_PASSWORD line
const updatedContent = envContent.replace(/^DB_PASSWORD=.*$/m, `DB_PASSWORD=${password}`);

// Write back to file
fs.writeFileSync(envPath, updatedContent, 'utf8');

console.log('✅ .env file updated successfully!');
console.log(`✅ DB_PASSWORD has been set${password ? ' (password is hidden)' : ' to empty string'}\n`);

// Verify
const verifyContent = fs.readFileSync(envPath, 'utf8');
const passwordMatch = verifyContent.match(/^DB_PASSWORD=(.*)$/m);
if (passwordMatch) {
  const setPassword = passwordMatch[1];
  if (setPassword === password) {
    console.log('✅ Verification: Password is correctly set in .env file\n');
  } else {
    console.log('⚠️  Warning: Password might not be set correctly\n');
  }
}

console.log('📝 Next steps:');
console.log('1. Test the connection: node test-db-connection.js');
console.log('2. If successful, start your backend: npm run dev\n');

