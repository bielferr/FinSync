import { Table, Column, Model, DataType, BeforeSave 

} from 'sequelize-typescript';
import  * as bcrypt from 'bcrypt';


@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
 @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'user', // user | admin
  })
  role!: string;

    // Hash automático antes de salvar no DB
    @BeforeSave
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  
  // Método para comparar senha no login
  async validarSenha(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

}
  



export default User;