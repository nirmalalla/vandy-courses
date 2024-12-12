import { Model, DataTypes } from "sequelize"
import { Sequelize } from "sequelize"
import sequelize from "../config/database"

interface GradeAttributes {
    id?: number;
    userId: number;
    course: string;
    gradeReceived: string;
    prof: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Grade extends Model<GradeAttributes> implements GradeAttributes {
    public id!: number;
    public userId!: number;
    public course!: string;
    public gradeReceived!: string;
    public prof!: string; 

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Grade.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        course: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gradeReceived: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prof: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },

    {
        sequelize,
        tableName: "grades"
    }
)

export default Grade;