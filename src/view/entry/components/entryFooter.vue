<template>
  <div class="entry-footer">
    <span class="version">tigo-panel v{{ version }}</span>
    <a href="https://github.com/tigojs" class="tigo" target="_blank" rel="noopener noreferer">
      <TigoIcon />
    </a>
    <a
      href="https://github.com/tigojs/tigo-panel"
      class="github"
      target="_blank"
      rel="noopener noreferer"
    >
      <GitHubIcon />
    </a>
  </div>
</template>

<script>
import GitHubIcon from '@/common/icon/GitHub';
import TigoIcon from '@/common/icon/tigo';
import { version } from '@/common/version';

export default {
  components: {
    GitHubIcon,
    TigoIcon,
  },
  data() {
    return {
      version,
    };
  },
};
</script>

<style lang="less">
.entry-footer {
  width: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  margin-top: 72px;
  span,
  a {
    color: var(--primary);
    font-size: 12px;
    margin-right: 24px;
  }
  a:last-child {
    margin-right: 0;
  }
  .tigo {
    width: max-content;
    transition: 200ms ease;
    svg {
      display: inline;
      width: 120px;
    }
  }
  .tigo:hover {
    filter: brightness(0.8);
  }
  .github {
    width: max-content;
    svg {
      display: inline;
      path {
        transition: 200ms ease;
      }
    }
    svg:hover {
      path {
        fill: var(--regular-text);
        cursor: pointer;
      }
    }
  }
}
</style>
