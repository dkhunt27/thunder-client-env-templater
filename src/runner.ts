#!/usr/bin/env node
'use strict';
import minimist, { ParsedArgs } from 'minimist';
import { execute } from './index';
const argv: ParsedArgs = minimist(process.argv.slice(2));

execute(argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
