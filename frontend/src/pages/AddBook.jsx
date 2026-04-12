import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { UploadCloud } from 'lucide-react';

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', author: '', description: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error('Please select a PDF file.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('author', form.author);
      formData.append('description', form.description);
      formData.append('pdf', pdfFile);
      if (coverImage) {
        formData.append('cover', coverImage);
      }

      await api.post('/books/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Book added successfully!');
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book');
    } finally { setLoading(false); }
  };

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
    } else {
      toast.error('Please drop a valid image file');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Add New Book</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input className="input-field" value={form.title} onChange={(e) => update('title', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Author *</label>
            <input className="input-field" value={form.author} onChange={(e) => update('author', e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">PDF File *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Cover Image</label>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setCoverImage(e.target.files[0])} 
              className="hidden" 
              id="coverUpload" 
            />
            <label 
              htmlFor="coverUpload" 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex items-center justify-center gap-2 input-field cursor-pointer border-dashed border-2 transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'hover:border-emerald-500/50'}`}
            >
              <UploadCloud className={`w-5 h-5 ${isDragging ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span className={isDragging ? 'text-emerald-400 font-medium' : 'text-gray-400'}>
                {isDragging ? 'Drop image here...' : (coverImage ? coverImage.name : 'Choose or drop a cover image...')}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea className="input-field h-24 resize-none" value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Adding...' : 'Add Book'}</button>
          <button type="button" onClick={() => navigate('/books')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
