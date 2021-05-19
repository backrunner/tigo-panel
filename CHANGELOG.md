# Changelog

## v1.5.0

- Breaking change: the `host` in `config.js` now has been changed to `internalHost` and `externalHost` to fit `@tigojs/api-proxy@0.2.0`.

- Feat: fit `@tigo/faas@0.3.0` changes.

- Fix: editor cannot fit the height of its parent element.

- Fix: saving new lambda now will save its environment KV  at the same time (same to the lambda's policy).

- Fix: the edit button in lambda environment KV is not functional.

- Minor: upgrade `monaco-editor`.
