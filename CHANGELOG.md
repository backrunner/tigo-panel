# Changelog

## v1.7.1

- Minor: upgrade dependencies.

## v1.7.0

- Feat: support lambda performance statistics.

- Fix: query of router targets always lost in the portal page.

- Minor: fit the latest API URL changes.

## v1.6.4 - v1.6.5

- Minor: upgrade dependencies.

- Fix: presist `console.log` methods in production build.

- Fix: an error will be thrown when delete and item from editor.

## v1.6.3

- Fix: the warning dialog always show after saving a new item in editor.

## v1.6.2

- Fix: prevent useless refresh when saving a new item in editor.

## v1.6.1

- Feat: output panel version info to console.

- Fix: prevent redundant navigation when the query is empty.

## v1.6.0

- Feat: add `publicHost` option to the `config.js`.

- Fix: some texts are not internationalized.

## v1.5.0

- Breaking change: the `host` in `config.js` now has been changed to `internalHost` and `externalHost` to fit `@tigojs/api-proxy@0.2.0`.

- Feat: fit `@tigo/faas@0.3.0` changes.

- Fix: editor cannot fit the height of its parent element.

- Fix: saving new lambda now will save its environment KV  at the same time (same to the lambda's policy).

- Fix: the edit button in lambda environment KV is not functional.

- Fix: target path in debugger sender cannot change automatically when query changed.

- Fix: now the tabs will saved to local storage after dragged.

- Fix: apiBaseMap.js cannot be located when bundling the panel.

- Minor: upgrade `monaco-editor`.
