import { app, BrowserWindow, ipcMain, session, ipcRenderer, protocol, Menu, dialog, shell} from 'electron';
import { join } from 'path';
const fs = require('fs');
const url = require('url')
import { plugins_load, plugins_translate, plugins_config, plugins_reload, plugins_get_config} from './plugins';
const config = require("./config");

let config_path = join(app.getPath('userData'), 'resouce', 'config.json');
let plugins_path = join(app.getAppPath(), 'plugins');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  
  try{
    fs.mkdirSync(join(app.getPath('userData'), 'resouce'));
  } catch(e) {}
  config.load(config_path);
  config.set_val("plugins_path", plugins_path);
  // config.set_val("plugins_path", plugins_path);
  plugins_load(mainWindow, config);

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools()  // 打开控制台
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }

  mainWindow.webContents.on('will-navigate', function (e, url) {
      e.preventDefault();
      console.log(url);
      const mainWindow2 = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: join(__dirname, 'preload.js'),
          nodeIntegration: false,
          contextIsolation: true,
        }
      });
      mainWindow2.loadURL(url);
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: "文件",
    submenu: [
      { label: "新建", accelerator: "ctrl+n", click: () => { console.log("新建文件") } },
      {
        label: '打开', accelerator: "ctrl+o", click: () => {
          console.log("打开文件");
          dialog.showOpenDialog({
            title: '打开PDF',
            filters: [
              { name: 'pdf', extensions: ['pdf'] },
              { name: 'All', extensions: ['*'] },
            ],
            buttonLabel: '打开'
          }).then((res) => {
            if(res.filePaths[0] && res.filePaths[0] != undefined) {
              mainWindow.webContents.send('update_file', res.filePaths[0]);
            }
          }).catch((err) => {
            console.log(err.toString());
          });
        }
      },
    ]
  }, {
    label: "编辑",
    submenu: [
      // role按角色进行配置
      { label: "复制", role: "copy", click: () => { console.log("复制文件") } },
      { label: "粘贴", role: "paste", click: () => { console.log("粘贴文件") } }
    ]
  }
  ]))
}

app.whenReady().then(() => {
  protocol.registerStreamProtocol('pdf', (request, callback) => {
    const filePath = url.fileURLToPath('file://' + request.url.slice('pdf://'.length));
    console.log(filePath);
    callback(fs.createReadStream(filePath))
  })

  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  config.save(config_path);
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.handle('translate', async (_, translate_mechine, translate_str) => {
  plugins_translate(translate_mechine, translate_str);
})

ipcMain.handle('get_config', (_, translate_mechine) => {
  return {
    configList: plugins_config(translate_mechine),
    ruleForm: config.get_val(translate_mechine)
  }
})

ipcMain.handle('set_config', (_, translate_mechine, ruleForm) => {
  config.set_val(translate_mechine, ruleForm);
  plugins_reload(translate_mechine);
})

ipcMain.handle('get_plugins_config', (_) => {
  return plugins_get_config();
})