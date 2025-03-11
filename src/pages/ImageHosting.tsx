import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Copy, Check, X } from 'lucide-react';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: 'Token Github Lu'
});

const OWNER = 'Username Github Lu';
const REPO = 'Nama Repo Lu';

export default function ImageHosting() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setUploadedUrl(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setUploadedUrl(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedImage);

      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
          const base64Content = btoa(binary);
          
          const timestamp = Date.now();
          const fileName = `${timestamp}-${selectedImage.name}`;

          await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: OWNER,
            repo: REPO,
            path: `images/${fileName}`,
            message: `Upload ${fileName}`,
            content: base64Content,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });

          const imageUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/images/${fileName}`;
          setUploadedUrl(imageUrl);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file');
        setIsUploading(false);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setIsUploading(false);
    }
  };

  const copyToClipboard = async () => {
    if (uploadedUrl) {
      try {
        await navigator.clipboard.writeText(uploadedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 w-full">
      <div className="text-center mb-8 animate-slide-up">
        <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow shadow-lg">
          <ImageIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">CDN Image Hosting</h1>
        <p className="text-base sm:text-lg text-gray-600">Upload and host your images using GitHub as a CDN</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-6 animate-slide-up hover-scale">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors duration-200"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-500">Click or drag to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-gray-600">Click or drag and drop an image</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, etc.</p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={uploadImage}
          disabled={!selectedImage || isUploading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <span>Upload Image</span>
          )}
        </button>

        {/* Image URL */}
        {uploadedUrl && (
          <div className="space-y-2 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={uploadedUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-purple-600 hover:text-purple-700 focus:outline-none"
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}