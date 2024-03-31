## SOLIVE

A flexible online playground for Solidity smart contract, inspired by remix-IDE and react-live

### Demo
- Check demo website: https://demo.solive.dev

- build demo: [demo](./apps/demo)

### DOC
- Check doc website: https://solive.dev

- build doc: [doc](./apps/doc)

### Dev

- First install dependencies

```bash
pnpm install
```

- Then start library dev (or use `nx run <pkgname>:<command>`)

```bash
pnpm start:lib
# or
nx run solive-core:start
# note：Core requires additional starting CSS
nx run solive-core:start:css
```

- Then start demo/doc dev

```bash
pnpm start:demo
# or
pnpm start:doc
```
