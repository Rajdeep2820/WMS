const bcrypt = require('bcryptjs');
const pool = require('./config/db.config');

async function testLogin() {
  try {
    // Test credentials
    const username = 'admin';
    const password = 'admin123';
    
    console.log('Testing login for:', { username, password });
    
    // 1. Check if user table is properly named (MySQL is case-sensitive in table names on some systems)
    const [tables] = await pool.query("SHOW TABLES");
    console.log('Available tables:', tables.map(t => Object.values(t)[0]));
    
    // Find the proper case for 'User' table
    const userTableName = tables.map(t => Object.values(t)[0])
      .find(name => name.toLowerCase() === 'user');
    
    console.log('Found user table as:', userTableName);
    
    if (!userTableName) {
      console.error('User table not found!');
      return;
    }
    
    // 2. Find users using the correct table name
    const [users] = await pool.query(
      `SELECT * FROM ${userTableName} WHERE Username = ?`,
      [username]
    );
    
    console.log('User search results:', { found: users.length > 0 });
    
    if (users.length === 0) {
      console.log('User not found');
      // Create test user if not exists
      console.log('Creating test admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await pool.query(
        `INSERT INTO ${userTableName} (Username, Password, Email, Full_Name, Role) VALUES (?, ?, ?, ?, ?)`,
        [username, hashedPassword, 'admin@weaponry.com', 'Admin User', 'Admin']
      );
      
      console.log('Test user created with username: admin, password: admin123');
      return;
    }
    
    const user = users[0];
    console.log('User found:', {
      id: user.User_ID || user.user_id, 
      username: user.Username || user.username,
      role: user.Role || user.role,
      password: user.Password?.substring(0, 20) + '...' || user.password?.substring(0, 20) + '...'
    });
    
    // 3. Test password comparison
    const isPasswordValid = await bcrypt.compare(password, user.Password || user.password);
    console.log('Password validation result:', { isValid: isPasswordValid });
    
    if (isPasswordValid) {
      console.log('Login would be successful!');
    } else {
      console.log('Incorrect password. Creating new hash for reference:');
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, salt);
      console.log('New hash for password:', newHash);
    }
    
  } catch (error) {
    console.error('Test login error:', error);
  } finally {
    pool.end();
  }
}

testLogin(); 