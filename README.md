# **Lusat** [![lusat minzip package size](https://img.shields.io/bundlephobia/minzip/lusat?label=zipped)](https://www.npmjs.com/package/lusat) [![lusat package version](https://img.shields.io/npm/v/lusat.svg?colorB=green)](https://www.npmjs.com/package/lusat) [![lusat license](https://img.shields.io/npm/l/lusat.svg?colorB=lightgrey)](https://github.com/lusatai/lusat/blob/main/LICENSE)

AI Superpowers for your apps. Install:

```bash
npm i lusat
```

**Lusat** is [Rysana's](https://rysana.com) open source tookit for building powerful, secure, and intuitive AI-augmented natural language applications for the web. This is the TypeScript/JavaScript version of the Lusat toolkit.

<p align="center">
  <hr />
  <p align="center">
    <a href="https://rysana.com/log">Log</a>
    --
    <a href="https://rysana.com/docs/lusat">Website</a>
    --
    <a href="https://rysana.com/docs/lusat">Docs</a>
    --
    <a href="https://rysana.com">Rysana</a>
  </p>
  <hr />
</p>

## Documentation

For details on how to build with Lusat, see the [Lusat documentation](https://rysana.com/docs/lusat).

## Installation

You can install `lusat` with `npm`, `pnpm`, or `yarn`, and you can build it from source with the `build` script.

<table>
<tr>
<th width="292px"><code>npm</code></th>
<th width="292px"><code>pnpm</code></th>
<th width="292px"><code>yarn</code></th>
</tr>
<tr>
<td>

```bash
npm i lusat
```

</td>
<td>

```bash
pnpm i lusat
```

</td>
<td>

```bash
yarn add lusat
```

</td>
</tr>
</table>

## API Platform

If you want to use the [Rysana AI](https://rysana.com/ai) platform, you will need to create an account and create a project. You will need the your API key to use the Rysana AI platform.

```bash
# .env
RYSANA_API_KEY=your-api-key
```

## Imports

Currently, Lusat for TS/JS is bundled into a single `lusat` package on NPM.

You can import core functionality without including platform-specific code from `lusat`:

```ts
import { action, app } from 'lusat'
```

You can import platform-specific code from independently bundled files, e.g. for React:

```ts
import { useHotkey } from 'lusat/ui/react'
```

or for third-party adapters:

```ts
import { gptFunctions } from 'lusat/adapters/openai'
```
