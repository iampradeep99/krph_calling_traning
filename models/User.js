const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,  
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country', 
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City', 
    required: true,
  },
  privilegeType: {
    type: Number,
    required: true,
    enum: [0,1,2,3],
    /* 
    0 = Super Admin,
    1 = Admin,
    2 = Agent,
    3 = Trainer,
    */
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  insertDateTime: {
    type: Date,
    default: Date.now,
  },
  updateDateTime: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function(next) {
  const user = this;

  // Only hash the password if it is new or modified
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Compare input password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
