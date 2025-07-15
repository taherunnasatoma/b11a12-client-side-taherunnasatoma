import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div>
             <Helmet>
                <title>Home | Lifenix</title>
                <meta name="description" content="Lifenix — your trusted platform for medicine and healthcare products." />
            </Helmet>
           This is home 
        </div>
    );
};

export default Home;