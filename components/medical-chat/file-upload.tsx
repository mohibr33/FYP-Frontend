'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  disabled,
  accept = 'image/jpeg,image/jpg,image/png,application/pdf,.doc,.docx,.txt',
  maxSizeMB = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    onFileSelect(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        className="h-10 w-10 rounded-full"
      >
        <Paperclip className="h-5 w-5" />
      </Button>
    </>
  );
};
