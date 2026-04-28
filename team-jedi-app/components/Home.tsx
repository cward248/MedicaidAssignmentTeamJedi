import React from "react";

// created by Alec Schulte

// This will be the landing page for the medicaid application page. 

export const Home: React.FC = () => {
    return (
        <section className="home">
            <div className="container mx-auto text-center">
                <h1 className="text-6xl font-bold text-black">Welcome to Missouri Medicaid</h1>
                <div className="container mx-auto bg-white">
                    <h3 className="text-xl text-gray">Thinking of applying for medicaid?</h3>
                </div>
            </div>
        </section>
    )
}


/*
Due to work pc constraints I will outline what i can here and then apply this
once home at desktop. 

Welcome to Missouri Medicaid

How do I apply?

    To apply first you need to make an account and verify your email.
    Once verified login and you will see an option to submit application.
    To submit an application click on the submit application button and follow
    the instructions. 

What happens next?
    
    Once we reciveve your application our team will view your information.
    If everything looks good we will send you a confirmation with your benefits.
    If we are missing anything and cannot approve you at the time, we will reach
    out and notify you about anything missing we may need. 

Not sure what you need?

    You can click here(hyperlink to requirments page) or click the requirments tab
    for more information.
    Have a question? reach out to our support at (support email generic)
    or call us at (123-456-7890)



*/