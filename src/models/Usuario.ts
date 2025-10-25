import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Conta } from './Conta';

@Table({ tableName: 'usuarios' })
export class Usuario extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  nome!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  senha!: string;

  @HasMany(() => Conta)
  contas!: Conta[];
}
