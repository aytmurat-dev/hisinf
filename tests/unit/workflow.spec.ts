import { describe, it, expect } from 'vitest'
import { canTransition, getReviewProblems } from '@/lib/workflow'

describe('Workflow state machine & validation', () => {
  it('allows author valid transitions only', () => {
    expect(canTransition('author', 'draft', 'in_review')).toBe(true)
    expect(canTransition('author', 'draft', 'draft')).toBe(true)
    expect(canTransition('author', 'draft', 'published')).toBe(false)
    expect(canTransition('author', 'in_review', 'draft')).toBe(false)
    expect(canTransition('author', 'changes_requested', 'in_review')).toBe(true)
    expect(canTransition('author', 'approved', 'published')).toBe(false)
  })

  it('allows editor and admin all transitions', () => {
    expect(canTransition('editor', 'draft', 'published')).toBe(true)
    expect(canTransition('editor', 'in_review', 'changes_requested')).toBe(true)
    expect(canTransition('editor', 'in_review', 'approved')).toBe(true)
    expect(canTransition('admin', 'draft', 'published')).toBe(true)
    expect(canTransition('admin', 'published', 'draft')).toBe(true)
  })

  it('reports all 7 review problems for empty document', () => {
    const problems = getReviewProblems({})
    expect(problems).toHaveLength(7)
    expect(problems).toContain('Sarlavha yoʻq')
    expect(problems).toContain('Qisqa tavsif kamida 50 belgi boʻlsin')
    expect(problems.some((p) => p.includes('Matn juda qisqa'))).toBe(true)
    expect(problems).toContain('Muqova rasmi tanlanmagan')
    expect(problems).toContain('Davr tanlanmagan')
    expect(problems).toContain('Kamida bitta kategoriya tanlang')
    expect(problems).toContain('Kamida bitta «Manba» bloki qoʻshing')
  })

  it('passes review when all criteria are met', () => {
    const validDoc = {
      title: 'Amir Temur davlati',
      excerpt: 'Amir Temur davlatining shakllanishi va uning Markaziy Osiyo taraqqiyotidagi oʻrni haqida batafsil maʼlumot.',
      coverImage: 1,
      period: 6,
      categories: [1],
      body: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Amir Temur buyuk sarkarda va davlat arbobi boʻlib, u XIV asrda qudratli saltanat barpo etdi. '.repeat(10),
                },
              ],
            },
            {
              type: 'block',
              fields: {
                blockType: 'source',
                title: 'Zafarnoma',
                author: 'Sharafiddin Ali Yazdiy',
              },
            },
          ],
        },
      },
    }

    const problems = getReviewProblems(validDoc)
    expect(problems).toEqual([])
  })
})
