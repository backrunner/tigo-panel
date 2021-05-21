# Changelog

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
