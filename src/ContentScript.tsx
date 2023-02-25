/* global chrome */
import React, { useState } from 'react';

import { createPortal } from 'react-dom';
import { Map, Marker, Point, GeoJson, Overlay } from "pigeon-maps"

import './css/index.css';

const defaultCoors: Point = [37.69, -59.23];

function parseCoors(rawCoors: string) {
    let [lat, lon] = rawCoors.split("+");
    return [Number(lat), Number(lon)];
}


function AirHomeMap({ coords }: { coords: Point | null }) {



    const geoJsonSample = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: { type: "Point", coordinates: coords ? [coords[1], coords[0]] : coords },
                properties: { prop0: "value0" },
            },
        ],
    };



    // const geoJsonSample = {
    //     type: "FeatureCollection",
    //     features: [
    //       {
    //         type: "Feature",
    //         geometry: { type: "Point", coordinates: [2.0, 48.5] },
    //         properties: { prop0: "value0" },
    //       },
    //     ],
    //   };

    //    return (
    //       <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={4}>
    //         <GeoJson
    //           data={geoJsonSample}
    //           styleCallback={(feature : any, hover: boolean) => {
    //             if (feature.geometry.type === "LineString") {
    //               return { strokeWidth: "1", stroke: "black" };
    //             }
    //             return {
    //               fill: "#d4e6ec99",
    //               strokeWidth: "1",
    //               stroke: "white",
    //               r: "20",
    //             };
    //           }}
    //         />
    //       </Map>
    //     );
    if (coords) {
        return (
            <div style={{ width: "100%", height: "500px" }}>

                <Map height={500} defaultCenter={coords} defaultZoom={15}>


                    <GeoJson
                        data={geoJsonSample}
                        styleCallback={(feature: any, hover: boolean) => {
                            if (feature.geometry.type === "LineString") {
                                return { strokeWidth: "1", stroke: "black" };
                            }
                            return {
                                fill: "#ffa5005c",
                                strokeWidth: "1",
                                stroke: "red",
                                r: "200",
                            };
                        }}
                    />

                    <Marker width={50} anchor={coords} />
                    {/* <Overlay anchor={coords} offset={[120, 79]}>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Mocs%C3%A1ri_tekn%C5%91s_Kiserd%C5%91_2016.jpg/220px-Mocs%C3%A1ri_tekn%C5%91s_Kiserd%C5%91_2016.jpg' width={240} height={158} alt='' />
                    </Overlay> */}
                </Map>
            </div>);

    } else {
        return null;
    }

}

const ContentScriptApp = () => {

    let [coords, setCoords]: [Point | null, any] = useState(null);

    let mapComponent = document.querySelector("[data-testid='map-component']");
    if (mapComponent && mapComponent instanceof HTMLElement) {
        mapComponent.style.flexDirection = "column";
    }
    let map = document.querySelector("[data-testid='map']");
    if (map && map instanceof HTMLElement) {
        map.style.display = "none";
    }
    let d = document.createElement("div");
    React.useEffect(() => {
        let intervalId: any = null;

        // the geographic center of our map
        var zoomLevel = 13; // the map scale. See: http://wiki.openstreetmap.org/wiki/Zoom_levels


        intervalId = setInterval(() => {
            let satelliteButton = document.querySelector("[data-testid='satelite-button']");
            if (satelliteButton && satelliteButton instanceof HTMLAnchorElement) {

                let address = satelliteButton.href || "";
                let newCoords = parseCoors(address.split("loc:")[1]);
                // console.log(newCoords);
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
                    <div>
                        <p>

                            This property is in the area with dangerous air quality.
                        </p>
                        <p>
                            Typical values of N02 are 5-10 units.
                        </p>
                        <p>
                            Typical values of PM2.5 are 25-20 units.
                        </p>
                        <p>
                            To learn more visit website link.
                        </p>
                    </div>

                    <div>
                        The location is: {coords}
                    </div>


                    {mapComponent && coords ? createPortal(
                        <AirHomeMap coords={coords} />,
                        mapComponent
                    ) : null}


                </section>
            </section>
        </div>
    );
};

export default ContentScriptApp;
