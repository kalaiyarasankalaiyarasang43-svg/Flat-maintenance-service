const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function importDatabase() {
  console.log('Connecting to Aiven database...');
  const connectionConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true // Crucial for running a whole .sql file
  };

  if (process.env.DB_SSL === 'true' || (!process.env.DB_SSL && process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')) {
    connectionConfig.ssl = { rejectUnauthorized: false };
  }

  const connection = await mysql.createConnection(connectionConfig);

  console.log('Connected successfully!');
  
  const sqlPath = path.join(__dirname, '../database.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log('Importing tables and data...');
  await connection.query(sqlContent);
  
  console.log('Import completed successfully! 🎉');
  await connection.end();
}

importDatabase().catch(err => {
  console.error('Error importing database:', err);
  process.exit(1);
});
