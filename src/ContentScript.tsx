/* global chrome */
import React, { useState } from 'react';

import { Map, Marker, Point } from "pigeon-maps"

import './css/index.css';

const defaultCoors: Point = [37.69, -59.23];

function parseCoors(rawCoors: string) {
    let [lat, lon] = rawCoors.split("+");
    return [Number(lat), Number(lon)];
}
const ContentScriptApp = () => {

    let [coords, setCoords]: [Point | null, any] = useState(null);

    React.useEffect(() => {
        let intervalId: any = null;

        // the geographic center of our map
        var zoomLevel = 13; // the map scale. See: http://wiki.openstreetmap.org/wiki/Zoom_levels

        let c = document.querySelector("[data-testid='map-component']")

        let d = document.createElement("div")

        intervalId = setInterval(() => {
            let satelliteButton = document.querySelector("[data-testid='satelite-button']");
            if (satelliteButton && satelliteButton instanceof HTMLAnchorElement) {

                let address = satelliteButton.href || "";
                let newCoords = parseCoors(address.split("loc:")[1]);
                console.log(newCoords);
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
                    <div id="map">

                    </div>

                    <div style={{ width: "200px", height: "200px" }}>

                        {coords ? (
                            <Map height={300} width={400} defaultCenter={coords} defaultZoom={15}>
                            <Marker width={50} anchor={coords} />
                        </Map>
                        ) : null}


                    </div>

                </section>
            </section>
        </div>
    );
};

export default ContentScriptApp;
