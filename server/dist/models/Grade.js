"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Grade extends sequelize_1.Model {
}
exports.Grade = Grade;
Grade.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    course: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    gradeReceived: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    prof: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    term: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: database_1.default,
    tableName: "grades"
});
exports.default = Grade;
//# sourceMappingURL=Grade.js.map