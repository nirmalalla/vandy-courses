import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    logging: console.log,
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    }
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connection established");
    } catch (error) {
        console.log(process.env.DB_NAME)
        console.log(process.env.DB_USERNAME)
        console.log(process.env.DB_PASSWORD)
        console.log(process.env.DB_HOST)
        console.log(process.env.DB_PORT)
        console.error("unable to connect", error);
    }
}

testConnection();

export default sequelize;