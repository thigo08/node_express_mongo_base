const bcrypt = require('bcryptjs');

const mongooses = require('../../database');

const UserSchema = new mongooses.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function (next) {
    console.log('Senha: ', this.password);
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongooses.model('User', UserSchema);

module.exports = User;