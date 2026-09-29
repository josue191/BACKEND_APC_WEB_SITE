import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Tender } from './tender.entity';

export enum SupplierCategory {
  CONSTRUCTION = 'construction',
  FOURNITURES = 'fournitures',
  SERVICES = 'services',
  TRANSPORT = 'transport',
  CONSULTING = 'consulting',
  AUTRE = 'autre'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - companyName
 *         - contactName
 *         - email
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         companyName:
 *           type: string
 *         contactName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         website:
 *           type: string
 *         category:
 *           type: string
 *           enum: [construction, fournitures, services, transport, consulting, autre]
 *         specialties:
 *           type: string
 *         taxId:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         status:
 *           type: string
 *         notes:
 *           type: string
 *         tenderId:
 *           type: string
 *           format: uuid
 *         manualEntry:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
@Entity('suppliers')
export class Supplier {
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
  website!: string;

  @Column({
    type: 'enum',
    enum: SupplierCategory,
    default: SupplierCategory.AUTRE
  })
  category!: SupplierCategory;

  @Column({ nullable: true, type: 'text' })
  specialties!: string; // Spécialités/sous-catégories (ex: "Matériel informatique, Mobilier de bureau")

  @Column({ nullable: true })
  taxId!: string; // Numéro d'identification fiscale

  @Column({ nullable: true })
  registrationNumber!: string; // Numéro d'enregistrement commercial

  @Column({ default: 'active' })
  status!: string; // active, inactive, blacklisted

  @Column({ nullable: true, type: 'text' })
  notes!: string; // Notes internes sur le fournisseur

  @ManyToOne(() => Tender, { nullable: true, onDelete: 'SET NULL' })
  tender!: Tender;

  @Column({ nullable: true })
  tenderId!: string; // L'appel d'offre auquel il a répondu en premier

  @Column({ default: false })
  manualEntry!: boolean; // true si ajouté manuellement, false si issu d'une soumission

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
