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
    codeEditor: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    snippets: {
        type: Array
    }
},
{
    usePushEach: true
});

// hash password before saving to db
// UserSchema.pre('save', function(next) 
// {
//     // var user = this;
//     bcrypt.hash(user.password, 10, function(err, hash)
//     {
//         if (err) 
//         {
//             return next(err);
//         }
//         user.password = hash;
//         next();
//     });
//     next();
// });

UserSchema.method('update', function(updates, callback)
{
    Object.assign(this, updates);
    this.save(callback);
});


UserSchema.method('addSnippet', function(snippet, callback)
{
    this.snippets.push(snippet);
    this.save(callback);
});

UserSchema.method('removeSnippet', function(snippet, callback)
{
    this.snippets.pull(snippet);
    this.save(callback);
});

function remove(array, element) {
    return array.filter(e => e !== element);
}

UserSchema.statics.authenticate = function(email, password, callback)
{
    User.findOne({email: email})
        .exec(function(error, user) {
            if (error) {
                return callback(error);
            } else if (!user) {
                console.log(`User not found!`);
                const error = new Error('User not found.');
                error.status = 401;
                return callback(error);
            } else {
                bcrypt.compare(password, user.password, function(error, result) {
                    if (result === true)
                    {
                        return callback(null, user);
                    } else {
                        console.log(`Password wrong! ${result}`);
                        
                        return callback();
                    }
                });
            }
        });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
