import { AppDataSource } from '@/config/database.config';
import { Supplier, SupplierCategory } from '@/entities/supplier.entity';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { NotFoundError, ConflictError } from '@/common/utils/error.util';
import { In } from 'typeorm';

export class SupplierService {
  private repository = AppDataSource.getRepository(Supplier);

  async create(data: CreateSupplierDto) {
    // Check if email already exists
    const existing = await this.repository.findOneBy({ email: data.email });
    if (existing) {
      throw new ConflictError('Un fournisseur avec cet email existe déjà');
    }

    const supplier = this.repository.create(data);
    return await this.repository.save(supplier);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, category, status, search } = query;
    const qb = this.repository.createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.tender', 'tender');

    if (category) {
      qb.andWhere('supplier.category = :category', { category });
    }

    if (status) {
      qb.andWhere('supplier.status = :status', { status });
    }

    if (search) {
      qb.andWhere('(supplier.companyName LIKE :search OR supplier.contactName LIKE :search OR supplier.email LIKE :search)', {
        search: `%${search}%`
      });
    }

    qb.orderBy('supplier.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const supplier = await this.repository.findOne({
      where: { id },
      relations: ['tender']
    });
    if (!supplier) {
      throw new NotFoundError('Fournisseur introuvable');
    }
    return supplier;
  }

  async update(id: string, data: UpdateSupplierDto) {
    const supplier = await this.findOne(id);
    
    // Check if email is being changed and if it already exists
    if (data.email && data.email !== supplier.email) {
      const existing = await this.repository.findOneBy({ email: data.email });
      if (existing) {
        throw new ConflictError('Un fournisseur avec cet email existe déjà');
      }
    }

    Object.assign(supplier, data);
    return await this.repository.save(supplier);
  }

  async remove(id: string) {
    const supplier = await this.findOne(id);
    await this.repository.remove(supplier);
    return true;
  }

  async importFromSubmission(submissionId: string) {
    const { TenderSubmission } = await import('@/entities/tender-submission.entity');
    const submissionRepo = AppDataSource.getRepository(TenderSubmission);
    
    const submission = await submissionRepo.findOne({
      where: { id: submissionId },
      relations: ['tender']
    });

    if (!submission) {
      throw new NotFoundError('Soumission introuvable');
    }

    // Check if supplier already exists with this email
    const existing = await this.repository.findOneBy({ email: submission.email });
    if (existing) {
      throw new ConflictError('Un fournisseur avec cet email existe déjà');
    }

    // Map category based on tender category
    const categoryMap: Record<string, SupplierCategory> = {
      'Construction': SupplierCategory.CONSTRUCTION,
      'Fournitures': SupplierCategory.FOURNITURES,
      'Services': SupplierCategory.SERVICES,
      'Transport': SupplierCategory.TRANSPORT,
      'Consultant': SupplierCategory.CONSULTING,
    };

    const supplier = this.repository.create({
      companyName: submission.companyName,
      contactName: submission.contactName,
      email: submission.email,
      phone: submission.phone,
      address: submission.address,
      category: submission.tender?.category ? categoryMap[submission.tender.category] || SupplierCategory.AUTRE : SupplierCategory.AUTRE,
      tenderId: submission.tenderId,
      manualEntry: false,
      status: 'active'
    });

    return await this.repository.save(supplier);
  }
}
