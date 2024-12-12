import { Model, DataTypes } from "sequelize"
import { Sequelize } from "sequelize"
import sequelize from "../config/database"
import { allowedNodeEnvironmentFlags } from "process";
import { AllowNull } from "sequelize-typescript";

interface UserAttributes {
    id?: number;
    email?: string,
    password_hash: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password_hash!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },

    {
        sequelize,
        tableName: "users"
    }
)

export default User;