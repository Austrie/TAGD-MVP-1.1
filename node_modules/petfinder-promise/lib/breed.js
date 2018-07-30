module.exports = function (petFinderCore, Promise, promisedCallback) {
    function getBreedList(animal) {
        return new Promise(function (resolve, reject) {
            petFinderCore.getBreedList(animal, promisedCallback(resolve, reject));
        })
    }

    return {
        list: getBreedList
    }
};
