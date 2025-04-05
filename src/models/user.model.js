import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
first_name: { type: String, required: true },
last_name:  { type: String, required: true },
email:      { type: String, required: true, unique: true },
age:        { type: Number, required: true },
password:   { type: String, required: true },
cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', default: null },
role:       { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.pre('save', function(next) {
if (!this.isModified('password')) return next();
this.password = bcrypt.hashSync(this.password, 10);
next();
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;