import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import createPool from '../configs/database.config'; // Adjust the import path as necessary

// Define the interface for User properties
interface UserProps {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath?: string;
  friends?: string[];
  location?: string;
  occupation?: string;
  viewedProfile?: number;
  impressions?: number;
}

// Define the interface for User row from the database
interface UserRow extends UserProps {
  id: number;
  created_at: Date;
  updated_at: Date;
}

// Create a pool instance
const pool: Pool = createPool();

class User {
  public id?: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public picturePath: string;
  public friends: string[];
  public location?: string;
  public occupation?: string;
  public viewedProfile: number;
  public impressions: number;

  constructor({
    id,
    firstName,
    lastName,
    email,
    password,
    picturePath = "",
    friends = [],
    location = "",
    occupation = "",
    viewedProfile = 0,
    impressions = 0,
  }: UserProps) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.picturePath = picturePath;
    this.friends = friends;
    this.location = location;
    this.occupation = occupation;
    this.viewedProfile = viewedProfile;
    this.impressions = impressions;
  }

  

  // Save a new user to the database
  async save(): Promise<UserRow> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    try {
      const result = await pool.query<UserRow>(
        `INSERT INTO userss (
          first_name, last_name, email, password, picture_path, friends, location, occupation, viewed_profile, impressions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          this.firstName,
          this.lastName,
          this.email,
          hashedPassword,
          this.picturePath,
          JSON.stringify(this.friends),
          this.location,
          this.occupation,
          this.viewedProfile,
          this.impressions,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error('Error saving user');
    }
  }

  // Static method to find a user by email
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query<UserRow>(
        'SELECT * FROM userss WHERE email = $1',
        [email]
      );
      if (result.rows.length > 0) {
        console.log(result.rows[0]);
        return new User(result.rows[0]);
      }
      return null;
    } catch (error) {
      console.error(error);
      throw new Error('Error finding user');
    }
  }

  static async findById(id: number): Promise<User | null> {
    try {
      const result = await pool.query<UserRow>(
        'SELECT * FROM userss WHERE id = $1',
        [id]
      );
      if (result.rows.length > 0) {
        return new User(result.rows[0]);
      }
      return null;
    } catch (error) {
      console.error(error);
      throw new Error('Error finding user by ID');
    }
  }

  // Method to compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      console.log(candidatePassword);
      console.log( this.password);
      return isMatch;
    } catch (error) {
      console.error(error);
      throw new Error('Error comparing password');
    }
  }

  async createUsersTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS userss (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        picture_path VARCHAR(255),
        friends TEXT,
        location VARCHAR(255),
        occupation VARCHAR(255),
        viewed_profile INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    try {
      await pool.query(query);
      console.log('Users table created');
    } catch (error) {
      console.error('Error creating users table', error);
    } finally {
      await pool.end();
    }
  }
}

export default User;
