# Petfinder Promise API Client

Node module providing Promise based functionality to the PetFinder API.

_Inspired and based off of [Meng Fung's](https://github.com/mfung) [petfinder-js](https://www.npmjs.com/package/petfinder)_


## Installation

### NPM
```bash
npm install petfinder-promise --save
```

## Usage

Example

```js
// Import module
var petfinder = require('petfinder-promise')('API_KEY', 'API_SECRET');

// Get a list of cat breeds
petfinder.breed.list('cat').then(function (breeds) {
    console.log(breeds);
}).catch(function (err) {
    console.log('Error: ' + err.message);
});
```

## Methods
### breed.list(animal)
Returns a list of breeds for a particular animal.

---
### pet.get(pet_id)
Returns a record for a single pet.

### pet.getRandom(options)
Returns a record for a randomly selected pet. You can choose the characteristics of the pet you want returned using the optional `options` parameter.

### pet.find(location, options)
Searches for pets according to a location and optional criteria.

---
### shelter.find(loation, optional)
Returns a collection of shelter for a given location and optional criteria.

### shelter.get(shelter_id)
Returns a record for a single shelter.

### shelter.getPets(shelter_id, options)
Returns a collection of pets for an individual shelter.

### shelter.listByBreed(animal, breed, options)
Returns a list of shelter IDs listing animals of a particular breed.

## Contributing
Contributions and PRs are always welcomed. Please note that this module is a wrapper for [petfinder-js](https://github.com/mfung/petfinder-js) and that some bugs, features or functionalities are tied to the original library. Please keep this in mind when submitting bugs.

### Branch Strategy
The master branch will be the stable branch. Please submit your PRs against the development branch.

## Tests
1. Make sure to install dev-dependencies
2. Copy the `.env.sample` file to `.env` and make sure to add a [developer key and secret](https://www.petfinder.com/developers/api-docs#getting-started).
3. Run `npm test`