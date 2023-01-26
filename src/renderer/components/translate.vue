<script>

export default function translate(translate_machine, origin_text) {
  electron.ipcRenderer.invoke('translate', translate_machine, origin_text);
}
</script>
