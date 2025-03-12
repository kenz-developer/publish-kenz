import React, { useState, useEffect } from 'react';
import { Upload, Globe, Loader2, Timer, Check, X, FileIcon } from 'lucide-react';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: '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'
});

const USERNAME = 'kenz-publish';

interface FileUpload {
  file: File;
  type: 'html' | 'css' | 'js';
}

export default function GithubPagesBuilder() {
  const [repoName, setRepoName] = useState('');
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowLink(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const checkRepoName = async () => {
      if (!repoName) {
        setIsNameAvailable(null);
        return;
      }

      setIsCheckingName(true);
      try {
        await octokit.request('GET /repos/{owner}/{repo}', {
          owner: USERNAME,
          repo: repoName,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        setIsNameAvailable(false);
      } catch (error) {
        setIsNameAvailable(true);
      } finally {
        setIsCheckingName(false);
      }
    };

    const debounceTimer = setTimeout(checkRepoName, 500);
    return () => clearTimeout(debounceTimer);
  }, [repoName]);

  const handleFileUpload = (uploadedFiles: FileList | null, type: 'html' | 'css' | 'js') => {
    if (!uploadedFiles) return;

    const newFiles = Array.from(uploadedFiles).map(file => ({
      file,
      type
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'html':
        return 'text-orange-500';
      case 'css':
        return 'text-blue-500';
      case 'js':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !repoName || !isNameAvailable) return;

    setIsLoading(true);
    setError('');
    setSuccess('');
    setShowLink(false);
    setCountdown(null);

    try {
      // Create repository
      await octokit.request('POST /user/repos', {
        name: repoName,
        auto_init: true,
        private: false,
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      // Upload all files
      for (const fileUpload of files) {
        const reader = new FileReader();
        
        try {
          const content = await new Promise<string>((resolve, reject) => {
            reader.onload = async () => {
              try {
                const arrayBuffer = reader.result as ArrayBuffer;
                const bytes = new Uint8Array(arrayBuffer);
                const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                resolve(btoa(binary));
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(fileUpload.file);
          });

          await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: USERNAME,
            repo: repoName,
            path: fileUpload.file.name,
            message: `Add ${fileUpload.file.name}`,
            content,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });
        } catch (error) {
          throw new Error(`Failed to upload ${fileUpload.file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Enable GitHub Pages
      await octokit.request('POST /repos/{owner}/{repo}/pages', {
        owner: USERNAME,
        repo: repoName,
        source: {
          branch: 'main',
          path: '/'
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      const url = `https://${USERNAME}.github.io/${repoName}`;
      setWebsiteUrl(url);
      setSuccess('Repository created successfully! Please wait while your website is being deployed...');
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 w-full">
      <div className="text-center mb-8 animate-slide-up">
        <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow shadow-lg">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">GitHub Pages Publisher</h1>
        <p className="text-base sm:text-lg text-gray-600">Upload HTML, CSS, and JavaScript files to create your website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 hover-scale">
          <div>
            <label htmlFor="repo-name" className="block text-sm font-medium text-gray-700 mb-1">
              Repository Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="repo-name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className={`block w-full px-4 py-2 sm:py-3 pr-10 rounded-lg border transition-all duration-200 ${
                  isNameAvailable === true
                    ? 'border-green-500 focus:ring-green-500'
                    : isNameAvailable === false
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500'
                } focus:border-indigo-500 focus:ring-2 focus:ring-opacity-50`}
                placeholder="my-awesome-website"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isCheckingName ? (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                ) : repoName && isNameAvailable !== null ? (
                  isNameAvailable ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )
                ) : null}
              </div>
            </div>
            {repoName && isNameAvailable === false && (
              <p className="mt-1.5 text-sm text-red-500 animate-fade-in">
                This repository name is already taken
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* HTML Upload */}
              <div className="relative">
                <input
                  type="file"
                  id="html-upload"
                  accept=".html"
                  onChange={(e) => handleFileUpload(e.target.files, 'html')}
                  className="sr-only"
                  multiple
                />
                <label
                  htmlFor="html-upload"
                  className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors duration-200 cursor-pointer text-center"
                >
                  <FileIcon className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                  <span className="block text-sm font-medium text-gray-700">Upload HTML</span>
                </label>
              </div>

              {/* CSS Upload */}
              <div className="relative">
                <input
                  type="file"
                  id="css-upload"
                  accept=".css"
                  onChange={(e) => handleFileUpload(e.target.files, 'css')}
                  className="sr-only"
                  multiple
                />
                <label
                  htmlFor="css-upload"
                  className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-200 cursor-pointer text-center"
                >
                  <FileIcon className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                  <span className="block text-sm font-medium text-gray-700">Upload CSS</span>
                </label>
              </div>

              {/* JavaScript Upload */}
              <div className="relative">
                <input
                  type="file"
                  id="js-upload"
                  accept=".js"
                  onChange={(e) => handleFileUpload(e.target.files, 'js')}
                  className="sr-only"
                  multiple
                />
                <label
                  htmlFor="js-upload"
                  className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 transition-colors duration-200 cursor-pointer text-center"
                >
                  <FileIcon className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                  <span className="block text-sm font-medium text-gray-700">Upload JS</span>
                </label>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h3>
                <div className="space-y-2">
                  {files.map((fileUpload, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <FileIcon className={`h-4 w-4 ${getFileIcon(fileUpload.type)}`} />
                        <span className="text-sm text-gray-600">{fileUpload.file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <span>{success}</span>
                {countdown !== null && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Timer className="h-4 w-4" />
                    <span>{countdown}s</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={files.length === 0 || !repoName || isLoading || !isNameAvailable}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Publishing...</span>
              </div>
            ) : (
              <span>Publish Website</span>
            )}
          </button>
        </div>
      </form>

      {/* Popup for website link */}
      {showLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full transform transition-all animate-fade-in shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Your Website is Ready! 🎉</h2>
            <p className="text-gray-600 mb-4">
              Your website is now online! If it's not accessible yet, please wait a minute:
            </p>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 rounded-lg text-indigo-600 font-medium hover:text-indigo-500 break-all hover:bg-gray-100 transition-colors duration-200"
            >
              {websiteUrl}
            </a>
            <button
              onClick={() => setShowLink(false)}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <p>Your website will be automatically published to GitHub Pages</p>
      </div>
    </div>
  );
}
