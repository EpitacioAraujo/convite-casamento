import pool from './db.js'
import { migrate } from './migrate.js'
import bcrypt from 'bcryptjs'

const seeds = {
  tags: {
    description: 'Insere tags padrão de família e amigos (INSERT IGNORE, idempotente)',
    async run() {
      // ponytail: invites.tag stores the name (denormalized); no rename cascade, fine for a handful of groups
      for (const [name, color] of [
        ['Minha família', '#c9a227'], ['Família dela', '#b5651d'],
        ['Meus amigos', '#2e7d67'], ['Amigos dela', '#7b5ea7'], ['Nossos amigos', '#c05579'],
      ]) await pool.execute('INSERT IGNORE INTO tags (name, color) VALUES (?, ?)', [name, color])
    },
  },
  admin: {
    description: 'Cria usuário admin padrão admin/admin123 (INSERT IGNORE, não sobrescreve)',
    async run() {
      const hash = await bcrypt.hash('admin123', 10)
      await pool.execute(
        'INSERT IGNORE INTO admins (username, password_hash) VALUES (?, ?)',
        ['admin', hash]
      )
    },
  },
}

const [cmd, target] = process.argv.slice(2)

if (cmd === 'list') {
  console.log('\nSeeds disponíveis:\n')
  for (const [name, { description }] of Object.entries(seeds))
    console.log(`  ${name.padEnd(12)} ${description}`)
  console.log()
  process.exit(0)
}

await migrate()

if (cmd === 'run') {
  const toRun = target === 'all' ? Object.keys(seeds) : [target]
  for (const name of toRun) {
    if (!seeds[name]) { console.error(`Seed "${name}" não encontrada. Use: npm run seed:list`); process.exit(1) }
    await seeds[name].run()
    console.log(`✓ ${name}`)
  }
} else {
  console.error('Uso: npm run seed:list  |  npm run seed:run -- <name|all>')
  process.exit(1)
}

process.exit(0)
