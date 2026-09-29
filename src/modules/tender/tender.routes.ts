import { Router } from 'express';
import { TenderController } from './tender.controller';
import { SubmissionController } from './submission.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreateTenderDto, UpdateTenderDto } from './dto/tender.dto';
import { upload } from '@/config/cloudinary.config';

const router = Router();
const controller = new TenderController();
const submissionController = new SubmissionController();

/**
 * @swagger
 * tags:
 *   - name: Tenders
 *     description: Gestion des appels d'offres (Marchés publics)
 *   - name: Submissions
 *     description: Gestion des soumissions d'offres
 */

/**
 * @swagger
 * /api/v1/tenders:
 *   get:
 *     summary: Récupérer tous les appels d'offres
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Liste des appels d'offres
 */
router.get('/', controller.findAll);

// Routes pour slug (public - pour accéder aux appels d'offres par slug)
// Must come before /:id to avoid conflict
router.get('/slug/:slug', controller.findBySlug);

/**
 * @swagger
 * /api/v1/tenders/submit:
 *   post:
 *     summary: Soumettre une offre technique et financière
 *     tags: [Submissions]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               companyName: { type: string }
 *               contactName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               tenderId: { type: string }
 *               offreTechnique: { type: string, format: binary }
 *               offreFinanciere: { type: string, format: binary }
 *               documentAdministratif: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Offre soumise avec succès
 */
router.post('/submit', upload.fields([
  { name: 'offreTechnique', maxCount: 1 },
  { name: 'offreFinanciere', maxCount: 1 },
  { name: 'documentAdministratif', maxCount: 1 }
]), submissionController.submit);

/**
 * @swagger
 * /api/v1/tenders/{id}:
 *   get:
 *     summary: Récupérer un appel d'offres par son ID
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'appel d'offres
 */
router.get('/:id', controller.findOne);

// Routes administratives (Protégées)
router.use(authMiddleware);

// Image upload et slug generation (ADMIN_RH only)
// These use PUT/POST with specific IDs, not conflicting with GET /:id
router.put('/:id/image', authorize(UserRole.ADMIN_RH), upload.single('image'), controller.uploadImage);
router.put('/:id/slug', authorize(UserRole.ADMIN_RH), controller.generateSlug);

// Lecture : accessible aux deux rôles
router.get('/submissions', authorize(UserRole.ADMIN, UserRole.ADMIN_RH), submissionController.findAll);
router.get('/submissions/:id', authorize(UserRole.ADMIN, UserRole.ADMIN_RH), submissionController.findOne);

// Écriture : ADMIN_RH seulement
router.patch('/submissions/:id', authorize(UserRole.ADMIN_RH), submissionController.updateStatus);
router.delete('/submissions/:id', authorize(UserRole.ADMIN_RH), submissionController.remove);

// Ancienne route pour compatibilité
router.get('/submissions/all', authorize(UserRole.ADMIN, UserRole.ADMIN_RH), submissionController.findAll);

// Écriture : ADMIN_RH seulement
/**
 * @swagger
 * /api/v1/tenders:
 *   post:
 *     summary: Créer un nouvel appel d'offres
 *     tags: [Tenders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tender'
 *     responses:
 *       201:
 *         description: Appel d'offres créé
 */
router.post('/', authorize(UserRole.ADMIN_RH), validationMiddleware(CreateTenderDto), controller.create);
router.put('/:id', authorize(UserRole.ADMIN_RH), validationMiddleware(UpdateTenderDto), controller.update);
router.delete('/bulk', authorize(UserRole.ADMIN_RH), controller.bulkDelete);
router.delete('/:id', authorize(UserRole.ADMIN_RH), controller.remove);
router.patch('/bulk-status', authorize(UserRole.ADMIN_RH), controller.bulkSetStatus);
router.patch('/:id/status', authorize(UserRole.ADMIN_RH), controller.setStatus);

export default router;
