import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },

    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true, // No two users can have same email
      lowercase: true, // Converts to lowercase before saving
      trim: true,
      match: [
        // Regex to validate email format
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },

    // Password (will be hashed before saving)
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password when querying users (for security)
    },

    // User role (customer or admin)
    role: {
      type: String,
      enum: ['customer', 'admin'], // Only these values allowed
      default: 'customer',
    },

    // Shopping cart items
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Reference to Product model
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    // List of favorite/wishlist products
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * 🔒 PASSWORD HASHING MIDDLEWARE
 * 
 * WHAT IS MIDDLEWARE?
 * - Code that runs BEFORE saving a document
 * - Like a security checkpoint
 * 
 * WHY HASH PASSWORDS?
 * - NEVER store plain text passwords in database
 * - If database is compromised, hackers can't read passwords
 * - Hashing is one-way: you can't reverse it to get original password
 * 
 * HOW IT WORKS:
 * 1. User enters password "mypassword123"
 * 2. bcrypt converts it to something like "$2a$10$vI8..."
 * 3. Store the hashed version in database
 * 4. When user logs in, hash their input and compare
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt (random string added to password)
    // 10 is the "cost factor" - higher = more secure but slower
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * 🔐 METHOD: COMPARE PASSWORD
 * 
 * Instance method to verify if entered password is correct
 * Used during login
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  // bcrypt.compare automatically hashes enteredPassword and compares
  // Returns true if match, false if not
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * 🎫 METHOD: GENERATE JWT TOKEN
 * 
 * WHAT IS JWT (JSON Web Token)?
 * - A secure way to identify users
 * - Like a digital ID card
 * - Contains user info and is cryptographically signed
 * 
 * HOW IT WORKS:
 * 1. User logs in successfully
 * 2. Server creates a JWT with user's ID
 * 3. Sends JWT to frontend
 * 4. Frontend includes JWT in every request
 * 5. Server verifies JWT to identify user
 * 
 * JWT STRUCTURE: header.payload.signature
 * - Header: algorithm info
 * - Payload: user data (id, role, etc.)
 * - Signature: proves token hasn't been tampered with
 */
userSchema.methods.generateAuthToken = function () {
  // Create token with user ID as payload
  return jwt.sign(
    { id: this._id, role: this.role }, // Payload: data to encode
    process.env.JWT_SECRET, // Secret key (only server knows this)
    { expiresIn: process.env.JWT_EXPIRE } // Token expires after 7 days
  );
};

/**
 * Create and export the User model
 * 
 * mongoose.model() creates a model from schema
 * 1st param: Model name (singular, capitalized)
 * 2nd param: Schema to use
 * 
 * This model provides methods like:
 * - User.find() - find all users
 * - User.findById() - find by ID
 * - User.create() - create new user
 * - User.findByIdAndUpdate() - update user
 * - User.findByIdAndDelete() - delete user
 */
const User = mongoose.model('User', userSchema);

export default User;

/**
 * 🎓 LEARNING SUMMARY:
 * 
 * 1. SCHEMA defines structure of documents
 * 2. MODELS are constructors compiled from schemas
 * 3. MIDDLEWARE runs before/after certain operations
 * 4. PASSWORD HASHING protects user credentials
 * 5. JWT TOKENS authenticate users securely
 * 6. METHODS are functions attached to documents
 * 
 * REAL-WORLD ANALOGY:
 * - Schema = Blueprint of a house
 * - Model = House building company
 * - Document = Actual house built from blueprint
 * - Middleware = Quality inspections during construction
 * - Methods = Features of the house (locks, lights, etc.)
 */
