import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  senhaHash: string;
}
type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare nome: string;
  declare email: string;
  declare cpf: string;
  declare senhaHash: string;
}

UserModel.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
  cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true },
  senhaHash: { type: DataTypes.STRING(255), allowNull: false, field: 'senha_hash' },
}, { sequelize, tableName: 'usuarios', timestamps: true });
