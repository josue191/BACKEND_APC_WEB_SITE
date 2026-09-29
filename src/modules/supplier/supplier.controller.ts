import { Request, Response, NextFunction } from 'express';
import { SupplierService } from './supplier.service';
import { ResponseUtil } from '@/common/utils/response.util';
import ExcelJS from 'exceljs';

export class SupplierController {
  private service = new SupplierService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Fournisseur créé avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.service.findAll({
        page,
        limit,
        category: req.query.category as string,
        status: req.query.status as string,
        search: req.query.search as string
      });
      return ResponseUtil.success(res, 'Liste des fournisseurs récupérée', result.items, result.meta);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails du fournisseur récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Fournisseur mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Fournisseur supprimé avec succès');
    } catch (error) {
      next(error);
    }
  };

  export = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, status, search } = req.query;
      
      // Get all suppliers with filters (no pagination for export)
      const result = await this.service.findAll({
        page: 1,
        limit: 10000, // Large limit for export
        category: category as string,
        status: status as string,
        search: search as string
      });

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fournisseurs');

      // Define columns
      worksheet.columns = [
        { header: 'Entreprise', key: 'companyName', width: 30 },
        { header: 'Contact', key: 'contactName', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Téléphone', key: 'phone', width: 15 },
        { header: 'Adresse', key: 'address', width: 35 },
        { header: 'Site Web', key: 'website', width: 25 },
        { header: 'Catégorie', key: 'category', width: 15 },
        { header: 'Spécialités', key: 'specialties', width: 30 },
        { header: 'Numéro Fiscal', key: 'taxId', width: 20 },
        { header: "Numéro d'Enregistrement", key: 'registrationNumber', width: 25 },
        { header: 'Statut', key: 'status', width: 12 },
        { header: 'Appel d\'Offres', key: 'tenderTitle', width: 30 },
        { header: 'Date d\'Ajout', key: 'createdAt', width: 20 },
      ];

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1a472a' }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;

      // Add data
      result.items.forEach((supplier: any) => {
        worksheet.addRow({
          companyName: supplier.companyName,
          contactName: supplier.contactName,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address || '',
          website: supplier.website || '',
          category: supplier.category,
          specialties: supplier.specialties || '',
          taxId: supplier.taxId || '',
          registrationNumber: supplier.registrationNumber || '',
          status: supplier.status,
          tenderTitle: supplier.tender?.title || '',
          createdAt: new Date(supplier.createdAt).toLocaleDateString('fr-FR'),
        });
      });

      // Style data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.alignment = { vertical: 'middle', wrapText: true };
          row.height = 20;
        }
      });

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=fournisseurs_${new Date().toISOString().split('T')[0]}.xlsx`
      );

      // Send file
      const buffer = await workbook.xlsx.writeBuffer();
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  };

  importFromSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { submissionId } = req.body;
      const result = await this.service.importFromSubmission(submissionId);
      return ResponseUtil.created(res, 'Fournisseur importé avec succès', result);
    } catch (error) {
      next(error);
    }
  };
}
