import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Conta } from './Conta';
import { Categoria } from './Categoria';

@Table({ tableName: 'transacoes' })
export class Transacao extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descricao!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  valor!: number;

  @Column({
    type: DataType.ENUM('entrada', 'saida'),
    allowNull: false,
  })
  tipo!: string;

  @ForeignKey(() => Conta)
  @Column({ type: DataType.INTEGER, allowNull: false })
  contaId!: number;

  @ForeignKey(() => Categoria)
  @Column({ type: DataType.INTEGER, allowNull: false })
  categoriaId!: number;

  @BelongsTo(() => Conta)
  conta!: Conta;

  @BelongsTo(() => Categoria)
  categoria!: Categoria;
}
