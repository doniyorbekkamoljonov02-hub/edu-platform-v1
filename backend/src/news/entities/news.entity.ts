import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'varchar' }) title: string;
  @Column({ type: 'text' }) content: string;
  @Column({ type: 'uuid' }) authorId: string;
  @Column({ type: 'uuid', nullable: true }) targetGroupId: string | null;
  @Column({ type: 'boolean', default: true }) isPublished: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
