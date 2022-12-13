<script>

export default function translate(translate_machine, origin_text, finish_translate) {
  electron.ipcRenderer.invoke('translate', translate_machine, origin_text);
}
</script>
