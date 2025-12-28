import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const password = process.env.DB_PASSWORD;

console.log('🧪 Testing MySQL Connection Directly\n');
console.log(`Password from .env: ${password ? '*** (set)' : '(not set)'}`);
console.log(`Password length: ${password ? password.length : 0} characters\n`);

// Try to connect
try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: password,
    database: process.env.DB_NAME || 'skills_management',
  });

  console.log('✅ SUCCESS! Connected to MySQL!');
  const [rows] = await connection.execute('SELECT VERSION() as version');
  console.log(`MySQL Version: ${rows[0].version}`);
  await connection.end();
  process.exit(0);
} catch (error) {
  console.log('❌ Connection Failed\n');
  console.log(`Error Code: ${error.code}`);
  console.log(`Error Message: ${error.message}\n`);
  
  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('💡 This means:');
    console.log('   - The password is being sent to MySQL');
    console.log('   - But MySQL is rejecting it');
    console.log('   - Either the password is wrong, or');
    console.log('   - The user "root" doesn\'t have permission\n');
    console.log('🔧 Solutions:');
    console.log('1. Verify the password is correct');
    console.log('2. Try connecting with MySQL Workbench using the same password');
    console.log('3. Check if MySQL service is running');
    console.log('4. Try resetting MySQL root password if needed\n');
  } else if (error.code === 'ECONNREFUSED') {
    console.log('💡 MySQL server is not running or not accessible');
    console.log('   Start MySQL service and try again\n');
  }
  
  process.exit(1);
}

