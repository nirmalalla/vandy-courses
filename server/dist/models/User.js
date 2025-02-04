"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    verification_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    is_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize: database_1.default,
    tableName: "users"
});
exports.default = User;
//# sourceMappingURL=User.js.map