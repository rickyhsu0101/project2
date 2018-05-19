const Nightmare = require('nightmare');
const assert = require('assert');

describe('Testing Routes', function() {
  // Recommended: 5s locally, 10s to remote server, 30s from airplane ¯\_(ツ)_/¯
  this.timeout('30s');

  let nightmare = null;
  beforeEach(() => {
    nightmare = new Nightmare();
  });
  // Can we access the Home Page of the project
  describe('/ (Home Page)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080')
        .end()
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });

  // Can we access the login Page of the project
  describe('/ (Login Page)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/login')
        .end()
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });
  // Can we access the register Page of the project
  describe('/ (Register Page)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/register')
        .end()
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });
  //Can we access the profile page
  describe('/ (Profile Page)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/login')
        .insert('#username', 'seangnewman')
        .insert('#password', 'Il@v5MyM^st1ng')
        .click('#btnSignIn')
        .end()
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });

  //Validate that create group works
  //First login, then go to create groups
  describe('/ (NewGroup)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/login')
        .insert('#username', 'seangnewman')
        .insert('#password', 'Il@v5MyM^st1ng')
        .click('#btnSignIn')

        .wait(3000)
        .end()
        .click('#createGroup')
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });
  //Validate that create group works
  //First login, then go to create groups
  describe('/ (Group)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/login')
        .insert('#username', 'seangnewman')
        .insert('#password', 'Il@v5MyM^st1ng')
        .click('#btnSignIn')

        .wait(3000)
        .end()
        .click('#findGroups')
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });

  //Validate that join group works
  //First login, then go to create groups
  describe('/ (findGroup)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/login')
        .insert('#username', 'seangnewman')
        .insert('#password', 'Il@v5MyM^st1ng')
        .click('#btnSignIn')

        .wait(3000)
        .end()
        .click('#findGroups')
        .wait(3000)
        .evaluate(function() {
          let searchResults = [];

          const results = document.querySelectorAll('.card-title');
          results.forEach(function(result) {
            let row = {
              title: result.innerText
            };
            searchResults.push(row);
          });

          return searchResults;
        })
        .end()
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });
  //Validate that join group works
  //First login, then go to create groups
  describe('/ (findGroup -> editGroup)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/login')
        .insert('#username', 'seangnewman')
        .insert('#password', 'Il@v5MyM^st1ng')
        .click('#btnSignIn')

        .wait(3000)
        .end()
        .click('#findGroups')
        .wait(3000)
        .evaluate(function() {
          let searchResults = [];

          const results = document.querySelectorAll('.card-title');
          console.log(JSON.stringify(results));
          results.forEach(function(result) {
            let row = {
              title: result.innerText
            };
            searchResults.push(row);
          });

          return searchResults;
        })
        .end()
        .then(function(result) {
          console.log(result);
          done();
        })
        .catch(done);
    });
  });

  //Validate that join group works
  //First login, then go to create groups
  describe('/ (findGroup -> editGroupTest)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare
        .goto('http://localhost:8080/login')
        .insert('#username', 'seangnewman')
        .insert('#password', 'Il@v5MyM^st1ng')
        .click('#btnSignIn')

        .wait(3000)
        .end()
        .click('#findGroups')
        .wait(3000)
        .evaluate(function() {
          let searchResults2 = [];

          const results = document.querySelectorAll('.row a');
          results.forEach(function(result) {
            let row = {
              title: result.innerText
            };
            searchResults2.push(result);
          });

          return results;
        })
        .end()
        .then(function(result) {
          console.log(result);
        })
        .then(function(result) {
          done();
        })
        .catch(done);
    });
  });
});
