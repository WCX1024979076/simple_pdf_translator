<template>
  <div class="App" style="width:70%; height:98%;  position:absolute;">
    <iframe height=100% width=100% id="pdfviewer"
      :src="`./lib/pdf/web/viewer.html?file=${encodeURIComponent(previewUrl)}`">
    </iframe>
  </div>
  <div class="App" style="width:28%; height:98%;  position:absolute;margin-left: 71%;overflow:auto;">
    <div class="App-span">
      <el-select v-model="translate_machine" placeholder="Select" @change="translate_select" style="font-size:15px;">
        <el-option v-for="item in translate_options" :key="item.value" :label="item.label" :value="item.value"
          :disabled="item.disabled" />
      </el-select>
      <el-button @click="translate_machine_config()">
        翻译引擎配置
      </el-button>
    </div>
    <h3>译文</h3>
    <el-input v-model="translate_text" autosize="{minRows: 10}" type="textarea" size="small" placeholder="Please input"
      style="font-size:15px;" />
    <h3>原文</h3>
    <el-input v-model="origin_text" autosize="{minRows:10}" type="textarea" size="small" placeholder="Please input"
      @change="origin_text_change()" style="font-size:15px;" />
  </div>

  <el-dialog v-model="dialogVisible" title="翻译引擎配置" width="30%" :before-close="handleClose">
    <el-form label-position="right" label-width="120px" :model="ruleForm" ref="form" size="mini">
      <el-form-item v-for="(item, index) in configList" :label="item.name" :required="item.required" :prop="item.name"
        :key="item.name + index">
        <el-input v-if="item.type === 'input' || item.type === 'password'"
          :type="item.type === 'password' ? 'password' : 'input'" v-model="ruleForm[item.name]"
          :placeholder="item.message || item.name"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="translate_machine_config_save()">
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import translate from "./components/translate.vue"
import { toRaw } from '@vue/reactivity'

export default {
  name: 'App',
  data() {
    return {
      translate_options: [],
      previewUrl: "",
      origin_text: "",
      translate_text: "",
      translate_machine: "baidu",
      configList: {},
      ruleForm: {},
      dialogVisible: false
    }
  },
  mounted() {
    let iframe = document.getElementById('pdfviewer');
    let _this = this;
    electron.ipcRenderer.invoke('get_plugins_config').then((data) => {
      _this.translate_options = data;
    })
    iframe.addEventListener("load", () => {
      this.set_select_text_hook();
    });
    electronAPI.onUpdataFile((_event, file) => {
      this.previewUrl = "pdf://" + file;
      this.$forceUpdate();
      this.set_select_text_hook();
    });
    electronAPI.onFinishTranslate((_event, translate_text) => {
      this.translate_text = translate_text;
    });
  },
  methods: {
    set_select_text_hook() {
      let _this = this;
      let iframe = document.getElementById('pdfviewer');
      iframe.contentWindow.addEventListener('mouseup', function () {
        var choose = iframe.contentWindow.getSelection().toString();
        if (choose.length == 0)
          return;
        _this.origin_text = choose;
        _this.origin_text = _this.origin_text.replace(/[\.][\r\n]/g, "\t").replace(/[-][\r\n]/g, "").replace(/[\r\n]/g, " ").replace(/[\t]/g, ".\n ");
        if (_this.origin_text[0] != " ")
          _this.origin_text = " " + _this.origin_text;
        translate(_this.translate_machine, _this.origin_text);
      }, true);
      this.$forceUpdate();
    },
    origin_text_change() { //重新翻译
      translate(this.translate_machine, this.origin_text);
      this.$forceUpdate();
    },
    translate_select() {
      if (this.origin_text.length == 0) {
        this.$forceUpdate();
        return;
      }
      translate(this.translate_machine, this.origin_text);
      this.$forceUpdate();
    },
    translate_machine_config() {
      let _this = this;
      _this.dialogVisible = true;
      electron.ipcRenderer.invoke('get_config', this.translate_machine).then((data) => {
        _this.configList = data.configList;
        _this.ruleForm = data.ruleForm;
      })
      _this.$forceUpdate();
    },
    translate_machine_config_save() {
      this.dialogVisible = false;
      electron.ipcRenderer.invoke('set_config', this.translate_machine, toRaw(this.ruleForm));
    }
  }
}
</script>

<style>
*::-webkit-scrollbar {
  display: none;
}

.element::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

body {
  margin: 0;
  padding: 0;
}

.el-textarea__inner {
  text-align: justify;
}

.App-span .el-select {
  width: 150px;
  float: left;
  margin-left: 30px;
}

.App-span .el-button {
  width: 100px;
  float: right;
  margin-right: 30px;
}

.App-span {
  height: 30px;
}
</style>