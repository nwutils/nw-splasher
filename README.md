# NW-Splasher

Small library to show a splash screen until main application loads.

The splash screen will run in a separate process so any animations will play smoothly while the app is loading.


* * *


## Demo

Here is a demo projec that uses the `nw-splasher.js` and `nw-splasher.css` files:

* https://github.com/nwutils/nw-splash-screen-example


* * *


## Usage

1. `npm install --save nw-splasher`
1. Create a `splash.html` file and an `index.html` file (for your app)
  * Add this line to the `<head>` of both files.
  * `<script src="node_modules/nw-splasher/nw-splasher.js"></script>`
1. In `package.json` set `"main": "splash.html"`
1. In the `splash.html` run `nwSplasher.loadAppWindowInBackground()`
1. In the `index.html` run `nwSplasher.closeSplashAndShowApp()` after the app is done loading and ready to be displayed


## API

`nwSplasher.loadAppWindowInBackground(url, newWindowOptions, port)`

Used by your Splash screen window. This creates a websocket and spawns your main app in a hidden window. Then waits for the app to send a signal to the websocket to close the splash screen.

Argument           | Optional | Type   | Description                    | Defaults
:--                | :--      | :--    | :--                            | :--
`url`              | yes      | String | URL to load in the App window. | Defaults to `index.html`, `default.html`, `main.html`, or `app.html` if those files exist, or the first html file it finds in the current directory. Console logs if no html file found.
`newWindowOptions` | yes      | Object | Object with the [NW.js Window Subfields](http://docs.nwjs.io/en/latest/References/Manifest%20Format/#window-subfields). | `show` is always set to `false`. `new_instance` is always set to `true`.
`port`             | yes      | Number | If you pass in a number it must match the same port number passed in the app window. | Defaults to 4443.


`nwSplasher.closeSplashAndShowApp(port)`

Call this from your App window when it is ready to be shown. This will also trigger closing the Splash screen window.

Argument | Optional | Type   | Description                                                                             | Defaults
:--      | :--      | :--    | :--                                                                                     | :--
`port`   | yes      | Number | If you pass in a number it must match the same port number passed in the splash window. | Defaults to 4443.
