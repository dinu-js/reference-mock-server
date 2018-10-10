'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { getUser } = require('../aspsp-resource-server/datasources/datasources');
const privateFilePath = path.join(__dirname, './keys/', 'private.key');
const publicFilePath = path.join(__dirname, './keys/', 'public.key');

const privateKEY = fs.readFileSync(privateFilePath, 'utf8');
const publicKEY = fs.readFileSync(publicFilePath, 'utf8');

const signOptions = {
    issuer: "Dinesh Rawat",
    expiresIn: "1h",
    algorithm: "RS256"
};

/**
 * function to sign jwt token
 *
 * @param {Object} payload
 * @return cb
 * 
 */
const jwtSign = (payload,cb) => {
  jwt.sign(payload, privateKEY, signOptions, function(err, token) {
   if(err){
     cb(err,null);
   }else{
     cb(null,token)
   }
  });
}

/**
 * function to get jwt token by authenticating using credentials
 *
 * @param {Object} req
 * @param {Object} res
 * @return res
 * 
 */
const jwtLogin = (req, res) => {
    if (req.query.username && req.query.password) {
        const username = req.query.username;
        const password = req.query.password;
        const userdata = {
            username: username,
            password: password
        }
        const payload = {
            user: username
        };
        getUser(userdata, (err, data) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if (data && password === data.password) {
                  jwtSign(payload,function(err, token) {
                    if(!err){
                       res.status(200).send({
                            "Response": token
                        });
                    }else{
                      res.status(400).send(err);
                    }  
                    });
                } else {
                    res.status(400).send({
                        "Error": "Wrong Credentials"
                    });
                }
            }
        });
    } else {
        res.status(400).send({
            "Error": "username and password are required"
        });
    }
};

/**
 * function to verify a jwt token
 *
 * @param {Object} token
 * @return cb
 * 
 */
const jwtVerify = (token, cb) => {
    if (token) {
        if (token.indexOf('Bearer ') > -1) {
            const jwtToken = token.replace('Bearer ', '');
            jwt.verify(jwtToken, publicKEY, signOptions, function(err, decoded) {
                if (err) {
                    cb({
                        "Error": err.message
                    }, null);
                } else {
                    cb(null, decoded);
                }
            });
        } else {
            cb({
                "Error": "Invalid Token - Unauthorized"
            }, null);
        }
    } else {
        cb({
            "Error": "Token not present - Unauthorized"
        }, null);
    }
}

exports.jwtLogin = jwtLogin;
exports.jwtVerify = jwtVerify;
exports.jwtSign = jwtSign;