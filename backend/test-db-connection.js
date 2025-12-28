import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing MySQL Database Connection...\n');
  
  // Display configuration (without password)
  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}`);
  console.log(`   User: ${process.env.DB_USER || 'root'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'skills_management'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(not set)'}\n`);

  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'skills_management',
    });

    console.log('✅ Successfully connected to MySQL!\n');

    // Test 1: Check MySQL version
    const [versionRows] = await connection.execute('SELECT VERSION() as version');
    console.log(`✅ MySQL Version: ${versionRows[0].version}`);

    // Test 2: Check current database
    const [dbRows] = await connection.execute('SELECT DATABASE() as db');
    console.log(`✅ Current Database: ${dbRows[0].db || 'None'}\n`);

    // Test 3: Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', ['skills_management']);
    if (databases.length > 0) {
      console.log('✅ Database "skills_management" exists\n');
    } else {
      console.log('❌ Database "skills_management" NOT found!\n');
      await connection.end();
      process.exit(1);
    }

    // Test 4: Check tables
    console.log('📊 Checking tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    const expectedTables = ['personnel', 'skills', 'personnel_skills', 'projects', 'project_required_skills'];
    const existingTables = tables.map(row => Object.values(row)[0]);

    expectedTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING!`);
      }
    });

    // Test 5: Check table structures
    console.log('\n📋 Table Structures:');
    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        const [columns] = await connection.execute(`DESCRIBE ${table}`);
        console.log(`\n   ${table}:`);
        columns.forEach(col => {
          console.log(`      - ${col.Field} (${col.Type})`);
        });
      }
    }

    // Test 6: Test a simple query
    console.log('\n🧪 Testing queries...');
    const [personnelCount] = await connection.execute('SELECT COUNT(*) as count FROM personnel');
    console.log(`   ✅ Personnel count: ${personnelCount[0].count}`);

    const [skillsCount] = await connection.execute('SELECT COUNT(*) as count FROM skills');
    console.log(`   ✅ Skills count: ${skillsCount[0].count}`);

    const [projectsCount] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    console.log(`   ✅ Projects count: ${projectsCount[0].count}`);

    console.log('\n✅ All database tests passed! Connection is working correctly.\n');
    
    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Database Connection Error:\n');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Message: ${error.message}\n`);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Solution: Check your DB_USER and DB_PASSWORD in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Solution: Database does not exist. Run database/schema.sql to create it.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Solution: MySQL server is not running or wrong host/port');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('💡 Solution: Connection timeout. Check if MySQL is running and accessible.');
    }

    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

testConnection();

