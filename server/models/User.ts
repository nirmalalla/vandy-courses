import { Model, DataTypes } from "sequelize"
import { Sequelize } from "sequelize"
import sequelize from "../config/database"
import { allowedNodeEnvironmentFlags } from "process";
import { AllowNull } from "sequelize-typescript";

interface UserAttributes {
    id?: number;
    email?: string,
    password_hash: string,
    verification_code: string,
    is_verified: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password_hash!: string;
    public verification_code: string;
    public is_verified: boolean;

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
        },
        verification_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },

    {
        sequelize,
        tableName: "users"
    }
)

export default User;