import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};


// W05 - Find a user by email for authentication
const findUserByEmail = async (email) => {
    // const query = `
    //     SELECT user_id, name, email, password_hash, role_id 
    //     FROM users 
    //     WHERE email = $1
    // `;
    // Changed to this query by W05 Team Activity
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1;
`;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

// W05 - Verify a plain password against the stored hash
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// W05 - Authenticate user
const authenticateUser = async (email, password) => {
    // Find the user by email
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    // Check if the password matches
    const passwordMatches = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        return null;
    }

    // Never return the password hash
    delete user.password_hash;

    return user;
};

export { 
    createUser,
    authenticateUser
 };