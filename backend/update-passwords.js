const bcrypt = require('bcryptjs');
const pool = require('./config/db.config');

async function updatePasswords() {
  try {
    console.log('Updating user passwords...');
    
    // 1. Get the correct table name
    const [tables] = await pool.query("SHOW TABLES");
    const userTableName = tables.map(t => Object.values(t)[0])
      .find(name => name.toLowerCase() === 'user');
    
    console.log('Found user table as:', userTableName);
    
    if (!userTableName) {
      console.error('User table not found!');
      return;
    }
    
    // 2. Get all users
    const [users] = await pool.query(`SELECT * FROM ${userTableName}`);
    console.log(`Found ${users.length} users`);
    
    // 3. Create new password hashes
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', salt);
    const managerHash = await bcrypt.hash('manager123', salt);
    const operatorHash = await bcrypt.hash('operator123', salt);
    
    // 4. Update passwords based on usernames
    for (const user of users) {
      let newHash;
      
      if (user.Username === 'admin') {
        newHash = adminHash;
        console.log('Updating admin password...');
      } else if (user.Username === 'manager') {
        newHash = managerHash;
        console.log('Updating manager password...');
      } else if (user.Username === 'operator') {
        newHash = operatorHash;
        console.log('Updating operator password...');
      } else {
        console.log(`Skipping user ${user.Username} (no default password)`);
        continue;
      }
      
      await pool.query(
        `UPDATE ${userTableName} SET Password = ? WHERE User_ID = ?`,
        [newHash, user.User_ID]
      );
      
      console.log(`Updated password for user ${user.Username}`);
    }
    
    console.log('Password update complete!');
    console.log('\nYou can now log in using these credentials:');
    console.log('- Username: admin, Password: admin123');
    console.log('- Username: manager, Password: manager123');
    console.log('- Username: operator, Password: operator123');
    
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    pool.end();
  }
}

updatePasswords(); 