import { Router } from 'express';
import { SupplierController } from './supplier.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';

const router = Router();
const controller = new SupplierController();

/**
 * @swagger
 * tags:
 *   - name: Suppliers
 *     description: Gestion des fournisseurs
 */

// Apply auth middleware to all routes
router.use(authMiddleware);

// Specific routes must come before parameterized routes
router.get('/export', authorize(UserRole.ADMIN, UserRole.ADMIN_RH), controller.export);
router.post('/import-from-submission', authorize(UserRole.ADMIN_RH), controller.importFromSubmission);

/**
 * @swagger
 * /api/v1/suppliers:
 *   get:
 *     summary: Récupérer tous les fournisseurs
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des fournisseurs
 */
router.get('/', authorize(UserRole.ADMIN, UserRole.ADMIN_RH), controller.findAll);

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   get:
 *     summary: Récupérer un fournisseur par son ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du fournisseur
 */
router.get('/:id', authorize(UserRole.ADMIN, UserRole.ADMIN_RH), controller.findOne);

/**
 * @swagger
 * /api/v1/suppliers:
 *   post:
 *     summary: Créer un nouveau fournisseur
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Fournisseur créé
 */
router.post('/', authMiddleware, authorize(UserRole.ADMIN_RH), validationMiddleware(CreateSupplierDto), controller.create);

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   put:
 *     summary: Mettre à jour un fournisseur
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Fournisseur mis à jour
 */
router.put('/:id', authorize(UserRole.ADMIN_RH), validationMiddleware(UpdateSupplierDto), controller.update);

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   delete:
 *     summary: Supprimer un fournisseur
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fournisseur supprimé
 */
router.delete('/:id', authorize(UserRole.ADMIN_RH), controller.remove);

export default router;
