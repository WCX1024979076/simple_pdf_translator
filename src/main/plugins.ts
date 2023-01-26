const path = require("path");
const fs = require("fs");

let cxt_array = {};
let mainWindow_plugins = null;
let config_plugins = null;

async function plugins_load(mainWindow, config) {
  if (!mainWindow_plugins)
    mainWindow_plugins = mainWindow;
  else
    mainWindow = mainWindow_plugins;

  if (!config_plugins)
    config_plugins = config;
  else
    config = config_plugins;

  let dirPath = config.get_val("plugins_path");
  let files = fs.readdirSync(dirPath);
  let ctx_main = {
    "log": (log) => {
      console.log(log);
    },
    "getConfig": (key) => {
      return config.get_val(key);
    },
    "setConfig": (key, val) => {
      config.set_val(key, val);
    },
    "finishTranslate": (translate_str) => {
      mainWindow.webContents.send('finish_translate', translate_str);
    }
  };
  for (let filename of files) {
    const filepath = path.join(dirPath, filename);
    try {
      if (filepath.substr(filepath.length - 3, 3) != ".js")
        continue;
    }
    catch (e) {
      continue;
    }

    let stats = fs.statSync(filepath);
    if (stats.isFile()) {
      try {
        const ctx = require(filepath.substr(0, filepath.length - 3) + ".js");
        let ctx_plugins = ctx.app(ctx_main);// @ts-ignore.
        ctx_plugins.TranslateRegister();
        cxt_array[ctx_plugins.TranslateName] = ctx_plugins;
      } catch (e) {
        console.log(e);
      }
    }
  }
}

function plugins_translate(translate_mechine, translate_str) {
  cxt_array[translate_mechine].TranslateFunction(translate_str);
}

function plugins_config(translate_mechine) {
  return cxt_array[translate_mechine].TranslateConfig;
}

function plugins_reload(translate_mechine) {
  cxt_array = {};
  plugins_load(null, null);
}

function plugins_get_config() {
  var config: any[] = [];
  for (var t of Object.keys(cxt_array)) {
    config.push({ label: cxt_array[t].TranslateZhName, value: t });
  }
  return config;
}

export { plugins_load, plugins_translate, plugins_config, plugins_reload, plugins_get_config };