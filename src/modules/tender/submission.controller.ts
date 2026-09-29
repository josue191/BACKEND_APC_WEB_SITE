import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@/config/database.config';
import { TenderSubmission } from '@/entities/tender-submission.entity';
import { Tender } from '@/entities/tender.entity';
import { ResponseUtil } from '@/common/utils/response.util';
import { emailService } from '@/common/services/email.service';

export class SubmissionController {
  private repository = AppDataSource.getRepository(TenderSubmission);
  private tenderRepository = AppDataSource.getRepository(Tender);

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyName, contactName, email, phone, address, tenderId } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const submission = this.repository.create({
        companyName,
        contactName,
        email,
        phone,
        address,
        tenderId,
        technicalOfferUrl: files?.['offreTechnique']?.[0]?.path,
        financialOfferUrl: files?.['offreFinanciere']?.[0]?.path,
        adminDocUrl: files?.['documentAdministratif']?.[0]?.path,
      });

      const result = await this.repository.save(submission);

      // Fire-and-forget email notification
      const tender = await this.tenderRepository.findOneBy({ id: tenderId });
      emailService.notifyNewTenderSubmission({
        companyName,
        contactName,
        email,
        phone,
        tenderTitle: tender?.title,
        tenderRef: tender?.reference,
      });

      return ResponseUtil.created(res, 'Offre soumise avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.repository.find({
        relations: ['tender'],
        order: { createdAt: 'DESC' }
      });
      return ResponseUtil.success(res, 'Liste des soumissions récupérée', result);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.repository.findOne({
        where: { id: id as string },
        relations: ['tender']
      });
      
      if (!result) {
        return ResponseUtil.notFound(res, 'Soumission non trouvée');
      }
      
      return ResponseUtil.success(res, 'Soumission récupérée', result);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, reviewNotes } = req.body;
      
      const submission = await this.repository.findOne({
        where: { id: id as string },
        relations: ['tender']
      });
      
      if (!submission) {
        return ResponseUtil.notFound(res, 'Soumission non trouvée');
      }
      
      submission.status = status;
      if (reviewNotes !== undefined) {
        submission.reviewNotes = reviewNotes;
      }
      
      const result = await this.repository.save(submission);
      
      return ResponseUtil.success(res, 'Statut mis à jour', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const submission = await this.repository.findOne({ where: { id: id as string } });
      
      if (!submission) {
        return ResponseUtil.notFound(res, 'Soumission non trouvée');
      }
      
      await this.repository.remove(submission);
      
      return ResponseUtil.success(res, 'Soumission supprimée', { id });
    } catch (error) {
      next(error);
    }
  };
}
