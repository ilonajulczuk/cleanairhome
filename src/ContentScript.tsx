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

const levelToColor = {
    1: "#99d35c5c",
    2: "#15b45f5c",
    3: "#318e5b5c",
    4: "#fffa105c",
    5: "#ffc30f5c",
    6: "#e4791e5c",
    7: "#ff2d0e5c",
    8: "#c7321e5c",
    9: "#791a145c",
    10: "#7031a05c",

}

function PM25ValueToLevel(value: number) {

    if (value < 11) {
        return 1;
    } else if (value < 23) {
        return 2;
    } else if (value < 35) {
        return 3;
    } else if (value < 41) {
        return 4;
    } else if (value < 47) {
        return 5;
    } else if (value < 53) {
        return 6;
    } else if (value < 58) {
        return 8;
    } else if (value < 64) {
        return 8;
    } else if (value < 70) {
        return 9;
    } else {
        return 10;
    }
}

function NO2ValueToLevel(value: number) {
    if (value < 67) {
        return 1;
    } else if (value < 134) {
        return 2;
    } else if (value < 200) {
        return 3;
    } else if (value < 267) {
        return 4;
    } else if (value < 334) {
        return 5;
    } else if (value < 400) {
        return 6;
    } else if (value < 467) {
        return 8;
    } else if (value < 534) {
        return 8;
    } else if (value < 600) {
        return 9;
    } else {
        return 10;
    }
}

function PM25ValToColor(value: number) {
    return levelToColor[PM25ValueToLevel(value)];
}

function N02ValToColor(value: number) {
    return levelToColor[NO2ValueToLevel(value)];
}

function AirHomeMap({ coords }: { coords: Point | null }) {

    const geoJsonSample = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: { type: "Point", coordinates: coords ? [coords[1], coords[0]] : coords },
                properties: { pm25: 68 },
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
                                fill: feature.properties.pm25 ? PM25ValToColor(feature.properties.pm25) : "#ffa5005c",
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
                <section className="content air-data flex flex-col gap-4">
                    <img className={"mb-4"} style={{ width: "50px" }}
                        // eslint-disable-next-line no-undef
                        src={chrome.runtime.getURL('static/assets/home_emoji.png')}
                        alt="Home emoji"
                    />
                    <div className='flex flex-col gap-4'>
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
                            To learn more visit <a className="underline" href='https://airquality.ie/information/air-quality-index-for-health'>airquality.ie</a>
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
