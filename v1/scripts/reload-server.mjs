import http from 'http'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const PORT = 35729
const DIST = path.resolve('dist')
const ROOT = path.resolve('.')

const clients = new Set()

const server = http.createServer((req, res) => {
  if (req.url === '/livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    })
    res.write('data: connected\n\n')
    clients.add(res)
    req.on('close', () => clients.delete(res))
    return
  }
  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`[dev] reload server on http://localhost:${PORT}`)
})

let building = false
let needsRebuild = false

function runBuild() {
  if (building) {
    needsRebuild = true
    return
  }
  building = true
  needsRebuild = false

  console.log('[dev] building...')
  const child = spawn('npm', ['run', 'build'], { stdio: 'inherit', shell: true })

  child.on('close', () => {
    building = false
    broadcastReload()
    if (needsRebuild) runBuild()
  })
}

function broadcastReload() {
  if (clients.size) {
    console.log('[dev] reloading browsers')
    clients.forEach(c => c.write('event: reload\ndata: go\n\n'))
  }
}

let buildTimer
function scheduleBuild() {
  clearTimeout(buildTimer)
  buildTimer = setTimeout(runBuild, 100)
}

function watchDir(dir) {
  if (!fs.existsSync(dir)) return
  fs.watch(dir, { recursive: true }, (event, filename) => {
    if (filename && !filename.startsWith('.') && !filename.includes('node_modules')) {
      console.log(`[dev] ${event}: ${filename}`)
      scheduleBuild()
    }
  })
}

watchDir(path.join(ROOT, 'src'))
watchDir(path.join(ROOT, 'public'))

fs.watch(ROOT, (event, filename) => {
  if (filename === 'index.html') {
    console.log(`[dev] ${event}: ${filename}`)
    scheduleBuild()
  }
})

runBuild()
