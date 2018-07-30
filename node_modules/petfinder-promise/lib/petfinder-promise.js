var PetFinderCore = require('petfinder');
var Promise = require('bluebird');

module.exports = function (key, secret) {
    var petFinderCore = PetFinderCore(key, secret);

    function promisedCallback(resolve, reject) {
        return function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        }
    }

    return {
        breed: require('./breed')(petFinderCore, Promise, promisedCallback),
        shelter: require('./shelter')(petFinderCore, Promise, promisedCallback),
        pet: require('./pet')(petFinderCore, Promise, promisedCallback),
    };
};
