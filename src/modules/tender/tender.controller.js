import { TenderService } from './tender.service';
import { ResponseUtil } from '@/common/utils/response.util';
export class TenderController {
    service = new TenderService();
    create = async (req, res, next) => {
        try {
            const result = await this.service.create(req.body);
            return ResponseUtil.created(res, 'Appel d\'offres créé avec succès', result);
        }
        catch (error) {
            next(error);
        }
    };
    findAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const adminMode = req.query.adminMode === 'true' || ['ADMIN', 'ADMIN_RH'].includes(req.user?.role);
            const result = await this.service.findAll({
                page,
                limit,
                adminMode,
                category: req.query.category,
                status: req.query.status,
                search: req.query.search
            });
            return ResponseUtil.success(res, 'Liste des appels d\'offres récupérée', result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    findOne = async (req, res, next) => {
        try {
            const result = await this.service.findOne(req.params.id);
            return ResponseUtil.success(res, 'Détails de l\'appel d\'offres récupérés', result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const result = await this.service.update(req.params.id, req.body);
            return ResponseUtil.success(res, 'Appel d\'offres mis à jour avec succès', result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.service.remove(req.params.id);
            return ResponseUtil.success(res, 'Appel d\'offres supprimé avec succès');
        }
        catch (error) {
            next(error);
        }
    };
    setStatus = async (req, res, next) => {
        try {
            const { status } = req.body;
            const result = await this.service.setStatus(req.params.id, status);
            return ResponseUtil.success(res, 'Statut mis à jour avec succès', result);
        }
        catch (error) {
            next(error);
        }
    };
    bulkDelete = async (req, res, next) => {
        try {
            const { ids } = req.body;
            await this.service.bulkDelete(ids);
            return ResponseUtil.success(res, 'Appels d\'offres supprimés avec succès');
        }
        catch (error) {
            next(error);
        }
    };
    bulkSetStatus = async (req, res, next) => {
        try {
            const { ids, status } = req.body;
            await this.service.bulkSetStatus(ids, status);
            return ResponseUtil.success(res, 'Statuts mis à jour avec succès');
        }
        catch (error) {
            next(error);
        }
    };
}
