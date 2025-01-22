import { version, name, engines } from './package.json'
import { build } from 'esbuild'

import * as fs from 'fs'
import archiver from 'archiver'

build({
  logLevel: 'info',
  bundle: true,
  minify: false,
  platform: 'node',
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  target: `node${engines['node']}`,
  external: ['@aws-sdk/client-firehose', '@types/aws-lambda']
}).then(() => {
  const output = fs.createWriteStream(__dirname + `/dist/${name}-v${version}.zip`)
  const archive = archiver('zip', {
    zlib: {level: 9},
  })
  archive.pipe(output)
  const lambdaCode = __dirname + '/dist/index.js'
  archive.append(fs.createReadStream(lambdaCode), {name: 'index.js'})
  archive.finalize()
})
