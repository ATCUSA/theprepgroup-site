// Script to run the SQL migration for fixing the birthdate columns
import { db } from './src/lib/server/db/index.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('Running migration to fix birthdate columns...');
    
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
    await db.execute(sql);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();
