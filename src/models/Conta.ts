import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Transacao } from './Transacao';

@Table({ tableName: 'contas' })
export class Conta extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  nome!: string;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  saldo!: number;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER, allowNull: false })
  usuario_id!: number;

  @BelongsTo(() => Usuario)
  usuario!: Usuario;

  @HasMany(() => Transacao)
  transacoes!: Transacao[];
}
