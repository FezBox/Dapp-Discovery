'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getDAppById } from '@/services/database';

interface PageProps {
  params: {
    id: string;
  };
}

export default function DAppPage({ params }: PageProps) {
  const [imageError, setImageError] = useState(false);
  const dapp = getDAppById(params.id);

  if (!dapp) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              DApp Not Found
            </h1>
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Create fallback logo from first letter of name
  const fallbackLogo = (
    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
      {dapp.name.charAt(0)}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              {imageError ? (
                fallbackLogo
              ) : (
                <div className="relative w-24 h-24">
                  <Image
                    src={`/logos/${dapp.id}.png`}
                    alt={`${dapp.name} logo`}
                    className="rounded-full"
                    width={96}
                    height={96}
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {dapp.name}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {dapp.categories?.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                  >
                    {category}
                  </span>
                ))}
              </div>
              {dapp.url && (
                <a
                  href={dapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          {dapp.description && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About
              </h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {dapp.description}
              </p>
            </div>
          )}

          {/* Networks */}
          {dapp.networks && dapp.networks.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Available Networks
              </h2>
              <div className="flex flex-wrap gap-2">
                {dapp.networks.map((network) => (
                  <span
                    key={network}
                    className="px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                  >
                    {network}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
