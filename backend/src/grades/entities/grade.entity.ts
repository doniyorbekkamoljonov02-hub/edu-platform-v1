import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK -> students.id
  @Column({ type: 'uuid' })
  studentId: string;

  // FK -> subjects.id
  @Column({ type: 'uuid' })
  subjectId: string;

  // FK -> teachers.id (who gave the grade)
  @Column({ type: 'uuid' })
  teacherId: string;

  // e.g. 1-5 or 0-100 scale, decided later
  @Column({ type: 'int' })
  value: number;

  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
