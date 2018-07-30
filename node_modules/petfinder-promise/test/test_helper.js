require('dotenv').config({
    silent: true
});
var PetFinderPromise = require('../index');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.should = chai.should;
global.API_KEY = process.env.API_KEY || 'some_username';
global.API_SECRET = process.env.API_SECRET || 'some_password';
global.petfinder = PetFinderPromise(API_KEY, API_SECRET);
