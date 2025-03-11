// Fix birthdate columns using direct SQL
import { config } from 'dotenv';
import pg from 'pg';

// Load environment variables
config();

async function fixBirthdateColumns() {
  try {
    console.log('Connecting to database...');
    
    // Create a PostgreSQL client
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
    console.log('Connected to database. Running migration...');
    
    // SQL to fix the birthdate columns with proper casting
    const sql = `
    -- Fix the birthdate column in the user table
    ALTER TABLE "user" ALTER COLUMN "birthdate" TYPE date USING 
      CASE 
        WHEN "birthdate" IS NULL THEN NULL
        ELSE "birthdate"::date
      END;

    -- Fix the birthdate column in the access_request table
    ALTER TABLE "access_request" ALTER COLUMN "birthdate" TYPE date USING 
      CASE 
        WHEN "birthdate" IS NULL THEN NULL
        ELSE "birthdate"::date
      END;
    `;
    
    // Execute the SQL directly
    await client.query(sql);
    
    console.log('Migration completed successfully!');
    await client.end();
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

fixBirthdateColumns();
