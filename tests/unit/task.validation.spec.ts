import { describe, expect, it } from 'vitest'
import { validateTaskDraft } from '../../src/domain/task.validation'

describe('validateTaskDraft', () => {
  it('trims a valid title and supplies defaults', () => {
    expect(validateTaskDraft({ title: '  完成报告  ' })).toEqual({ valid: true, value: { title: '完成报告', description: '', status: 'todo', priority: 'medium' } })
  })

  it('rejects blank and overlong titles', () => {
    expect(validateTaskDraft({ title: '  ' }).valid).toBe(false)
    expect(validateTaskDraft({ title: 'a'.repeat(101) }).valid).toBe(false)
  })
})
