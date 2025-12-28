import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing Password Reading\n');

// Method 1: Read directly from file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const passwordMatch = envContent.match(/^DB_PASSWORD=(.*)$/m);
const passwordFromFile = passwordMatch ? passwordMatch[1] : '';

console.log('1. Reading from .env file directly:');
console.log(`   Password: "${passwordFromFile}"`);
console.log(`   Length: ${passwordFromFile.length}`);
console.log(`   Expected: "01112001aA#"`);
console.log(`   Match: ${passwordFromFile === '01112001aA#' ? '✅ YES' : '❌ NO'}\n`);

// Method 2: Using dotenv
dotenv.config();
const passwordFromDotenv = process.env.DB_PASSWORD || '';

console.log('2. Reading using dotenv:');
console.log(`   Password: "${passwordFromDotenv}"`);
console.log(`   Length: ${passwordFromDotenv.length}`);
console.log(`   Expected: "01112001aA#"`);
console.log(`   Match: ${passwordFromDotenv === '01112001aA#' ? '✅ YES' : '❌ NO'}\n`);

// Check for special characters
if (passwordFromFile.includes('#')) {
  console.log('✅ Password contains # character');
} else {
  console.log('❌ Password does NOT contain # character - this might be the issue!');
}

// Show character codes
console.log('\n3. Character analysis:');
console.log('   Expected password characters:');
'01112001aA#'.split('').forEach((char, i) => {
  console.log(`     [${i}] '${char}' = ${char.charCodeAt(0)}`);
});
console.log('\n   Actual password characters:');
passwordFromFile.split('').forEach((char, i) => {
  console.log(`     [${i}] '${char}' = ${char.charCodeAt(0)}`);
});

if (passwordFromFile !== '01112001aA#') {
  console.log('\n❌ PASSWORD MISMATCH!');
  console.log('The password in .env file does not match what you provided.');
  console.log('This could be due to:');
  console.log('1. File encoding issues');
  console.log('2. Special character handling');
  console.log('3. File not saved correctly');
} else {
  console.log('\n✅ Password matches! The issue is likely:');
  console.log('1. MySQL password is actually different');
  console.log('2. MySQL user permissions');
  console.log('3. MySQL service configuration');
}

