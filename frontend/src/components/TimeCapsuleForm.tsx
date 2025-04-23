'use client';
import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import Image from 'next/image';

export default function TimeCapsuleForm() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [eventTitle, setEventTitle] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return alert('Please select an image');

    const formData = new FormData();
    formData.append('name', eventTitle);
    const dateObj = new Date(unlockDate);
    formData.append('lockTime', dateObj.toISOString());    
    formData.append('files', selectedImage);

    //console.log('unlockDate:', unlockDate);
    //console.log('toISOString:', new Date(unlockDate).toISOString());

    try {
      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      const { txRequest } = await res.json();

      const txHash = await writeContractAsync({
        ...txRequest,
        account: address,
      });

      console.log('✅ Vault created, txHash:', txHash);
    } catch (err) {
      console.error('❌ Failed to create vault:', err);
      alert('Vault creation failed. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          id="eventTitle"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="unlockDate" className="block text-sm font-medium text-gray-700">
          Unlock Date
        </label>
        <input
          type="datetime-local"
          id="unlockDate"
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700">
          Recipient Address
        </label>
        <input
          type="text"
          id="recipientAddress"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="0x..."
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        {previewUrl && (
          <div className="mt-2">
            <Image
              src={previewUrl}
              alt="Preview"
              width={128}
              height={128}
              className="object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Time Capsule
      </button>
    </form>
  );
} 