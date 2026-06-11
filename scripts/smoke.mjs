import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const OUT = '/tmp/portfolio-shots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(3500) // loader + hero choreography
await page.screenshot({ path: `${OUT}/01-hero.png` })

// Scroll through sections (lenis smooths native scroll; use mouse wheel bursts)
const scrollTo = async (id, name) => {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, id)
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${OUT}/${name}.png` })
}

await scrollTo('#about', '02-journey')
await scrollTo('#skills', '03-galaxy')
await scrollTo('#work', '04-museum')

// Drive into the pinned horizontal museum a bit
await page.mouse.wheel(0, 1600)
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/05-museum-scrolled.png` })

await scrollTo('#impact', '06-dashboard')
await scrollTo('#lab', '07-lab')
await scrollTo('#contact', '08-contact')

// Case study
await page.goto('http://localhost:5173/project/blazepost', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.screenshot({ path: `${OUT}/09-case-hero.png` })
await page.evaluate(() => window.scrollBy(0, 1600))
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/10-case-body.png` })

// Mobile viewport check
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
mobile.on('pageerror', (err) => errors.push('MOBILE: ' + String(err)))
await mobile.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await mobile.waitForTimeout(3500)
await mobile.screenshot({ path: `${OUT}/11-mobile-hero.png` })
await mobile.evaluate(() => document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' }))
await mobile.waitForTimeout(1500)
await mobile.screenshot({ path: `${OUT}/12-mobile-work.png` })

console.log('CONSOLE ERRORS:', errors.length ? errors : 'none')
await browser.close()
