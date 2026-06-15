// modules/literasi/services/upload.literasi.ts

import { CloudinaryImage, CloudinaryPDF } from '@/shared/types/cloudinary.type';

export const uploadImage = async (file: File, folder: string): Promise<CloudinaryImage> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', `literasi/${folder}`);
  formData.append('cropType', '16:9');
  formData.append('resourceType', 'image');

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Upload image failed');
  }

  return {
    publicId: data.publicId,
    url: data.url,
  };
};

export const uploadPdf = async (file: File, folder: string): Promise<CloudinaryPDF> => {
  const randomId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  const fileName = `${randomId}`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', `literasi/${folder}/pdf`);
  formData.append('publicId', fileName);
  formData.append('resourceType', 'raw');

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Upload PDF failed');
  }

  return {
    publicId: data.publicId,
    url: data.url,
  };
};

export const deleteImage = async (publicId: string): Promise<void> => {
  const res = await fetch('/api/upload/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId, resourceType: 'image' }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Delete image failed');
  }
};

export const deletePdf = async (publicId: string): Promise<void> => {
  // Extract filename doang, hapus .pdf extension
  const fileName = publicId.split('/').pop()?.replace('.pdf', '') || publicId;
  
  const res = await fetch('/api/upload/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId: fileName, resourceType: 'raw' }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Delete PDF failed');
  }
};