import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Transacao } from './Transacao';

@Table({
  tableName: 'categorias',
  timestamps: false,
})
export class Categoria extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  nome!: string;

  @HasMany(() => Transacao)
  transacoes!: Transacao[];
}
