import { app, BrowserWindow, ipcMain} from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    minWidth: 400,
    minHeight: 400,
    maxHeight: 400,
    maxWidth: 400
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const mosca = require("mosca");
const mqtt = require('mqtt')
const fs = require('fs');
let server;

// Listen for async message from renderer process
ipcMain.on('async', (event, arg) => {  

  switch (arg) {
    case 'turn-on':
      console.log('Turn on base station');
      startServer();
      break;
    case 'start':
      console.log('Start publishing');
      start();
      break;
    case 'stop':
      console.log('Stop publishing');
      stop();
      break;
    default:
      console.log(arg);
  }
});

function startServer() {
  server = new mosca.Server({
    http: {
      port: 3000,
      bundle: true,
      static: './'
    }
  });
}

let runSim = true;
let client;

function start() {
  runSim = true;
  client  = mqtt.connect('ws://localhost:3000')
  
  client.on('connect', function () {
      beginPublishing();
  });
     
  // var array = fs.readFileSync('boatData.csv').toString().split("\n");
  var array = fs.readFileSync(`${__dirname}/mixedPositions.csv`).toString().split("\n");
  var counter = 0;
  
  function beginPublishing () {
      if (counter < array.length && runSim) {
          client.publish('boats', array[counter])
          counter++
          setTimeout(beginPublishing(), 50)
      } else {
          counter = 0;
      }
  }
}

function stop() {
  runSim = false;
  client.end(true);
}2