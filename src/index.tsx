/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';

import ContentScriptApp from './ContentScript';


if (window.location.href === chrome.runtime.getURL('index.html')) {
    const extension = document.createElement('div');
    extension.id = 'my-chrome-extension';
    document.body.appendChild(extension);

    const OptionsApp = React.lazy(() => import('./options'), );
    ReactDOM.render(
        <React.StrictMode>
            <React.Suspense fallback={"Loading..."}>

            <OptionsApp />
            </React.Suspense>
        </React.StrictMode>,
        extension
    );

}
else {
    const extension = document.createElement('div');
    extension.id = 'my-chrome-extension';
    document.body.appendChild(extension);
    ReactDOM.render(
        <React.StrictMode>
            <ContentScriptApp />
        </React.StrictMode>,
        extension
    );
}


