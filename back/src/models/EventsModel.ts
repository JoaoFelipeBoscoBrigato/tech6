import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import UserModel from "./UserModel"; // Importação do UserModel

interface EventAttributes {
  id?: number;
  name: string;
  date: Date;
  location: string;
  description: string;
  image_url: string | null;
  organizer_id: number;
  created_at?: Date;
  updated_at?: Date;
}

class EventsModel extends Model<EventAttributes> implements EventAttributes {
  public id!: number;
  public name!: string;
  public date!: Date;
  public location!: string;
  public description!: string;
  public image_url!: string | null;
  public organizer_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

EventsModel.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel, // Referência correta a tabela de usuários
        key: "id",
      },
      onDelete: "CASCADE", // Se um organizador for deletado, seus eventos são excluídos
    },
  },
  {
    sequelize,
    tableName: "events",
    timestamps: true,
    underscored: true,
  }
);

// Definindo a relação entre os modelos após a definição dos dois modelos
EventsModel.belongsTo(UserModel, {
  foreignKey: "organizer_id",
  as: "organizer",
});

export default EventsModel;
