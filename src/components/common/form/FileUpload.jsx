import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import FormField from './FormField';

export const FileUpload = ({
  label,
  name,
  value, // file object or file name string
  onChange,
  onBlur,
  accept = '.pdf,.doc,.docx',
  maxSizeMB = 5,
  required = false,
  error = '',
  touched = false,
  hint = 'PDF, DOCX up to 5MB',
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileProcess = (file) => {
    if (!file) return;

    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      if (onChange) onChange({ target: { name, value: null, error: `File exceeds maximum size of ${maxSizeMB}MB` } });
      return;
    }

    // Simulate upload progress
    setIsSimulatingUpload(true);
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setIsSimulatingUpload(false);
          if (onChange) {
            onChange({
              target: {
                name,
                value: {
                  name: file.name,
                  size: (file.size / 1024).toFixed(1) + ' KB',
                  type: file.type,
                  lastModified: file.lastModified
                }
              }
            });
          }
          return 100;
        }
        return prev + 30;
      });
    }, 120);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadProgress(0);
    if (onChange) onChange({ target: { name, value: null } });
  };

  const fileData = typeof value === 'string' ? { name: value, size: 'Pre-loaded' } : value;

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      error={error}
      touched={touched}
      hint={hint}
      className={className}
    >
      <input
        ref={fileInputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        onBlur={onBlur}
        className="hidden"
      />

      {fileData ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/60 p-3.5 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[220px] sm:max-w-xs">
                {fileData.name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={12} />
                <span>Uploaded ({fileData.size})</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-rose-500 dark:hover:bg-slate-800"
            title="Remove file"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900/40'
          }`}
        >
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <UploadCloud size={22} />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-slate-400">PDF or DOCX (max {maxSizeMB}MB)</p>

          {isSimulatingUpload && (
            <div className="mt-3 w-full max-w-xs">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full bg-indigo-600 transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="mt-1 block text-[11px] text-indigo-600 dark:text-indigo-400">
                Uploading {uploadProgress}%...
              </span>
            </div>
          )}
        </div>
      )}
    </FormField>
  );
};

export default FileUpload;
