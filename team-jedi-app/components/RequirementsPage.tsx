import React from "react";

export const RequirementsPage: React.FC = () => {
  return (
    <section className="home" id="home">
        <div className="container mx-auto text-center">
            <h1 className="text-6xl font-bold p-16 mb-4">Missouri Medicaid Program Requirements</h1>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Basic Eligibility</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>Must be a resident of Missouri</li>
                    <li>Must be a U.S. citizen or qualified non-citizen</li>
                    <li>Must meet income and resource limits</li>
                </ul>
            </div>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Employment Requirements</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>Recent pay stubs within the last 30 days</li>
                    <li>Employer contact information</li>
                    <li>Hours worked per week</li>
                    <li>Self-employment documentation (if applicable)</li>
                </ul>
            </div>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Documents You May Need</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>Government-issued ID</li>
                    <li>Social Security Number</li>
                    <li>Proof of Missouri residency (e.g., utility bill, lease agreement)</li>
                    <li>Proof of income (e.g., pay stubs, tax returns)</li>
                    <li>Employer verification form (if requested)</li>
                </ul>
            </div>
            
        </div>
    <div className="flex justify-center gap-6 mt-10 pb-12">
        <button className="bg-gray-600 text-white font-bold py-3 px-10 rounded-full transition shadow-lg">
            Back
        </button>

        <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-full transition shadow-lg">
            Submit
        </button>
    </div>



    </section>
  );
}   

export default RequirementsPage;