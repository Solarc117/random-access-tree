import BinaryTree from '../src/binary-trees.js'
import assert from './modified-assert.js'

suite('🧪 Immutable Sorted Set', () => {
  test('Should construct tree', done => {
    const tree = new BinaryTree(['a', 'e', 'z', 'c', 'f']),
      tree2 = new BinaryTree([null])

    assert.strictEqual(tree.root?.key, 'e')
    assert.isNull(tree2.root?.key)

    done()
  })

  test('Should return correct size', done => {
    const tree1 = new BinaryTree(['a', 'b', 'c', 'd', 'e']),
      tree2 = new BinaryTree(),
      tree3 = new BinaryTree(['a'])

    // @ts-ignore
    assert.strictEqualPairs(
      [tree1.size(), 5],
      [tree2.size(), 0],
      [tree3.size(), 1]
    )

    done()
  })

  test('add should return a new tree', done => {
    const tree = new BinaryTree(['a']),
      newTree = tree.add('b')

    // @ts-ignore
    assert.strictEqualPairs([tree.size(), 1], [newTree.size(), 2])

    done()
  })

  const tree7 = new BinaryTree(['a', 'c', 'e', 'f', 'g', 'y', 'z'])
  test('keyAtIndex should locate correct key at index', done => {
    // @ts-ignore
    assert.strictEqualPairs(
      [tree7.keyAtIndex(0), 'a'],
      [tree7.keyAtIndex(2), 'e'],
      [tree7.keyAtIndex(4), 'g']
    )

    done()
  })
  test('keyAtIndex should throw appropriate error', done => {
    const RangeErrorArguments = [7, -1],
      TypeErrorArguments = [undefined, null, [], {}]

    for (const argument of RangeErrorArguments) {
      try {
        tree7.keyAtIndex(argument)
      } catch (error) {
        assert.instanceOf(error, RangeError)
      }
    }
    for (const argument of TypeErrorArguments) {
      try {
        // @ts-ignore
        tree7.keyAtIndex(argument)
      } catch (error) {
        assert.instanceOf(error, TypeError)
      }
    }

    done()
  })
})
