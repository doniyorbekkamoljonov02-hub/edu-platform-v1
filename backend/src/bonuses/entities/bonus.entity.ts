import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bonuses')
export class Bonus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK -> students.id
  @Column({ type: 'uuid' })
  studentId: string;

  // FK -> users.id (teacher/admin/director who awarded it)
  @Column({ type: 'uuid' })
  awardedById: string;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
