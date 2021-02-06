import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default {
  props: {
    language: {
      type: String,
      default: 'javascript',
    },
    options: Object,
    autoResize: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  watch: {
    language(newVal) {
      if (this.editor) {
        this.editor.setModelLanguage(this.editor.getModel(), newVal);
      }
    },
  },
  model: {
    event: 'change',
  },
  mounted() {
    this.initEditor();
  },
  beforeDestroy() {
    if (this.autoResize) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    this.editor && this.editor.dispose();
  },
  methods: {
    initEditor() {
      const options = {
        tabSize: 2,
        value: this.value,
        language: this.language,
        theme: 'vs-dark',
      };
      if (this.options) {
        Object.assign(options, this.options);
      }
      this.editor = monaco.editor.create(this.$el, options);
      this.$nextTick(() => {
        if (this.autoResize) {
          window.addEventListener('resize', this.resizeHandler);
        }
      });
      this.editor.onDidChangeModelContent((e) => {
        const value = this.editor.getValue();
        if (this.value !== value) {
          this.$emit('change', value, e);
        }
      });
    },
    resizeHandler() {
      this.editor.layout();
    },
  },
  render(h) {
    return h('div');
  },
};
