'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [subdomains, setSubdomains] = useState<string[]>([]);
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [uniqueOnly, setUniqueOnly] = useState<boolean>(false);

  const extractSubdomains = () => {
    const regex = /\*\.[\w-]+\.\w+/g;
    let matches = (inputText.match(regex) || []) as string[];

    matches = uniqueOnly ? Array.from(new Set(matches)) : matches;

    if (filterKeyword) {
      matches = matches.filter((subdomain) => subdomain.includes(filterKeyword));
    }

    setSubdomains(matches);
  };

  const copyToClipboard = () => {
    const textToCopy = subdomains.join('\n');
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success('Copied to clipboard!', { position: 'top-center' }))
      .catch(() => toast.error('Failed to copy!', { position: 'top-center' }));
  };

  const downloadCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,${subdomains.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'extracted_subdomains.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded!', { position: 'top-center' });
  };

  const downloadTXT = () => {
    const txtContent = `data:text/plain;charset=utf-8,${subdomains.join('\n')}`;
    const encodedUri = encodeURI(txtContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'extracted_subdomains.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('TXT downloaded!', { position: 'top-center' });
  };

  return (
    <div className="container mx-auto p-6 text-white bg-gray-900 rounded-lg">
      <div className="text-center mb-8">
        <Image src="./logo.png" alt="Logo" width={100} height={100} className="mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Subdomain Extractor</h1>
        <p className="text-gray-300">A tool for extracting and managing subdomains for bug bounty researchers</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Input Text</h2>
        <textarea
          className="w-full p-4 mb-4 rounded-md bg-gray-700 text-white"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="Paste your text here..."
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={uniqueOnly}
            onChange={(e) => setUniqueOnly(e.target.checked)}
            id="uniqueOnlyCheck"
          />
          <label className="text-gray-300" htmlFor="uniqueOnlyCheck">Unique Subdomains Only</label>
        </div>
        <input
          type="text"
          className="w-full p-4 mb-4 rounded-md bg-gray-700 text-white"
          placeholder="Filter by keyword (e.g., 'admin')"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
        />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md" onClick={extractSubdomains}>
          Extract Subdomains
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Extracted Subdomains</h2>
        <pre className="bg-gray-700 p-4 rounded-md max-h-56 overflow-y-auto">
          {subdomains.join('\n') || "No subdomains extracted yet."}
        </pre>

        <div className="flex justify-between mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md" onClick={copyToClipboard}>
            Copy to Clipboard
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={downloadCSV}>
            Download as CSV
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={downloadTXT}>
            Download as TXT
          </button>
        </div>
      </div>

      <div className="text-center mt-8 text-gray-400">
        <p>Made by <strong>Jatin Singh Tomar</strong></p>
        <p>This tool helps bug bounty researchers quickly extract and manage subdomains from data.</p>
      </div>

      <ToastContainer />
    </div>
  );
}
