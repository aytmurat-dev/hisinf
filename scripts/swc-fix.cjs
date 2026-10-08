const path = require('path')
const fs = require('fs')

const cacheDir = path.resolve(__dirname, '..', '.swc_cache')
try {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }
} catch (_) {}

process.env.SWC_NATIVE_BINDING_CACHE = cacheDir
