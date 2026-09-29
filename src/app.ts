import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorMiddleware } from '@/middleware/error/error.middleware';
import authRoutes from '@/modules/auth/auth.routes';
import projectRoutes from '@/modules/project/project.routes';
import projectCategoryRoutes from '@/modules/project/project-category.routes';
import newsRoutes from '@/modules/news/news.routes';
import newsCategoryRoutes from '@/modules/news/news-category.routes';
import careerRoutes from '@/modules/career/career.routes';
import careerTypeRoutes from '@/modules/career/career-type.routes';
import serviceRoutes from '@/modules/service/service.routes';
import partnerRoutes from '@/modules/partner/partner.routes';
import partnerCategoryRoutes from '@/modules/partner/partner-category.routes';
import teamRoutes from '@/modules/team/team.routes';
import departmentRoutes from '@/modules/team/department.routes';
import userRoutes from '@/modules/user/user.routes';
import mediaRoutes from '@/modules/media/media.routes';
import tenderRoutes from '@/modules/tender/tender.routes';
import contactRoutes from '@/modules/contact/contact.routes';
import messageSubjectRoutes from '@/modules/contact/message-subject.routes';
import settingsRoutes from '@/modules/settings/settings.routes';
import testimonialRoutes from '@/modules/testimonial/testimonial.routes';
import dashboardRoutes from '@/modules/dashboard/dashboard.routes';
import supplierRoutes from '@/modules/supplier/supplier.routes';
import { ResponseUtil } from '@/common/utils/response.util';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger.config';

dotenv.config();

const app: Application = express();

// 1. Sécurité (Helmet)
app.use(helmet());

// 2. CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['http://localhost:3000', 'http://localhost:5000'];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (comme Postman ou les outils serveurs)
    if (!origin) return callback(null, true);
    
    // Autoriser explicitement le domaine principal en production, même si le .env est mal configuré
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('agri-peaceandchild.org')) {
      callback(null, true);
    } else {
      console.log(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 3. Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiting (Limiteur global)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000000000000, // Limite drastiquement augmentée pour les tests
  message: { success: false, message: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use(globalLimiter);

// 5. Routes de base
app.get('/', (req, res) => {
  return ResponseUtil.success(res, 'API APC Web-Site opérationnelle');
});

// 5. Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Modules métiers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/project-categories', projectCategoryRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/news-categories', newsCategoryRoutes);
app.use('/api/v1/careers', careerRoutes);
app.use('/api/v1/career-types', careerTypeRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/partner-categories', partnerCategoryRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/tenders', tenderRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/message-subjects', messageSubjectRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/stats/dashboard', dashboardRoutes);
app.use('/api/v1/suppliers', supplierRoutes);

// 7. Gestionnaire d'erreurs (DOIT être le dernier)
app.use(errorMiddleware);

export default app;
