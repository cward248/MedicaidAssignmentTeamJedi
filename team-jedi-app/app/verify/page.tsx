'use client';

// Calis Ward sprint 4
// Alec Schulte Final Presentation Edits

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/browser-client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateEmployerLink } from '@/lib/employerUtils';

interface Application {
  id: string;
  applicant_id_number: string;
  employer_name: string;
  job_title: string;
  monthly_hours_worked: number;
  employment_status: string;
  document_url: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  applicant_name?: string;
  employer_tax_id?: string;
  employer_verified?: boolean;
}

export default function VerifyPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient() as any, []);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [preVerifiedApplicants, setPreVerifiedApplicants] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: any } | null }) => {
      if (!data?.user) {
        router.replace('/email-password');
      } else {
        setCheckingAuth(false);
        fetchPendingApplications();
        fetchPreVerifiedApplicants();
      }
    });
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

  const fetchPreVerifiedApplicants = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('verification_status', 'pre_verified');
    
    if (!error && data) {
      setPreVerifiedApplicants(data);
    }
  };

  const verifyApplication = async (id: string, status: 'approved' | 'rejected') => {
    const updateData: any = { verification_status: status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('supabase error:', error);
      alert('Error updating app: ' + error.message);
      return;
    }

    if (!data) {
      alert('The application update did not return a valid record. Please try again.');
      return;
    }

    alert(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      await supabase.from('notifications').insert({
        user_id: currentUser.id,
        message: `Your application has been ${status}.`,
        type: status === 'approved' ? 'success' : 'warning',
        read: false
      });
    }

    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id)
    );
    setSelectedApp(null);
    setRejectionReason('');
    fetchPreVerifiedApplicants();
  };

  const viewDocument = (url: string) => {
    const { data } = supabase.storage.from('employment-proof').getPublicUrl(url);
    window.open(data.publicUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="p-10">
        {checkingAuth ? (
          <p>Checking authentication...</p>
        ) : (
        <>
        <h1 className="text-3xl font-bold mb-6 text-black">Verify Employment Applications</h1>
        <p className="mb-6 text-gray-600">
          Review pending applications and verify proof of employment for Medicaid applicants.
        </p>

        {/* Pre-verified Applicants Notification */}
        {preVerifiedApplicants.length > 0 && (
          <div className="bg-green-50 border border-green-400 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-semibold mb-2">✨ Pre-Verified Applicants</h3>
            <p className="text-green-700 mb-3">
              The following applicants have been automatically verified through Missouri tax records 
              and do not require additional employment verification.
            </p>
            <div className="space-y-2">
              {preVerifiedApplicants.map(app => (
                <div key={app.id} className="bg-white p-3 rounded border border-green-200">
                  <p><strong>{app.applicant_name || 'Applicant'}</strong> - Employment already verified by MO tax records</p>
                  <button
                    onClick={() => verifyApplication(app.id, 'approved')}
                    className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm"
                  >
                    Confirm Approval
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info hover tooltip */}
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
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Applications List */}
            <div className="bg-white rounded-lg shadow p-4 text-black">
              <h2 className="text-xl font-bold mb-4 text-black">Pending Applications ({applications.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from('applications')
                        .select('*')
                        .eq('applicant_id_number', app.applicant_id_number)
                        .order('created_at', { ascending: false });

                      if (error) {
                        console.error('Error loading related applications:', error);
                        return;
                      }

                      if (data && data.length > 0) {
                        setSelectedApp(data[0]);
                      }
                    }}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedApp?.id === app.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <p className="font-semibold text-black">{app.employer_name}</p>
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
              <div className="bg-white rounded-lg shadow p-4 text-black">
                <h2 className="text-xl font-bold mb-4 text-black">Verify Application</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-black">Applicant Name:</label>
                    <p className="text-gray-700">{selectedApp.applicant_name || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-black">Employer Name:</label>
                    <p className="text-gray-700">{selectedApp.employer_name}</p>
                  </div>
                  
                  <div>
                    <label className="font-semibold text-black">
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
                    <label className="font-semibold text-black">Job Title:</label>
                    <p className="text-gray-700">{selectedApp.job_title}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-black">Hours Per Week:</label>
                    <p className="text-gray-700">{selectedApp.monthly_hours_worked}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-black">Employment Status:</label>
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

                  <div>
                    <button
                      onClick={() => {
                        const link = generateEmployerLink(selectedApp.id);
                        window.open(link, '_blank');
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-2"
                    >
                      Request Employer Confirmation
                    </button>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-bold mb-2 text-black">Verification Decision</h3>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1 text-black">
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

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3 flex-wrap">
                        {selectedApp.employer_verified ? (
                          <button
                            onClick={() => verifyApplication(selectedApp.id, 'approved')}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                        ) : (
                          <p className="text-yellow-600 font-semibold">Employer verification is still pending before approval.</p>
                        )}
                        <button
                          onClick={() => verifyApplication(selectedApp.id, 'rejected')}
                          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                      {!selectedApp.employer_verified && (
                        <p className="text-gray-600 text-sm">
                          You may reject this application now, but approval is blocked until the employer confirms the applicant's employment details.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </>
        )}
      </main>

      <Footer />
    </div>
  );
}