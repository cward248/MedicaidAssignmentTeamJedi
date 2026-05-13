'use client';

<<<<<<< HEAD
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ApplyPage() {
=======
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/browser-client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

//Created by David Huling- Jedi

/**
 * 
 *  This page allows a user to submit their employment information
// and upload a pay stub. 
// The info is saved to Supabase database and the document is uploaded to Supabase storage
// 
 */

// User story: As a Medicaid applicant, I want to upload proof of my employment or participation in other qualifying programs so that I can receive medical support.

export default function ApplyPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient() as any, []);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: any } | null }) => {
      if (!data?.user) {
        router.replace('/email-password');
      } else {
        setCheckingAuth(false);
      }
    });
  }, []);

  // Applicant Information State
  const [applicantName, setApplicantName] = useState('');
  const [applicantAddress, setApplicantAddress] = useState('');
  const [applicantIdNumber, setApplicantIdNumber] = useState('');
  const [alternativePath, setAlternativePath] = useState('');
  const [hasDisability, setHasDisability] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  // Employment Information State
>>>>>>> 20d4ca8447d54bb772f23637cb35b9ac6f19b7cb
  const [employerName, setEmployerName] = useState('');
  const [employerTaxId, setEmployerTaxId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('Full-time');
  const [file, setFile] = useState<File | null>(null);

<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // ✅ FIXED SESSION HANDLING
  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth error:", error.message);
      }

      setCurrentUser(data.user ?? null);
      setSessionLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ FIXED SUBMIT (uses reliable user check)
=======
  const validateApplicantInfo = () => {
    if (!applicantName.match(/^[a-zA-Z\s]{2,100}$/)) {
      alert('Please enter a valid full name (letters and spaces only, 2-100 characters)');
      return false;
    }
    if (!applicantAddress.trim()) {
      alert('Please enter your address');
      return false;
    }
    return true;
  };

>>>>>>> 20d4ca8447d54bb772f23637cb35b9ac6f19b7cb
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

<<<<<<< HEAD
    if (sessionLoading) {
      alert("Please wait, checking session...");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be signed in to submit an application.");
      return;
    }

    try {
      setLoading(true);

      let uploadedFilePath = '';

      // Upload file if exists
=======
    if (!validateApplicantInfo()) {
      setLoading(false);
      return;
    }

    if (!employerTaxId.match(/^\d{2}-\d{7}$/)) {
      alert('Please enter a valid Employer Tax ID (EIN) in the format XX-XXXXXXX');
      setLoading(false);
      return;
    }

    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a PDF, JPEG, or PNG file.');
        setLoading(false);
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File is too large. Maximum size is 5MB.');
        setLoading(false);
        return;
      }
    }  
    
    try {
      let uploadedFilePath = '';

>>>>>>> 20d4ca8447d54bb772f23637cb35b9ac6f19b7cb
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;

        const { data, error: uploadError } = await supabase.storage
          .from('employment-proof')
          .upload(fileName, file);

<<<<<<< HEAD
        if (uploadError) throw uploadError;

=======
        if (uploadError) {
          if (uploadError.message.includes('permission')) {
            alert("Document Upload Failed: The server is currently unable to save your file. This is a temporary issue. Please wait 30 seconds and click 'Submit' again. If the problem continues, contact our help desk at (1) 800-JEDI.");
          } else if (uploadError.message.includes('network')) {
            alert("Connection Lost: We cannot reach the document server. Please check your internet connection and then click 'Retry' at the bottom of this page. Your progress has been saved.");
          } else {
            alert("An unexpected error occurred while uploading your document. Please try again. If this happens twice, call our support line.");
          }
          setLoading(false);
          return;
        }
>>>>>>> 20d4ca8447d54bb772f23637cb35b9ac6f19b7cb
        uploadedFilePath = data.path;
      }

      // Insert application
      const { error: dbError } = await supabase.from('applications').insert([
        {
          applicant_id: user.id,
          applicant_email: user.email,
          employer_name: employerName,
          employer_tax_id: employerTaxId,
          job_title: jobTitle,
          monthly_hours_worked: parseFloat(hours),
          employment_status: status,
          document_url: uploadedFilePath,
          verification_status: 'pending',
          applicant_name: applicantName,
          applicant_address: applicantAddress,
          applicant_id_number: applicantIdNumber,
          alternative_qualification_path: alternativePath || null,
          has_disability: hasDisability,
          is_student: isStudent
        }
      ]);

<<<<<<< HEAD
      if (dbError) throw dbError;

      alert("Success! Your application has been submitted.");

      // Optional reset
      setEmployerName('');
      setEmployerTaxId('');
      setJobTitle('');
      setHours('');
      setFile(null);

    } catch (error: any) {
=======
      if(dbError) throw dbError;
      alert("Success! Your application has been submitted.");

    } catch(error: any){
>>>>>>> 20d4ca8447d54bb772f23637cb35b9ac6f19b7cb
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col text-black font-bold">
        <Header />
        <main className="flex-grow p-10 flex justify-center">
          <p>Checking authentication...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-black font-bold">
      <Header />

      <main className="flex-grow p-10 flex justify-center">
<<<<<<< HEAD
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl border-t-8 border-blue-600">
          <h1 className="text-3xl text-center mb-6">Employment Form</h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Employer Name"
              className="w-full p-2 border rounded"
              required
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Employer Tax ID (EIN)"
              className="w-full p-2 border rounded"
              value={employerTaxId}
              onChange={(e) => setEmployerTaxId(e.target.value)}
            />

            <input
              type="text"
              placeholder="Job Title"
              className="w-full p-2 border rounded"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Hours Per Week"
              className="w-full p-2 border rounded"
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />

            <select
              className="w-full p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Full-time">Full time</option>
              <option value="Part-time">Part time</option>
              <option value="Self-employed">Self employed</option>
            </select>

            <input
              type="file"
              required
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded"
            >
              {loading ? "Sending..." : "Submit Application"}
            </button>
=======
        <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-xl border-t-8 border-blue-600">
          <h1 className="text-3xl text-center mb-6">Medicaid Application</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Applicant Information Section */}
            <div className="space-y-4 border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-black">Applicant Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-600">*</span>
                  <span className="text-xs text-gray-500 ml-2">(As it appears on your ID)</span>
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Residential Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  value={applicantAddress}
                  onChange={(e) => setApplicantAddress(e.target.value)}
                  placeholder="Street address, city, MO, zip code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Social Security Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  value={applicantIdNumber}
                  onChange={(e) => setApplicantIdNumber(e.target.value)}
                  placeholder="XXX-XX-XXXX"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your SSN is protected and will only be used for verification purposes
                </p>
              </div>
            </div>

            {/* Alternative Qualification Section */}
            <div className="space-y-4 border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-black">Alternative Qualification Paths</h2>
              <p className="text-sm text-gray-600">
                If you have a disability, are a student, or qualify through other means, you may not need to provide employment verification.
              </p>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasDisability}
                    onChange={(e) => setHasDisability(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-black">I have a disability that prevents full-time employment</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-black">I am a full-time student</span>
                </label>
                
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    If you qualify through another path, please explain:
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    rows={2}
                    value={alternativePath}
                    onChange={(e) => setAlternativePath(e.target.value)}
                    placeholder="e.g., participating in job training program, caring for a dependent, etc."
                  />
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-black">Employment Information</h2>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label htmlFor="employer-name">
                    Employer Name <span className="text-red-600">*</span>
                  </label>
                  <div className="group relative inline-block">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-black hover:bg-gray-300">
                      i
                    </span>
                    <div className="invisible absolute left-6 top-0 z-50 w-64 rounded-md bg-black p-2 text-xs text-white shadow-xl group-hover:visible">
                      Please provide the name of the company as it appears on tax documents
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  id="employer-name"
                  required
                  className="block w-full rounded-md border border-gray-300 p-2 text-black"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="tax-id">Employer Tax ID (EIN)</label>
                <input
                  type="text"
                  id="tax-id"
                  placeholder="XX-XXXXXXX"
                  className="block w-full rounded-md border border-gray-300 p-2 text-black"
                  value={employerTaxId}
                  onChange={(e) => setEmployerTaxId(e.target.value)}
                />
              </div>

              <div>
                <label>Job Title <span className="text-red-600">*</span></label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border rounded text-black"
                  onChange={(e) => setJobTitle(e.target.value)} 
                />
              </div>

              <div>
                <label>Hours Per Week <span className="text-red-600">*</span></label>
                <input 
                  type="number" 
                  required
                  className="w-full p-2 border rounded text-black"
                  onChange={(e) => setHours(e.target.value)} 
                />
              </div>

              <div>
                <label>Employment Status <span className="text-red-600">*</span></label>
                <select 
                  className="w-full p-2 border rounded text-black"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Full-time">Full time</option>
                  <option value="Part-time">Part time</option>
                  <option value="Self-employed">Self employed</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 border-2 border-dashed border-blue-200 rounded">
                <label className="block mb-2">
                  Upload Pay Stub (PDF or Image) <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  required
                  className="block w-full font-normal text-black"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
              >
                {loading ? 'Sending...' : 'Submit Application'}
              </button>
            </div>
>>>>>>> 20d4ca8447d54bb772f23637cb35b9ac6f19b7cb
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}