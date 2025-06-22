import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import UserModel from "./UserModel";
import EventsModel from "./EventsModel";

class RegistrationsModel extends Model {
  public id!: number;
  public event_id!: number;
  public user_id!: number;
  public registration_date!: Date;
}

RegistrationsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EventsModel,
        key: "id",
      },
      onDelete: "CASCADE", // Se o evento for excluído, as inscrições também serão excluídas
    },
    user_id: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
      onDelete: "CASCADE", // Se o usuário for excluído, a inscrição também será removida
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "registrations",
  }
);

// Definição de relacionamentos
RegistrationsModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });
RegistrationsModel.belongsTo(EventsModel, { foreignKey: "event_id", as: "event" });

export default RegistrationsModel;