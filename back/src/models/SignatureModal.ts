import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Instância do Sequelize
import UserModel from "./UserModel"; // Importação do UserModel

class SignatureModel extends Model {
  public id!: number;
  public user_id!: number;
  public plan!: "mensal" | "anual"; // Definindo os planos de assinatura
  public status!: "ativa" | "expirada" | "cancelada"; // Status da assinatura
  public start_date!: Date; // Data de início da assinatura
  public end_date!: Date; // Data de fim da assinatura
}

SignatureModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel, // Referência correta à tabela de usuários
        key: "id",
      },
      onDelete: "CASCADE", // Se o usuário for deletado, a assinatura também será excluída
    },
    plan: {
      type: DataTypes.ENUM("mensal", "anual"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ativa", "expirada", "cancelada"),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize, // Passando a instância do sequelize
    tableName: "signatures", // Nome da tabela
  }
);

// Definindo a relação entre assinatura e usuário
SignatureModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });

export default SignatureModel;
