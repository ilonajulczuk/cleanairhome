/* global chrome */
import React, { useState } from 'react';

import './css/index.css';


const ContentScriptApp = () => {

    let [coords, setCoords] = useState("");


    React.useEffect(() => {
        let intervalId: any = null;

        intervalId = setInterval(() => {
            let now = new Date();
            let satelliteButton = document.querySelector("[data-testid='satelite-button']");
            if (satelliteButton && satelliteButton instanceof HTMLAnchorElement) {

                let address = satelliteButton.href || "";
                let newCoords = address.split("loc:")[1];
                setCoords(newCoords);
            }

        }, 1000);


        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };

    }, []);

    return (
        <div className="air-extension">
            <section className="container">
                <section className="content air-data">
                    <img className={"mb-4"} style={{ width: "50px" }}
                        // eslint-disable-next-line no-undef
                        src={chrome.runtime.getURL('static/assets/home_emoji.png')}
                        alt="Home emoji"
                    />
                    <div>This is air data! {coords}</div>
                    <button className='air-data-button bg-green' onClick={() => console.log("data")}>Data</button>

                </section>
            </section>
        </div>
    );
};

export default ContentScriptApp;
