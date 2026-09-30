import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Vérifier si Cloudinary est configuré
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('Cloudinary configuré avec succès');
} else {
  console.warn('Cloudinary non configuré - utilisation du stockage local');
}

// Créer le dossier de stockage local si Cloudinary n'est pas configuré
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const isImage = file.mimetype.startsWith('image/');
      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      
      if (isImage) {
        return {
          folder: 'apc-website',
          resource_type: 'image',
          format: file.originalname.split('.').pop(),
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        };
      } else {
        return {
          folder: 'apc-website',
          resource_type: 'auto', // Auto-detect resource type
          public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
        };
      }
    },
  });
} else {
  // Stockage local en fallback
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Configuration spécifique pour les soumissions (stockage local uniquement)
const submissionUploadDir = path.join(process.cwd(), 'uploads', 'submissions');
if (!fs.existsSync(submissionUploadDir)) {
  fs.mkdirSync(submissionUploadDir, { recursive: true });
}

const localSubmissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submissionUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `submission-${uniqueSuffix}${ext}`);
  }
});

export const submissionUpload = multer({
  storage: localSubmissionStorage,
  limits: {
    fileSize: 70 * 1024 * 1024, // 70MB limit pour les soumissions
  }
});

export default cloudinary;

