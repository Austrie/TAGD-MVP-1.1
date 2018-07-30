module.exports = function (petFinderCore, Promise, promisedCallback) {
    function findShelter(location, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            petFinderCore.findShelter(location, options, promisedCallback(resolve, reject));
        })
    }

    function getShelter(shelterId, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            petFinderCore.getShelter(shelterId, options, promisedCallback(resolve, reject));
        })
    }

    function getPetsInShelter(shelterId, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            petFinderCore.getPetsInShelter(shelterId, options, promisedCallback(resolve, reject));
        })
    }

    function getSheltersWithBreeds(animal, breed, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            petFinderCore.getSheltersWithBreeds(animal, breed, options, promisedCallback(resolve, reject));
        })
    }

    return {
        find: findShelter,
        get: getShelter,
        getPets: getPetsInShelter,
        listByBreed: getSheltersWithBreeds
    }
};
