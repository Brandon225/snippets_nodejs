var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true // moves whitespace before and after
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// hash password before saving to db
UserSchema.pre('save', function(next) 
{
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash)
    {
        if (err) 
        {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.statics.authenticate = function(email, password, callback)
{
    User.findOne({email: email})
        .exec(function(error, user) {
            if (error) {
                return callback(error);
            } else if (!user) {
                const error = new Error('User not found.');
                error.status = 401;
                return callback(error);
            } else {
                bcrypt.compare(password, user.password, function(error, result) {
                    if (result === true)
                    {
                        return callback(null, user);
                    } else {
                        return callback();
                    }
                });
            }
        });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
