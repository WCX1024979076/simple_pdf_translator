const path = require('path');
const fs = require('fs');

let config = {};

function set_val(key: string, value) {
  config[key] = value;
}

function get_val(key: string) {
  return config[key];
}

function save(json_path) {
  // let json_path = path.join(process.cwd(), '/resources/config.json'); // process.cwd()即为路径
  fs.writeFile(json_path, JSON.stringify(config), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('ok');
    }
  })
}

function load(json_path) {
  // let json_path = path.join(process.cwd(), '/resources/config.json'); // process.cwd()即为路径
  try {
    let data = fs.readFileSync(json_path);
    if (data) {
      config = JSON.parse(data);
    }
  } catch (e) { }
}

function get_config() {
  return config;
}

export { set_val, get_val, save, load, get_config };