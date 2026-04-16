'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
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

export default function ApplyPage() {

    //variables for form input\
    //edited to adjust for Tax ID info
  const [employerName, setEmployerName] = useState('');
  const [employerTaxId, setEmployerTaxId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('Full-time');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  //function that runs when users submits form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {       //upload starts empty
      let uploadedFilePath = '';

        //Upload file to storage
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from('employment-proof')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        uploadedFilePath = data.path;
      }
            // Insert form data into the applications table


      const { error: dbError } = await supabase.from('applications').insert([
        {
          employer_name: employerName,
          employer_tax_id: employerTaxId,
          job_title: jobTitle,
          monthly_hours_worked: parseFloat(hours),
          employment_status: status,
          document_url: uploadedFilePath,
          verification_status: 'pending'
        }
      ]);

      if(dbError) throw dbError;
      //notify if submission was successful
      alert("Success! Your application has been submitted.");

    }catch(error: any){
      alert("Error: " + error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-black font-bold">
      <Header />
      
      <main className="flex-grow p-10 flex justify-center">
        <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-xl border-t-8 border-blue-600">
          <h1 className="text-3xl text-center mb-6">Employment Form</h1>
          {/*employment Form*/}
          <form onSubmit={handleSubmit} className="space-y-4">
        
            <div className="space-y-4">



              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label htmlFor="employer-name">
                    Employer Name <span className="text-red-600">*</span>
                  </label>

                  <div className="group relative inline-block">
                    <span
                      className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-black hover:bg-gray-300"
                      aria-hidden="true"
                    >
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
                  placeholder="e.g. Acme Corp"
                  className="block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                />
              </div>


              {/*added employer tax id input as suggested by teacher*/}
              <div className="flex flex-col gap-1">
                <label htmlFor="tax-id">

                  
                  Employer Tax ID (EIN)
                </label>
                <input
                  type="text"
                  id="tax-id"
                  placeholder="XX-XXXXXXX"
                  className="block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-describedby="tax-id-description"
                  value={employerTaxId}
                  onChange={(e) => setEmployerTaxId(e.target.value)}
                />
                <p id="tax-id-description" className="text-xs text-gray-500">
                  Use your 9-digit Employer Identification Number
                </p>
              </div>
            </div>

            <div>
                
              <label>
                Job Title <span className="text-red-600">*</span>
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded text-black"
                required
                onChange={(e) => setJobTitle(e.target.value)} 
              />
            </div>

            <div>
              <label>
                Hours Per Week <span className="text-red-600">*</span>
              </label>
              <input 
                type="number" 
                className="w-full p-2 border rounded text-black"
                required
                onChange={(e) => setHours(e.target.value)} 
              />
            </div>

            <div>
              <label>
                Employment Status <span className="text-red-600">*</span>
              </label>
              <select 
                className="w-full p-2 border rounded text-black"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Full-time">Full time</option>
                <option value="Part-time">Part time</option>
                <option value="Self-employed">Self employed</option>
              </select>
            </div>

                    {/* upload feature */}
            <div className="bg-blue-50 p-4 border-2 border-dashed border-blue-200 rounded">
  <label className="block mb-2">
    Upload Pay Stub (PDF or Image) <span className="text-red-600">*</span>
  </label>

  <input
    type="file"required className="block w-full font-normal text-black"
    onChange={(e) => e.target.files && setFile(e.target.files[0])}
  />
  {/*   ^ when a user clicks upload, the function returns a array of files, and grabs the first file in index*/}
</div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              {loading ? 'Sending...' : 'Submit Application'}
            </button>
            {/* If loading is happening, inform user that app is sending*/}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
