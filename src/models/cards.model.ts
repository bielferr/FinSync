import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'cards', timestamps: true })
export class Card extends Model<Card> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.DECIMAL, allowNull: false, defaultValue: 0 })
  limit!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  due_day!: number;

  @Column({ type: DataType.DECIMAL, allowNull: false, defaultValue: 0 })
  balance!: number;
}

export default Card;
