
/* global chrome */

import React, { useState } from 'react';

import './css/index.css';
import './css/tailwind_compiled.css'


const OptionsApp = () => {

    return (
        <div className="my-extension">
            <section className="">
                <section className="flex flex-col items-center text-center justify-center text-xl  m-auto mt-8">
                    <img className={"mb-4"} style={{ width: "50px" }}
                        // eslint-disable-next-line no-undef
                        src={chrome.runtime.getURL('static/assets/home_emoji.png')}
                        alt="Home emoji"
                    />
                    <div className='turtle-message'>
                        <h1 className='text-2xl'>Clean Air - Healthy Home</h1>


                    </div>
                </section>
            </section>
        </div>


    );
};

export default OptionsApp;
