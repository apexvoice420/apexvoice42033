"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Lead } from '@/types';
import { db } from '@/lib/firebaseAdmin';
// Note: We cannot use firebaseAdmin (node) in client component.
// We need to use client SDK or call an API.
// Since we are building an importer, we should probably parse client side and then send batch to API or use Firestore Client SDK.
// For simplicity and security, let's parse here and send to a new API endpoint `/api/leads/import`.
// OR use client SDK if configured. 
// Given the "custom backend" requirement, let's use an API route for write operations to keep logic centralized?
// Or we can just write to Firestore directly if we had client SDK setup.
// I'll implementation a /api/leads/import endpoint to handle the saving. 

interface CsvImporterProps {
    onImportComplete?: () => void;
}

export default function CsvImporter({ onImportComplete }: CsvImporterProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        setIsUploading(true);
        setError(null);
        setSuccess(null);

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            setIsUploading(false);
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const leads: any[] = results.data.map((row: any) => ({
                        businessName: row.BusinessName || row.businessName || row.Name || row.name || 'Unknown',
                        phoneNumber: row.PhoneNumber || row.phoneNumber || row.Phone || row.phone,
                        city: row.City || row.city,
                        niche: row.Niche || row.niche || 'Imported',
                        website: row.Website || row.website,
                        notes: row.Notes || row.notes
                    })).filter(l => l.phoneNumber); // Must have phone

                    if (leads.length === 0) {
                        setError('No valid leads found in CSV. Ensure "PhoneNumber" column exists.');
                        setIsUploading(false);
                        return;
                    }

                    // Send to API
                    const response = await fetch('/api/leads/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leads }),
                    });

                    if (!response.ok) throw new Error('Failed to upload leads');

                    const data = await response.json();
                    setSuccess(`Successfully imported ${data.count} leads.`);
                    if (onImportComplete) onImportComplete();

                } catch (err: any) {
                    setError(err.message || 'Error processing file');
                } finally {
                    setIsUploading(false);
                }
            },
            error: (err) => {
                setError('Error parsing CSV: ' + err.message);
                setIsUploading(false);
            }
        });
    };

    return (
        <div className="w-full max-w-md p-4">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('csv-input')?.click()}
            >
                <input
                    type="file"
                    id="csv-input"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <p>Importing leads...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <Upload className="w-8 h-8 mb-2" />
                        <p className="font-semibold text-gray-700">Click to upload or drag and drop</p>
                        <p className="text-sm">CSV files only</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {success}
                </div>
            )}
        </div>
    );
}
