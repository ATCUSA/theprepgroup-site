import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';

// Function to check users in the database
async function checkUsers() {
  try {
    const users = await db.select().from(userTable);
    console.log('Users in database:', users);
    return users;
  } catch (error) {
    console.error('Error checking users:', error);
    return [];
  }
}

// Export the function for use in the page server
export { checkUsers };
