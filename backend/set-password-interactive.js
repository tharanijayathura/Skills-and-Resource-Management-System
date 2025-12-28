import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 MySQL Password Setup\n');
console.log('This script will help you set your MySQL password in the .env file.\n');

// Read current .env
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
} else {
  console.log('❌ .env file not found!');
  process.exit(1);
}

// Check current password
const passwordMatch = envContent.match(/^DB_PASSWORD=(.*)$/m);
const currentPassword = passwordMatch ? passwordMatch[1] : '';

if (currentPassword && currentPassword.trim() !== '') {
  console.log('⚠️  DB_PASSWORD is already set in .env file.');
  rl.question('Do you want to change it? (y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('Cancelled.');
      rl.close();
      process.exit(0);
    }
    askForPassword();
  });
} else {
  askForPassword();
}

function askForPassword() {
  rl.question('Enter your MySQL root password (or press Enter if no password): ', (password) => {
    // Update the .env file
    const updatedContent = envContent.replace(/^DB_PASSWORD=.*$/m, `DB_PASSWORD=${password}`);
    fs.writeFileSync(envPath, updatedContent, 'utf8');
    
    console.log('\n✅ Password has been set in .env file!');
    if (!password) {
      console.log('⚠️  Warning: Empty password set. This might not work if MySQL requires a password.\n');
    } else {
      console.log('✅ Password saved (hidden for security).\n');
    }
    
    console.log('📝 Next step: Test the connection');
    console.log('   Run: node test-db-connection.js\n');
    
    rl.close();
    
    // Test connection immediately
    console.log('🧪 Testing connection now...\n');
    setTimeout(() => {
      import('./test-db-connection.js').catch(() => {
        console.log('💡 Run manually: node test-db-connection.js');
      });
    }, 500);
  });
}

