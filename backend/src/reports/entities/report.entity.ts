import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Report generation logic (aggregating grades/attendance/bonuses) is not implemented yet — this is storage only.
 */
@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // e.g. 'attendance-summary', 'grades-summary'
  @Column({ type: 'varchar' })
  type: string;

  // FK -> users.id
  @Column({ type: 'uuid' })
  generatedById: string;

  @Column({ type: 'date' })
  periodStart: string;

  @Column({ type: 'date' })
  periodEnd: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
