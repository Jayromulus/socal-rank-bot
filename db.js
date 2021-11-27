const Sequelize = require('sequelize')

const db = new Sequelize(process.env.DATABASE_URL
  // uncomment below for deployment or using remote db
//   , {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   dialectOptions: {
//       ssl: {
//           require: true,
//           rejectUnauthorized: false
//       }
//   }
// }
);

module.exports = {
  Sequelize,
  db
}