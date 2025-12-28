import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

// Read current .env file
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  // Create default .env content
  envContent = `DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=skills_management
PORT=5000
CORS_ORIGIN=http://localhost:5173
`;
}

// Check if password is set
const passwordMatch = envContent.match(/^DB_PASSWORD=(.*)$/m);
const currentPassword = passwordMatch ? passwordMatch[1] : '';

if (!currentPassword || currentPassword.trim() === '') {
  console.log('⚠️  DB_PASSWORD is not set in .env file!\n');
  console.log('To fix this:');
  console.log('1. Open backend/.env file');
  console.log('2. Find the line: DB_PASSWORD=');
  console.log('3. Add your MySQL root password after the = sign');
  console.log('   Example: DB_PASSWORD=MyPassword123\n');
  console.log('Current .env file location:');
  console.log(envPath);
  console.log('\nCurrent .env contents:');
  console.log('---');
  console.log(envContent);
  console.log('---\n');
  
  // Try to get password from command line argument
  const passwordFromArgs = process.argv[2];
  if (passwordFromArgs) {
    console.log('Setting password from command line argument...');
    const updatedContent = envContent.replace(/^DB_PASSWORD=.*$/m, `DB_PASSWORD=${passwordFromArgs}`);
    fs.writeFileSync(envPath, updatedContent, 'utf8');
    console.log('✅ Password set successfully!');
    console.log('⚠️  Note: Password is now stored in .env file');
  } else {
    console.log('\n💡 Tip: You can also set the password by running:');
    console.log('   node setup-env.js YOUR_PASSWORD_HERE');
    process.exit(1);
  }
} else {
  console.log('✅ DB_PASSWORD is set in .env file');
  console.log('   (Password is hidden for security)');
}

