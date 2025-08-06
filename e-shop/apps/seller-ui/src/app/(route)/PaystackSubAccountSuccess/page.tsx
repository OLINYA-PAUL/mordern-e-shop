'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Copy, ExternalLink, ArrowRight } from 'lucide-react';

const PaystackSubAccountSuccess = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [subAccountDetails, setSubAccountDetails] = useState({
    businessName: '',
    subAccountCode: '',
    accountNumber: '',
    bankName: '',
    settlementBank: '',
    percentageCharge: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Read from sessionStorage instead of URL params
    const dataString = sessionStorage.getItem('paystackSubAccount');
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        setSubAccountDetails({
          businessName: data.businessName || '',
          subAccountCode: data.subAccountCode || '',
          accountNumber: data.accountNumber || '',
          bankName: data.bankName || '',
          settlementBank: data.bankName || '',
          percentageCharge: '10%',
        });
      } catch {
        // fallback or handle error
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // ... rest of your component (copyToClipboard, CopyButton, UI) unchanged, but remove useSearchParams usage

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition duration-150"
      title={`Copy ${field}`}
      type="button"
    >
      <Copy className="w-3 h-3" />
      {copiedField === field ? 'Copied!' : 'Copy'}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white flex items-center justify-center p-1">
      <div
        className={`w-full max-w-sm bg-white rounded-lg  border border-gray-100 transform transition-all duration-500 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-2 opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="text-center px-4 pt-4 pb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full mb-2">
            <CheckCircle className="w-7 h-7 text-emerald-600 animate-pulse" />
          </div>

          <h1 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
            Sub Account Connected!
          </h1>
          <p className="text-gray-600 text-[11px] leading-snug">
            Your Paystack sub account is integrated and ready.
          </p>
        </div>

        {/* Details */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-md p-3 mb-3 text-[12px]">
            <h2 className="flex items-center gap-1 font-semibold text-gray-900 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
              Account Details
            </h2>

            <div className="space-y-1">
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-600 font-medium">Business Name</span>
                <span className="text-gray-900 font-semibold truncate max-w-[55%]">
                  {subAccountDetails.businessName}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-600 font-medium">
                  Sub Account Code
                </span>
                <div className="flex items-center gap-1 max-w-[55%]">
                  <code className="bg-gray-200 px-1 rounded font-mono truncate text-[11px]">
                    {subAccountDetails.subAccountCode}
                  </code>
                  <CopyButton
                    text={subAccountDetails.subAccountCode}
                    field="subAccountCode"
                  />
                </div>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-600 font-medium">
                  Account Number
                </span>
                <div className="flex items-center gap-1 max-w-[55%]">
                  <span className="text-gray-900 font-semibold truncate">
                    {subAccountDetails.accountNumber}
                  </span>
                  <CopyButton
                    text={subAccountDetails.accountNumber}
                    field="accountNumber"
                  />
                </div>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-600 font-medium">
                  Settlement Bank
                </span>
                <span className="text-gray-900 font-semibold truncate max-w-[55%]">
                  {subAccountDetails.settlementBank}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Commission</span>
                <span className="text-gray-900 font-semibold">
                  {subAccountDetails.percentageCharge}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 text-xs">
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 rounded-md flex items-center justify-center gap-1 transition-transform duration-150 hover:scale-105">
              Continue to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md text-[10px] text-blue-900">
            <div className="flex items-start gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0 inline-block"></span>
              <div>
                <h3 className="font-semibold mb-1 text-blue-900 leading-tight">
                  What's Next?
                </h3>
                <p className="leading-snug text-blue-800">
                  Your sub account is active. Start processing payments now.
                  Settlements go to your bank per schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackSubAccountSuccess;
