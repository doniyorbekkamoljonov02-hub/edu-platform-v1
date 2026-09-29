import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AttendanceStatus } from './attendance-status.enum';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK -> students.id
  @Column({ type: 'uuid' })
  studentId: string;

  // FK -> groups.id
  @Column({ type: 'uuid' })
  groupId: string;

  // FK -> subjects.id
  @Column({ type: 'uuid' })
  subjectId: string;

  // FK -> teachers.id (who took attendance)
  @Column({ type: 'uuid' })
  teacherId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
