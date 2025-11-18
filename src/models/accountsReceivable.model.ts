import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table({
  tableName: 'accounts_receivable',
  timestamps: true,
})
export class AccountReceivable extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client!: string; // cliente que vai pagar

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: { min: 0 },
  })
  amount!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  receivedDate!: Date;

  @Column({
    type: DataType.ENUM('pending', 'received'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'received';

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

export default AccountReceivable;
