import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Certifique-se de importar a instância correta do Sequelize

class UserModel extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public cpf!: string;
  public type!: "usuario" | "organizador";
  public assinatura_status!: "ativa" | "expirada" | "cancelada";
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("usuario", "organizador"),
      allowNull: false,
      defaultValue: "usuario",
    },
    assinatura_status: {
      type: DataTypes.ENUM("ativa", "expirada", "cancelada"),
      allowNull: true,
    },
  },
  {
    sequelize, // Agora a instância do sequelize é passada corretamente
    modelName: "UserModel",
    tableName: "users",
  }
);

export default UserModel;
