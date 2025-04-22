'use client';
import React from 'react';
import WalletConnect from '../components/WalletConnect';
import TimeCapsuleForm from '../components/TimeCapsuleForm';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Memoire</h1>
          <Link 
            href="/images"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Images
          </Link>
        </div>
        <p className="text-center mb-8">A Decentralized Time Capsule on EVM</p>
        
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <WalletConnect />
          <div className="mt-8">
            <TimeCapsuleForm />
          </div>
        </div>
      </div>
    </main>
  );
}
