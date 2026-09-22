import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const port = 4173
const outputDir = fileURLToPath(new URL('../../artifact/', import.meta.url))
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port)], {
  stdio: 'pipe',
  shell: process.platform === 'win32',
})

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`)
      if (response.ok) return
    } catch { /* The development server is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('Vite development server did not start in time.')
}

try {
  await mkdir(outputDir, { recursive: true })
  await waitForServer()
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' })

  await page.screenshot({ path: join(outputDir, '01-empty-board.png'), fullPage: true })

  await page.getByRole('button', { name: /新建任务/ }).click()
  await page.getByLabel('标题 *').fill('完成课程作业')
  await page.getByLabel('描述（选填）').fill('整理架构设计并提交最终版本。')
  await page.getByLabel('优先级').selectOption('high')
  await page.screenshot({ path: join(outputDir, '02-create-task-form.png'), fullPage: true })
  await page.getByRole('button', { name: '创建任务' }).click()
  await page.screenshot({ path: join(outputDir, '03-created-high-priority-task.png'), fullPage: true })

  await page.getByRole('button', { name: /编辑 完成课程作业/ }).click()
  await page.getByLabel('标题 *').fill('完成课程作业（已更新）')
  await page.getByLabel('状态').selectOption('in_progress')
  await page.getByLabel('优先级').selectOption('medium')
  await page.getByRole('button', { name: '保存修改' }).click()
  await page.screenshot({ path: join(outputDir, '04-edited-and-moved-task.png'), fullPage: true })

  const editedCard = page.locator('article').filter({ hasText: '完成课程作业（已更新）' })
  const completedColumn = page.locator('section').nth(2)
  await editedCard.dragTo(completedColumn)
  await page.screenshot({ path: join(outputDir, '05-dragged-to-completed.png'), fullPage: true })

  await page.getByRole('button', { name: '切换为深色模式' }).click()
  await page.reload({ waitUntil: 'networkidle' })
  await page.screenshot({ path: join(outputDir, '06-dark-mode-persisted.png'), fullPage: true })

  await page.getByRole('button', { name: /删除 完成课程作业（已更新）/ }).click()
  await page.screenshot({ path: join(outputDir, '07-delete-confirmation.png'), fullPage: true })
  await page.getByRole('button', { name: '删除任务' }).click()
  await page.reload({ waitUntil: 'networkidle' })
  await page.screenshot({ path: join(outputDir, '08-deleted-task-after-reload.png'), fullPage: true })

  await browser.close()
  console.log('Saved 8 screenshots to artifact/.')
} finally {
  server.kill('SIGTERM')
}
