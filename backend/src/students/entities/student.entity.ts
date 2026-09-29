import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK -> users.id (the student's account)
  @Column({ type: 'uuid' })
  userId: string;

  // FK -> groups.id
  @Column({ type: 'uuid', nullable: true })
  groupId: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'date', nullable: true })
  enrollmentDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
