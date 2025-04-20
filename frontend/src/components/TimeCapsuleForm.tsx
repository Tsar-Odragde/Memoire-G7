'use client';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';

export default function TimeCapsuleForm() {
  const { address } = useAccount();
  const [eventTitle, setEventTitle] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the submission logic
    console.log({
      eventTitle,
      unlockDate,
      recipientAddress,
      senderAddress: address
    });
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

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Time Capsule
      </button>
    </form>
  );
} 