import { describe, expect, it } from 'vitest'
import { TASK_STORAGE_KEY } from '../../src/constants/task.constants'
import { LocalStorageTaskRepository, type StorageLike } from '../../src/infrastructure/local-storage-task.repository'

function storage(): StorageLike & { values: Map<string, string> } {
  const values = new Map<string, string>()
  return { values, getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }
}

describe('LocalStorageTaskRepository', () => {
  it('returns empty tasks when the key is absent', () => expect(new LocalStorageTaskRepository(storage()).load()).toEqual([]))

  it('backs up malformed data and throws a recoverable error', () => {
    const target = storage(); target.setItem(TASK_STORAGE_KEY, '{broken')
    expect(() => new LocalStorageTaskRepository(target).load()).toThrow('无法读取')
    expect(target.getItem(TASK_STORAGE_KEY)).toBeNull()
    expect([...target.values.keys()].some((key) => key.startsWith(`${TASK_STORAGE_KEY}.corrupt.`))).toBe(true)
  })
})
