// app/literasi/form/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionStore } from '@/core/auth/store/session.store';
import { useLiterasi } from '@/modules/literasi/hooks/useLiterasi';
import { getLiterasiById } from '@/modules/literasi/services/literasi.service';
import { sweet } from '@/shared/utils/sweet';
import type { LiterasiType, LiterasiCategory } from '@/modules/literasi/types/literasi.type';

import { HeaderLiterasi } from '@/components/literasi/form/HeaderLiterasi';
import { FormLiterasi } from '@/components/literasi/form/FormLiterasi';
import { SaveLiterasi } from '@/components/literasi/form/SaveLiterasi';

export default function LiterasiFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSessionStore();
  const { addLiterasi, editLiterasi, editLiterasiWithFiles } = useLiterasi();

  const editId = searchParams.get('edit');
  const editUid = searchParams.get('uid');
  const isEdit = !!editId && !!editUid;

  const [type, setType] = useState<LiterasiType>('artikel');
  const [category, setCategory] = useState<LiterasiCategory>('' as LiterasiCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [linkpdf, setLinkpdf] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (type === 'buku') {
      setCategory('' as LiterasiCategory);
    }
  }, [type]);

  useEffect(() => {
    if (isEdit && editUid && editId) {
      getLiterasiById(editUid, editId).then((data) => {
        if (data) {
          setType(data.type);
          setCategory(data.category);
          setTitle(data.title);
          setDescription(data.description);
          setContent(data.content || '');
          if (data.thumbnail?.url) setThumbnailPreview(data.thumbnail.url);
          if (data.linkpdf) setLinkpdf(data.linkpdf);
          if (data.tiktokLink) setTiktokLink(data.tiktokLink);
          if (data.youtubeLink) setYoutubeLink(data.youtubeLink);
          if (data.instagramLink) setInstagramLink(data.instagramLink);
        }
      });
    }
  }, [isEdit, editUid, editId]);

  const handleThumbnailChange = (file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleThumbnailRemove = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload: any = {
        type,
        title: title.trim(),
        category: type === 'artikel' ? category : '',
        description: description.trim(),
      };

      // Content only for artikel
      if (type === 'artikel' && content.trim()) {
        payload.content = content.trim();
      }

      // Optional fields
      if (thumbnailPreview) payload.thumbnail = { publicId: '', url: thumbnailPreview };
      if (linkpdf) payload.linkpdf = linkpdf;
      if (tiktokLink) payload.tiktokLink = tiktokLink;
      if (youtubeLink) payload.youtubeLink = youtubeLink;
      if (instagramLink) payload.instagramLink = instagramLink;

      let success: boolean;

      if (isEdit && editUid && editId) {
        // Cek jika ada file baru (thumbnail atau pdf)
        if (thumbnailFile || pdfFile) {
          success = await editLiterasiWithFiles(
            editUid, 
            editId, 
            payload, 
            thumbnailFile || undefined, 
            pdfFile || undefined
          );
        } else {
          // Tanpa file baru,-update biasa
          success = await editLiterasi(editUid, editId, payload);
        }
      } else {
        success = await addLiterasi(payload, thumbnailFile || undefined, pdfFile || undefined);
      }

      if (success) {
        await sweet.success({ title: 'Berhasil', text: isEdit ? 'Literasi diupdate' : 'Literasi dipublish' });
        router.push('/literasi');
      }
    } catch (err: any) {
      sweet.error({ title: 'Error', text: err.message || 'Gagal menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  if (!session.uid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Silakan login terlebih dahulu</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 pt-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-t-xl shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            {isEdit ? '✏️ Edit Literasi' : '📝 Tambah Literasi'}
          </h1>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
          <HeaderLiterasi type={type} onTypeChange={setType} isEditing={isEdit} />

          <FormLiterasi
            type={type}
            isEditing={isEdit}
            title={title}
            description={description}
            content={content}
            category={category}
            thumbnailPreview={thumbnailPreview}
            pdfFile={pdfFile}
            linkpdf={linkpdf}
            tiktokLink={tiktokLink}
            youtubeLink={youtubeLink}
            instagramLink={instagramLink}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onContentChange={setContent}
            onCategoryChange={setCategory}
            onThumbnailChange={handleThumbnailChange}
            onThumbnailRemove={handleThumbnailRemove}
            onPdfFileChange={setPdfFile}
            onPdfFileRemove={() => setPdfFile(null)}
            onLinkpdfChange={setLinkpdf}
            onTiktokChange={setTiktokLink}
            onYoutubeChange={setYoutubeLink}
            onInstagramChange={setInstagramLink}
          />

          <SaveLiterasi
            isEdit={isEdit}
            saving={saving}
            onCancel={() => router.back()}
            onSave={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}