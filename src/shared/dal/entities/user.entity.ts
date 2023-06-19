import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  public firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  public lastName: string;

  @Column({ type: 'varchar', length: 80, nullable: false, unique: true })
  public email: string;

  @Column({ type: 'varchar', length: 13, nullable: false })
  public phoneNumber: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  public password: string;

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }
}
