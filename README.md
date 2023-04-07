## SOLIVE

A flexible online playground for Solidity smart contract, inspired by remix-IDE and react-live

### Demo
- Check demo website: https://solive-demo.vercel.app/

- build demo: [demo](./apps/demo)

### Todo
- [] NPM Publish
- [] Metamask Provider
- [] Finish Deploy
- [] Optimize logging system
- [] Build Mdx Component

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
