import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['employer', 'freelancer'],
    default: 'freelancer'
  },
  availableRoles: {
    type: [String],
    default: ['freelancer', 'employer'], // Everyone gets both roles by default
    enum: ['freelancer', 'employer']
  },
  currentRole: {
    type: String,
    enum: ['employer', 'freelancer'],
    default: 'freelancer'
  }
}, { 
  timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;