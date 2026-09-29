import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DayOfWeek } from './day-of-week.enum';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK -> teachers.id
  @Column({ type: 'uuid' })
  teacherId: string;

  // FK -> subjects.id
  @Column({ type: 'uuid' })
  subjectId: string;

  // FK -> groups.id
  @Column({ type: 'uuid' })
  groupId: string;

  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  // e.g. '09:00'
  @Column({ type: 'varchar' })
  startTime: string;

  // e.g. '10:20'
  @Column({ type: 'varchar' })
  endTime: string;

  @Column({ type: 'varchar', nullable: true })
  room: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
