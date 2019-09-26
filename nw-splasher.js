const nwSplasher = {
  º: '%c',
  consoleNormal: 'font-family: sans-serif',
  consoleBold: '' +
    'font-family: sans-serif' +
    'font-weight: bold',
  consoleCode: '' +
    'background: #EEEEF6;' +
    'border: 1px solid #B2B0C1;' +
    'border-radius: 7px;' +
    'padding: 2px 8px 3px;' +
    'color: #5F5F5F;' +
    'line-height: 22px;' +
    'box-shadow: 0px 0px 1px 1px rgba(178,176,193,0.3)',
  validateUrl: function (url) {
    if (typeof(url) === 'string') {
      return url;
    }
    let fs = require('fs');
    files = fs.readdirSync('.');
    files = files.filter(function (file) {
      return file.endsWith('.html')
    });

    if (files.length) {
      url = files[0];
    }

    const defaults = [
      'app.html',
      'main.html',
      'default.html',
      'index.html',
    ];

    defaults.forEach(function (possibleFile) {
      if (files.includes(possibleFile)) {
        url = possibleFile;
      }
    });
    if (url) {
      return url;
    }
    return false;
  },
  validateNewWindowOptions: function (newWindowOptions) {
    if (!newWindowOptions || typeof(newWindowOptions) !== 'object' || Array.isArray(newWindowOptions)) {
      newWindowOptions = {};
    }

    // Needs to be a new instance so splash screen animations play smoothly
    newWindowOptions.new_instance = true;
    // hide the app window until it signals it is done loading
    newWindowOptions.show = false;

    return newWindowOptions;
  },
  validatePort: function (port) {
    if (typeof(port) !== 'number') {
      port = 4443;
    }
    return port;
  },
  /**
   * Used by your Splash screen window. This creates a websocket and spawns
   * your main app in a hidden window. Then waits for the app to send a signal
   * to the websocket to close the splash screen.
   *
   * All params are optional.
   *
   * @param  {string}    url              URL to load in the App window. Defaults to index.html, default.html, main.html, or app.html if those files exist, or the first html file it finds.
   * @param  {object}    newWindowOptions Object with the NW.js Window fields (height, width, frameless, etc)
   * @param  {number}    port             Defaults to 4443, must match the same port number used in the app window
   * @return {undefined}                  Returns nothing, just executes
   */
  loadAppWindowInBackground: function (url, newWindowOptions, port) {
    url = this.validateUrl(url);
    newWindowOptions = this.validateNewWindowOptions(newWindowOptions);
    port = this.validatePort(port);

    if (!url) {
      console.log(this.º + 'NW-Splasher: Could not find a valid path to load your app window.\n' +
        'Pass in url or filename to load in the app Window.', this.consoleNormal);
      console.log(this.º + 'Example:', this.consoleBold);
      console.log(this.º + 'nwSplasher.loadAppInBackground(\'index.html\');', this.consoleCode);
      return;
    }

    const net = require('net');
    const server = net.createServer(function (socket) {
      socket.write('Echo server');
      socket.pipe(socket);

      // Handle incoming messages app window
      socket.on('data', function (data) {
        if (data.toString() === 'loaded') {
          server.close();
          nw.Window.get().close(true);
        }
      });
    });

    server.listen(port, 'localhost');

    // Launch hidden app window and wait for it to signal to close the splasher window
    nw.Window.open(url, newWindowOptions);
  },
  /**
   * Call this from your App window when it is ready to be shown.
   * This will also trigger closing the Splash screen window.
   *
   * @param  {number}    port  Optional port number, defaults to 4443. Must match port number used in Splash window
   * @return {undefined}       Nothing is returned, this just runs a command.
   */
  closeSplashAndShowApp: function (port) {
    port = this.validatePort(port);

    const net = require('net');
    const client = new net.Socket();
    client.connect(port, 'localhost');

    client.write('loaded');
    nw.Window.get().show();
  }
};
