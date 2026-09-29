import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Message } from '../entities/message.entity';
import { News } from '../entities/news.entity';
import { Project } from '../entities/project.entity';
import { ProjectCategory } from '../entities/project-category.entity';
import { NewsCategory } from '../entities/news-category.entity';
import { Service } from '../entities/service.entity';
import { Partner } from '../entities/partner.entity';
import { PartnerCategory } from '../entities/partner-category.entity';
import { TeamMember } from '../entities/team-member.entity';
import { Tender } from '../entities/tender.entity';
import { Career } from '../entities/career.entity';
import { CareerType } from '../entities/career-type.entity';
import { Settings } from '../entities/settings.entity';
import { Application } from '../entities/application.entity';
import { TenderSubmission } from '../entities/tender-submission.entity';
import { BeneficiaryTestimonial } from '../entities/testimonial.entity';
import { MessageSubject } from '../entities/message-subject.entity';
import { Department } from '../entities/department.entity';
import { Supplier } from '../entities/supplier.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'apc_db',
  synchronize: false, // NEVER use auto-sync in production — use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Message, MessageSubject, Department, News, NewsCategory, Project, ProjectCategory, Service, Partner, PartnerCategory, TeamMember, Tender, Career, CareerType, Settings, Application, TenderSubmission, BeneficiaryTestimonial, Supplier],
  migrations: [],
  subscribers: [],
});

