import ImmutableSortedSet from '../src/immutable-trees.js'
import assert from './modified-assert.js'

suite('🧪 Immutable Sorted Set', () => {
  test('Should add nodes', done => {
    const tree1 = new ImmutableSortedSet(),
      tree2 = tree1.add('a')

    assert.strictEqual(tree2.size(), 1)
    done()
  })
})
