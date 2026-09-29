import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Ranking rows are expected to be computed (from grades + bonuses) rather than hand-entered; that calculation logic is not implemented yet.
 */
@Entity('rankings')
export class Ranking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK -> students.id
  @Column({ type: 'uuid' })
  studentId: string;

  // FK -> groups.id
  @Column({ type: 'uuid' })
  groupId: string;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  // e.g. '2026-Q1' — calculation logic added later
  @Column({ type: 'varchar' })
  period: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
