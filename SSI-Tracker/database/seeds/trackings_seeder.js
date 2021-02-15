const faker = require('faker');

const createFakeTransaction = () => ({
   amount: faker.finance.amount(),
   description: faker.random.words(25),
   issuer: faker.random.uuid(),
   beneficiary: faker.random.uuid(),
   ethereum_id: faker.random.uuid()
});

exports.seed = async function(knex, Promise) {
      //no
      // knex('trackings').del();

      // Inserts seed entries
      const fakeTransactions = [];

      for (let i=0; i < 5; i++) {
        fakeTransactions.push(createFakeTransaction());
      }
      await knex('trackings').insert(fakeTransactions);
};
