const fs = require('fs');

let config = {};

function set_val(key: string, value) {
  config[key] = value;
}

function get_val(key: string) {
  return config[key];
}

function save(json_path) {
  fs.writeFile(json_path, JSON.stringify(config), function (err) {
    if (err) {
      console.log(err);
    }
  })
}

function load(json_path) {
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