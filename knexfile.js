require('dotenv').config();


// module.exports = {
//   client: 'mysql',
//   connection: {
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'Salam2020!',
//     database: 'stock-select',
//     charset: 'utf8',
//   },
// }
module.exports={
  client: "mysql2",
  connection: {
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSERNAME,
    password: process.env.DATABASEPASSWORD,
    database: process.env.DATABASENAME,
    charset: 'utf8',
  }
  
}


