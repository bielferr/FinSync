import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table({
  tableName: 'accounts_payable',
  timestamps: true,
})
export class AccountPayable extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: { min: 0 }
  })
  amount!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  dueDate!: Date;

  @Column({
    type: DataType.ENUM('pending', 'paid'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'paid';

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}


export default AccountPayable;
