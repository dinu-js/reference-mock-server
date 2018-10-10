const assert = require('assert');
const datasources = require('../../lib/aspsp-resource-server/datasources/datasources');
const jwtUtil = require('../../lib/aspsp-authorisation-server/jwtlogin');

describe('UTC for /login and /accounts newly added functions', function() {

    it('UTC_001 - Testing getAccounts fn', function(done) {
        datasources.getAccounts((err,data)=>{
          assert.equal(data.length,4);
          done();
        })
    });
  
  it('UTC_002 - Testing getUser fn', function(done) {
        datasources.getUser({username:'dinesh'},(err,data)=>{
          assert.equal(data.username,'dinesh');
          done();
        })
    });
  
  it.only('UTC_003 - Testing jwtSign and verifyToken fn', function(done) {
    const payload = {user:"dinesh"}
    this.timeout(60000);
        jwtUtil.jwtSign(payload,(err,data)=>{
          
          done();
    });
  
  });
  
  
  });