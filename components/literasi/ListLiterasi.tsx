// components/literasi/ListLiterasi.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { FaYoutube, FaTiktok, FaInstagram, FaBookOpen, FaExternalLinkAlt, FaTimes, FaQrcode, FaDownload } from 'react-icons/fa';
import { LITERASI_CATEGORIES } from '@/modules/literasi/types/literasi.type';
import { useSessionStore } from '@/core/auth/store/session.store';
import { useLiterasi } from '@/modules/literasi/hooks/useLiterasi';
import { sweet } from '@/shared/utils/sweet';
import CardBook from '@/components/literasi/card/CardBook';
import CardArtikel from '@/components/literasi/card/CardArtikel';

interface ListLiterasiProps {
  filteredList: any[];
  filterType?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  '': { bg: 'bg-gray-100', text: 'text-gray-600' },
  'pendidikan': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'kesehatan': { bg: 'bg-red-100', text: 'text-red-700' },
  'usaha': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'finansial': { bg: 'bg-green-100', text: 'text-green-700' },
  'lingkungan': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'teknologi': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'tips': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'lainnya': { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const getCategoryColor = (categoryValue: string) => {
  return CATEGORY_COLORS[categoryValue] || CATEGORY_COLORS[''];
};

export default function ListLiterasi({ filteredList, filterType }: ListLiterasiProps) {
  const { session } = useSessionStore();
  const { removeLiterasi } = useLiterasi();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return '-';
    try {
      return new Date(timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
    setQrCodeUrl('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setQrCodeUrl('');
  };

  useEffect(() => {
    if (showModal && selectedItem?.type === 'buku' && selectedItem.pdf?.url) {
      generateQRCode(selectedItem.pdf.url);
    }
  }, [showModal, selectedItem]);

  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error('QR Code error:', err);
    }
  };

  const handleDownloadPdf = () => {
    let pdfUrl = selectedItem.pdf?.url || selectedItem.pdfUrl || selectedItem.file?.url;
    if (!pdfUrl) return;
    
    setDownloading(true);
    try {
      const separator = pdfUrl.includes('?') ? '&' : '?';
      pdfUrl = `${pdfUrl}${separator}fl_attachment=true`;
      window.open(pdfUrl, '_blank');
      sweet.toast({ title: 'Sedang mendownload...' });
    } catch (error) {
      sweet.error({ title: 'Gagal mendownload' });
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  const handleDelete = async (uid: string, id: string, type: string) => {
    const confirm = await sweet.confirmDanger({
      title: `Hapus ${type}?`,
      text: 'Data akan dihapus permanen',
    });
    
    if (confirm) {
      try {
        await removeLiterasi(uid, id, type);
        window.location.reload();
      } catch (error) {
        // Error sudah handle di hook
      }
    }
  };

  const getEmptyMessage = () => {
    if (filterType === 'buku') return 'Belum ada buku';
    if (filterType === 'artikel') return 'Belum ada artikel';
    return 'Belum ada artikel atau buku';
  };

  if (filteredList.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-gray-400 text-xs">{getEmptyMessage()}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-4 stagger-children px-4 lg:px-8 pt-4">
        {filteredList.map((item, index) => (
          <div key={`${item.uid}-${item.id}`} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            {item.type === 'buku' ? (
              <CardBook item={item} onOpenModal={openModal} onDelete={handleDelete} />
            ) : (
              <CardArtikel item={item} onOpenModal={openModal} onDelete={handleDelete} />
            )}
          </div>
        ))}
      </div>

      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeModal} />
          
          <div className="relative bg-white w-full max-w-lg rounded-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in">
            <div className="relative h-36 md:h-44 bg-gray-100 shrink-0">
              {selectedItem.thumbnail?.url ? (
                <Image src={selectedItem.thumbnail.url} alt={selectedItem.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {selectedItem.type === 'buku' ? <FaBookOpen /> : '📰'}
                </div>
              )}
              
              <button type="button" onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all">
                <FaTimes className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-3 left-3">
                <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full ${selectedItem.type === 'buku' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {selectedItem.type === 'buku' ? '📚 BUKU' : '📰 ARTIKEL'}
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pb-2">
                {selectedItem.type === 'artikel' && selectedItem.category && (
                  <span className={`inline-block px-2 py-1 text-[10px] font-medium rounded-full mb-2 ${getCategoryColor(selectedItem.category).bg} ${getCategoryColor(selectedItem.category).text}`}>
                    {LITERASI_CATEGORIES.find(c => c.value === selectedItem.category)?.label || selectedItem.category}
                  </span>
                )}
                
                <h2 className="font-semibold text-gray-800 text-sm mb-1.5">{selectedItem.title}</h2>
                
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span>{selectedItem.authorName || '-'}</span>
                  <span>•</span>
                  <span>{formatDate(selectedItem.createdAt)}</span>
                </div>
              </div>
              
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500">{selectedItem.description}</p>
              </div>
              
              {selectedItem.type === 'artikel' && (
                <div className="flex flex-wrap gap-2 px-4 pb-4">
                  {selectedItem.youtubeLink && (
                    <a href={selectedItem.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 active:scale-95 transition-all">
                      <FaYoutube className="w-4 h-4" /> YouTube
                    </a>
                  )}
                  {selectedItem.tiktokLink && (
                    <a href={selectedItem.tiktokLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 active:scale-95 transition-all">
                      <FaTiktok className="w-4 h-4" /> TikTok
                    </a>
                  )}
                  {selectedItem.instagramLink && (
                    <a href={selectedItem.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-lg text-xs hover:bg-pink-100 active:scale-95 transition-all">
                      <FaInstagram className="w-4 h-4" /> Instagram
                    </a>
                  )}
                </div>
              )}
              
              {selectedItem.type === 'buku' && (
                <>
                  <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-xs text-gray-800 mb-2">Scan QR Code</p>
                      
                      {qrCodeUrl ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-white p-2 rounded-lg border-2 border-gray-800">
                            <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-2">Arahkan kamera ke QR</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-20 bg-white border-2 border-gray-800 rounded-lg flex items-center justify-center shrink-0">
                            <FaQrcode className="w-12 h-12 text-gray-800 animate-pulse" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-gray-800">Generating QR...</p>
                            <p className="text-[10px] text-gray-500">Tunggu sebentar</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 px-4 pb-4">
                    {selectedItem.linkpdf && (
                      <a href={selectedItem.linkpdf} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 active:scale-95 transition-all">
                        <FaExternalLinkAlt className="w-4 h-4" /> Buka Link PDF
                      </a>
                    )}
                    
                    {(selectedItem.pdf?.url || selectedItem.pdfUrl || selectedItem.file?.url) && (
                      <button onClick={handleDownloadPdf} disabled={downloading} className="flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl text-xs font-medium hover:bg-red-700 active:scale-95 transition-all disabled:opacity-70">
                        {downloading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <FaDownload className="w-4 h-4" /> Download PDF
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
              
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}