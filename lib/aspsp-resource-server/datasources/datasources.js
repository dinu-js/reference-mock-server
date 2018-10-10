'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://test-db:test-db-pass@cluster0-hy5l4.mongodb.net/BankDb?retryWrites=true');

/*Schema for storing username and password*/
const userSchema = new Schema({
    username: String,
    password: String
});


/*Schema for storing Account Info*/
const accountSchema = new Schema({
    AccountId: String,
    Currency: String,
    Account: {
        SchemeName: String,
        Identification: String,
        Name: String,
        SecondaryIdentification: String
    }
});

const userDetails = mongoose.model('userdetails', userSchema);
const Accounts = mongoose.model('Accounts', accountSchema);

/**
 * function to getAccounts from mongodb
 *
 * @param {Function} cb
 * @return callback
 * 
 */
const getAccounts = (cb) => {

    Accounts.find({}, {
        _id: 0,
        __v: 0
    }, function(err, acc) {
        if (err) cb(err);

        cb(null, acc);
    });
}

/**
 * function to get user for authorisation from mongodb
 *
 * @param {Object} data
 * @param {Function} cb
 * @return callback
 * 
 */
const getUser = (data, cb) => {
    userDetails.findOne({
        username: data.username
    }, function(err, user) {
        if (err) {
            return cb(err, null);
        } else {
            cb(null, user);
        }
    });
}

exports.getAccounts = getAccounts;
exports.getUser = getUser;