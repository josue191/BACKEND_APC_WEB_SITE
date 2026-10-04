import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsUUID, IsArray, IsBoolean } from 'class-validator';
import { TenderStatus } from '@/entities/tender.entity';

export class CreateTenderDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsEnum(TenderStatus)
  @IsOptional()
  status?: TenderStatus;

  @IsDateString()
  @IsNotEmpty()
  deadline!: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsEnum(['standard', 'single'])
  @IsOptional()
  submissionMode?: 'standard' | 'single';
}

export class UpdateTenderDto extends CreateTenderDto {}

export class BulkDeleteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];
}
