import React, { useState, useEffect } from 'react';
import { uploadImage, validateImageFile, formatFileSize } from '@/services/images';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Upload, X } from 'lucide-react';

export const ImageUploadComponent = ({
    apiUrl,
    onUploadComplete,
    onUploadError
}) => {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!validateImageFile(file)) {
            onUploadError?.('Invalid file. Please select a valid image file (JPEG, PNG, GIF, WebP) under 1MB.');
            return;
        }

        setSelectedFile(file);
        
        // Create preview URL
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const response = await uploadImage(apiUrl, selectedFile);
            if (response.success) {
                setUploadedUrl(response.url);
                onUploadComplete?.(response.url);
            } else {
                onUploadError?.(response.message || 'Upload failed');
            }
        } catch (error) {
            onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    // Cleanup preview URL when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Choose image to upload</span>
                    </div>
                </Label>
                <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                />
                {selectedFile && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        {/* Image Preview */}
                        <div className="flex-shrink-0">
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="w-12 h-12 object-cover rounded border"
                            />
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl('');
                                // Reset the input
                                const input = document.getElementById('image-upload');
                                if (input) input.value = '';
                            }}
                            disabled={uploading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {selectedFile && (
                <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full"
                >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
            )}

            {uploadedUrl && (
                <div className="space-y-2">
                    <p className="text-sm text-green-600 font-medium">Upload successful!</p>
                    <div className="border rounded-lg overflow-hidden">
                        <img
                            src={uploadedUrl}
                            alt="Uploaded"
                            className="w-full h-32 object-cover"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploadComponent;
