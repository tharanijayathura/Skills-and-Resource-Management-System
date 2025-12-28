import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  try {
    console.log('🔍 Testing MySQL Connection...\n');
    console.log(`Password length: ${process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0} chars`);
    console.log(`Password ends with #: ${process.env.DB_PASSWORD?.endsWith('#') ? '✅ YES' : '❌ NO'}\n`);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'skills_management',
    });

    console.log('✅ SUCCESS! Connected to MySQL!\n');
    
    // Test a simple query
    const [version] = await connection.execute('SELECT VERSION() as version');
    console.log(`MySQL Version: ${version[0].version}`);
    
    // Test database
    const [db] = await connection.execute('SELECT DATABASE() as db');
    console.log(`Current Database: ${db[0].db}\n`);
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables in database\n`);
    
    await connection.end();
    console.log('✅ All tests passed! Connection is working correctly!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();

