import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { SupplierCategory } from '@/entities/supplier.entity';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  contactName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsEnum(SupplierCategory)
  @IsOptional()
  category?: SupplierCategory;

  @IsString()
  @IsOptional()
  specialties?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  tenderId?: string;
}

export class UpdateSupplierDto extends CreateSupplierDto {}

export class SupplierFilterDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
