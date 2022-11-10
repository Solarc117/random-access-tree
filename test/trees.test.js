import BinaryTree from '../src/binary-trees.js'
import assert from './modified-assert.js'

suite('🧪 Immutable Sorted Set', () => {
  test('Should construct tree', done => {
    const tree1 = new BinaryTree(['a', 'e', 'z', 'c', 'f']),
      tree2 = new BinaryTree([null])

    assert.strictEqual(tree1.root?.key, 'e')
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
    const tree1 = new BinaryTree(['a']),
      tree2 = tree1.add('b')

    // @ts-ignore
    assert.strictEqualPairs([tree1.size(), 1], [tree2.size(), 2])

    done()
  })

  const tree = new BinaryTree(['a', 'c', 'e', 'f', 'g', 'y', 'z'])

  test('keyAtIndex should locate correct key at index', done => {
    // @ts-ignore
    assert.strictEqualPairs(
      [tree.keyAtIndex(0), 'a'],
      [tree.keyAtIndex(2), 'e'],
      [tree.keyAtIndex(4), 'g']
    )

    done()
  })

  test('keyAtIndex should throw appropriate error', done => {
    const RangeErrorArguments = [7, -1],
      TypeErrorArguments = [undefined, null, [], {}]

    for (const argument of RangeErrorArguments) {
      try {
        tree.keyAtIndex(argument)
      } catch (error) {
        assert.instanceOf(error, RangeError)
      }
    }
    for (const argument of TypeErrorArguments) {
      try {
        // @ts-ignore
        tree.keyAtIndex(argument)
      } catch (error) {
        assert.instanceOf(error, TypeError)
      }
    }

    done()
  })

  const largeTree = new BinaryTree('ABCDEFGHIJKLMNOPQRSTVXYZ'.split(''))

  test('getIndex should locate correct index using key', done => {
    const keyIndexPairs = [
      ['a', 0],
      ['g', 6],
      ['j', 9],
      ['m', 12],
      ['o', 14],
      ['z', 23],
    ]

    for (const [key, index] of keyIndexPairs)
    // prettier-ignore
    // @ts-ignore
      assert.strictEqual(largeTree.getIndex(key), index)

    done()
  })

  test('remove should throw TypeError on invalid argument types', done => {
    const tree = new BinaryTree([null, 'a']),
      TypeErrorArguments = [-1, [], {}, undefined, 'ab', () => {}]

    for (const argument of TypeErrorArguments) {
      try {
        // @ts-ignore
        tree.remove(argument)
      } catch (error) {
        assert.instanceOf(error, TypeError)
      }
    }

    done()
  })

  test('remove should throw EvalError on an empty tree', done => {
    const emptytree = new BinaryTree(),
      EvalErrorArguments = [null, 'a', 'z']

    for (const argument of EvalErrorArguments) {
      try {
        emptytree.remove(argument)
      } catch (err) {
        assert.instanceOf(err, EvalError)
      }
    }

    done()
  })

  test('remove should create a tree with the key argument removed', done => {
    const tree1 = new BinaryTree([null, 'a', 'b']),
      tree2 = new BinaryTree(['z']),
      tree3 = new BinaryTree('abcdefghijk'.split('')),
      modifiedTree1 = tree1.remove(null),
      modifiedTree2 = tree2.remove('z'),
      modifiedTree3 = tree3.remove('j')

    // @ts-ignore
    assert.strictEqualPairs(
      [modifiedTree1.size(), 2],
      [modifiedTree2.size(), 0],
      [modifiedTree3.size(), 10]
    )

    // @ts-ignore
    assert.deepStrictEqualPairs(
      [modifiedTree1.keys(), ['a', 'b']],
      [modifiedTree2.keys(), []],
      [modifiedTree3.keys().sort(), 'abcdefghik'.split('')]
    )

    done()
  })
})
