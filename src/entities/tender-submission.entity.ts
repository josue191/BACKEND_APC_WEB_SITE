import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Tender } from './tender.entity';

export enum SubmissionStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

@Entity('tender_submissions')
export class TenderSubmission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyName!: string;

  @Column()
  contactName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  technicalOfferUrl!: string;

  @Column({ nullable: true })
  financialOfferUrl!: string;

  @Column({ nullable: true })
  adminDocUrl!: string;

  @Column({ nullable: true, type: 'text', default: null })
  reviewNotes?: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING
  })
  status!: SubmissionStatus;

  @ManyToOne(() => Tender, { onDelete: 'CASCADE' })
  tender!: Tender;

  @Column()
  tenderId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
