import dynamoose from 'dynamoose';

// Set these defaults to keep dynamoose from describing table on every request
dynamoose.setDefaults({
  create: false,
  waitForActive: false,
});

export default dynamoose;
