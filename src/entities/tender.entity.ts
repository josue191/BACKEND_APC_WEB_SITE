import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TenderStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Tender:
 *       type: object
 *       required:
 *         - title
 *         - reference
 *         - description
 *         - category
 *         - deadline
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         reference:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         status:
 *           type: string
 *           enum: [open, closed, cancelled, archived]
 *         deadline:
 *           type: string
 *           format: date-time
 *         fileUrl:
 *           type: string
 *         organization:
 *           type: string
 */
@Entity('tenders')
export class Tender {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  reference!: string;

  @Column('text')
  description!: string;

  @Column()
  category!: string; // ex: Construction, Fournitures, Services

  @Column({
    type: 'enum',
    enum: TenderStatus,
    default: TenderStatus.OPEN
  })
  status!: TenderStatus;

  @Column({ type: 'timestamp' })
  deadline!: Date;

  @Column({ nullable: true })
  fileUrl!: string; // URL du document d'appel d'offres

  @Column({ nullable: true })
  organization!: string; // Si différent de APC

  @Column({ nullable: true })
  imageUrl!: string; // URL de l'image d'illustration (Cloudinary)

  @Column({ nullable: true })
  slug!: string; // Slug pour l'URL unique (ex: fourniture-materiel-bureau-2024)

  @Column({ nullable: true, type: 'text' })
  metaDescription!: string; // Description pour Open Graph (150-160 caractères)

  @Column({ nullable: true })
  metaKeywords!: string; // Mots-clés SEO

  @Column({ default: false })
  isFeatured!: boolean; // Mettre en avant sur la page d'accueil

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
