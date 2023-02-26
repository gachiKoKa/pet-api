import { Column, Entity } from 'typeorm';

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
}
