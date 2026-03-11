import React from "react";
// created by Alec Schulte
// This page works just as a filler page for the time being to test app routing and overall structure of the application. 

export const FillerPage: React.FC = () => {
    return (
        <div className="container mx-auto text-center">
            <h1 className="text-6xl font-bold p-16 mb-4 text-black">This is a filler page</h1>
            <p className="text-2xl text-gray-700 mb-4">This page is just a placeholder for future content.</p>
            <p className="text-2xl text-gray-700">Feel free to explore the rest of the site while we work on this page!</p>
        </div>
    );
}

export default FillerPage;
