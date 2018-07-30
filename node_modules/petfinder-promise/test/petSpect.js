var pet = petfinder.pet;
var location = '90210';
var randPetId;
describe('Pet', function () {
    describe('.find', function () {
        it('should be a promise', function () {
            expect(pet.find(location)).to.be.fulfilled;
            expect(pet.find()).to.be.rejected;
        });

        it('should return an array of animals with length of 25 when given a location ', function (done) {
            pet.find(location).then(function (pets) {
                expect(pets).to.be.instanceof(Array);
                expect(pets.length).to.be.equal(25);
                done();
            });
        });

        it('should return 10 pets when given a location and option of count 10', function (done) {
            pet.find(location, {'count': 10}).then(function (pets) {
                expect(pets.length).to.be.equal(10);
                done();
            });
        });

        it('should give an error if no location is given', function (done) {
            pet.find().catch(function (err) {
                expect(err).to
                    .exist
                    .and.be.instanceof(Error)
                    .and.have.property('message', 'Must supply location.');
                done();
            });
        });
    });

    describe('.getRandom', function () {
        it('should be a promise', function () {
            expect(pet.getRandom()).to.be.fulfilled;
        });

        it('should return a random pet', function (done) {
            pet.getRandom().then(function (pet) {
                expect(pet).to
                    .exist
                    .and.have.property('id');
                // get pet id here to test `pet.get()`
                randPetId = pet.id;
                done();
            });
        });
    });

    describe('.get', function () {
        it('should be a promise', function () {
            expect(pet.get(randPetId)).to.be.fulfilled;
            expect(pet.get()).to.be.rejected;
        });

        it('should return a pet object when given a pet id', function (done) {
            pet.get(randPetId).then(function (pet) {
                expect(pet).to
                    .exist
                    .and.have.property('id', randPetId);
                done();
            });
        });

        it('should get an error when given no pet id', function (done) {
            pet.get().catch(function (err) {
                expect(err).to
                    .exist
                    .and.be.instanceof(Error)
                    .and.have.property('message', 'Must supply pet id.');
                done();
            });
        });
    });
});
