import React from "react";

export const RequirmentsPage: React.FC = () => {
  return (
    <section className="home" id="home">
        <div className="container mx-auto text-center">
            <h1 className="text-6xl font-bold p-16 mb-4">Missouri Medicade Program Requirments</h1>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Basic Eligibility</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>Must be a resident of Missouri</li>
                    <li>Must be a U.S. citizen or qualified non-citizen</li>
                    <li>Must meet income and resource limits</li>
                </ul>
            </div>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Employment Requirments</h2>
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
    </section>
  );
}   

export default RequirmentsPage;