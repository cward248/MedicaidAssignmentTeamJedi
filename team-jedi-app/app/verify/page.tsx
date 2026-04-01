'use client';

// Calis Ward sprint 4

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Application {
  id: string;
  employer_name: string;
  job_title: string;
  monthly_hours_worked: number;
  employment_status: string;
  document_url: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  applicant_name?: string;
  employer_tax_id?: string;
}

export default function VerifyPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const verifyApplication = async (id: string, status: 'approved' | 'rejected') => {
    const updateData: any = { verification_status: status };
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id);

    if (error) {
      alert('Error updating application: ' + error.message);
    } else {
      alert(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      fetchPendingApplications();
      setSelectedApp(null);
      setRejectionReason('');
    }
  };

  const viewDocument = (url: string) => {
    const { data } = supabase.storage.from('employment-proof').getPublicUrl(url);
    window.open(data.publicUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">Verify Employment Applications</h1>
        <p className="mb-6 text-gray-600">
          Review pending applications and verify proof of employment for Medicaid applicants.
        </p>

        {/* Info hover tooltip example for teacher's note */}
        <div className="relative inline-block mb-6">
          <span 
            className="text-blue-600 cursor-help border-b border-dotted border-blue-600"
            onMouseEnter={() => setHoverInfo('Employer Tax ID is required for verification')}
            onMouseLeave={() => setHoverInfo(null)}
          >
            ⓘ How verification works
          </span>
          {hoverInfo && (
            <div className="absolute bg-gray-800 text-white p-2 rounded text-sm mt-1 z-10">
              {hoverInfo}
            </div>
          )}
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
            No pending applications to verify.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Applications List */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Pending Applications ({applications.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedApp?.id === app.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <p className="font-semibold">{app.employer_name}</p>
                    <p className="text-sm text-gray-600">{app.job_title}</p>
                    <p className="text-xs text-gray-400">
                      Submitted: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Detail View */}
            {selectedApp && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">Verify Application</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold">Employer Name:</label>
                    <p className="text-gray-700">{selectedApp.employer_name}</p>
                  </div>
                  
                  {/* Employer Tax ID - Added per teacher feedback */}
                  <div>
                    <label className="font-semibold">
                      Employer Tax ID:
                      <span 
                        className="text-blue-500 cursor-help ml-1"
                        onMouseEnter={() => setHoverInfo('Federal Employer Identification Number (EIN)')}
                        onMouseLeave={() => setHoverInfo(null)}
                      >
                        ⓘ
                      </span>
                    </label>
                    <p className="text-gray-700">
                      {selectedApp.employer_tax_id || 'Not provided - requires verification'}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold">Job Title:</label>
                    <p className="text-gray-700">{selectedApp.job_title}</p>
                  </div>

                  <div>
                    <label className="font-semibold">Hours Per Week:</label>
                    <p className="text-gray-700">{selectedApp.monthly_hours_worked}</p>
                  </div>

                  <div>
                    <label className="font-semibold">Employment Status:</label>
                    <p className="text-gray-700">{selectedApp.employment_status}</p>
                  </div>

                  <div>
                    <button
                      onClick={() => viewDocument(selectedApp.document_url)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      View Proof of Employment Document
                    </button>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-bold mb-2">Verification Decision</h3>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Rejection Reason (if applicable):
                      </label>
                      <textarea
                        className="w-full p-2 border rounded"
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this application is being rejected..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => verifyApplication(selectedApp.id, 'approved')}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => verifyApplication(selectedApp.id, 'rejected')}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// verify. TODO add tables to db