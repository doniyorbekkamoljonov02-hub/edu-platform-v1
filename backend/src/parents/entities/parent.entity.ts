import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('parents')
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK -> users.id (the parent's account)
  @Column({ type: 'uuid' })
  userId: string;

  // FK -> students.id (linked child)
  @Column({ type: 'uuid', nullable: true })
  studentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
