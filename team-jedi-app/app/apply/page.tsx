'use client';

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ApplyPage() {
  const [employerName, setEmployerName] = useState('');
  const [employerTaxId, setEmployerTaxId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('Full-time');
  const [file, setFile] = useState<File | null>(null);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;

        const { data, error: uploadError } = await supabase.storage
          .from('employment-proof')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

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
          verification_status: 'pending'
        }
      ]);

      if (dbError) throw dbError;

      alert("Success! Your application has been submitted.");

      // Optional reset
      setEmployerName('');
      setEmployerTaxId('');
      setJobTitle('');
      setHours('');
      setFile(null);

    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-black font-bold">
      <Header />

      <main className="flex-grow p-10 flex justify-center">
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
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}