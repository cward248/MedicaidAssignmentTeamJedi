'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Employer verification portal
 *
 * to allow an employer to confirm employment details for pending
 * medicaid applications and filtered by employer name and tax ID
 * 
 */
interface Application {
  id: string;
  employer_name: string;
  employer_tax_id: string;
  job_title: string;
  monthly_hours_worked: number;
  employment_status: string;


  verification_status: 'pending' | 'approved' | 'rejected';
  employer_verified?: boolean;
  employer_notes?: string;
}

export default function EmployerVerifyPage(){

  const searchParams = useSearchParams();
  const employerName = searchParams.get('employer');
  const taxId = searchParams.get('taxId');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {

    if(employerName && taxId){
      fetchApplications();
    }
  }, [employerName, taxId]);

  //fetch pending apps for the current employer using URL params
  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('employer_name', employerName)
      .eq('employer_tax_id', taxId)
      .eq('verification_status', 'pending');

    if(error){
      console.error('error fetching applications:', error);
    }else{
      setApplications(data || []);
    }
    setLoading(false);
  };

  //update the app record with employer verify results
  const confirmVerification = async (id: string, confirmed: boolean) => {
    const updateData: any = { employer_verified: confirmed };
    if(notes) {
      updateData.employer_notes = notes;
    }
    updateData.employer_verification_date = new Date().toISOString();

    const { error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id);

    if(error){
      alert('Error updating application: ' + error.message);
    }else{
      alert(`Verification ${confirmed ? 'confirmed' : 'not confirmed'} successfully!`);
      setApplications((current) =>
        current.filter((app) => app.id !== id)
      );
      setSelectedApp(null);
      setNotes('');
    }
  };

  // If query params are missing show error screen
  if (!employerName || !taxId) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow p-10 text-center">
          <h1 className="text-3xl font-bold mb-6 text-black">Invalid Access</h1>
          <p>Please use the link provided byMedicaid office</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="flex-grow p-10">
        <h1 className="text-3xl font-bold mb-6 text-black">Employer Verification Portal</h1>
        <p className="mb-6 text-gray-600">
          Review and confirm employment details for applicants from {employerName}.
        </p>

        {/* application list UI shows loading, empty or show pending apps */}
        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No pending applications</p>
        ): (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-md text-black">
                <h2 className="text-xl font-semibold mb-2 text-black">{app.job_title}</h2>
                <p className="text-black"><strong>Hours Worked:</strong> {app.monthly_hours_worked}</p>
                <p className="text-black"><strong>Status:</strong> {app.employment_status}</p>
                <button
                  onClick={() => setSelectedApp(app)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  aria-label={`Verify application for ${app.job_title}`}
                >
                  Verify Details
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedApp &&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-black">
              <h2 className="text-xl font-semibold mb-4 text-black">Confirm Verification</h2>
              <p className="mb-4 text-black">
                <strong>Job:</strong> {selectedApp.job_title}<br />
                <strong>Hours:</strong> {selectedApp.monthly_hours_worked}<br />
                <strong>Status:</strong> {selectedApp.employment_status}
              </p>
              <label htmlFor="notes" className="block mb-2 text-black">Notes (optional):</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded text-black mb-4"
                aria-describedby="notes-description"
              />
              <p id="notes-description" className="text-xs text-gray-500 mb-4">
                Add comments about the employment details
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => confirmVerification(selectedApp.id, true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  aria-label="Confirm employment details"
                >
                  Confirm
                </button>
                <button
                  onClick={() => confirmVerification(selectedApp.id, false)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  aria-label="Do not confirm employment details"
                >
                  Dont Confirm
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  aria-label="Cancel verification"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}