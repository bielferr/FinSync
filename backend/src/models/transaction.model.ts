import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import User from './user.model';
import Card from './cards.model';

@Table({ tableName: 'transactions', timestamps: true })
export class Transaction extends Model<Transaction> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  description!: string;

@Column({ type: DataType.DECIMAL, allowNull: false, validate: { min: 0 } })
amount!: number;

@Column({ type: DataType.DATEONLY, allowNull: false })
date!: Date;

@Column({ type: DataType.ENUM('credit', 'debit'), allowNull: false })
type!: 'credit' | 'debit';


  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Card)
  @Column({ type: DataType.INTEGER, allowNull: true })
  cardId?: number;

  @BelongsTo(() => Card)
  card?: Card;
}

export default Transaction;
