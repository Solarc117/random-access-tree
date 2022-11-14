'use strict'
import '../types/index.js'
import Node from './nodes.js'

/**
 * @returns {number}
 */
// @ts-ignore
Array.prototype.midIndex = function () {
  return Math.floor((this.length - 1) / 2)
}

export default class BinaryTree {
  /**
   * @type {Node|null}
   */
  root

  /**
   * @param  {Key[]|Node} [keysOrNode]
   */
  constructor(keysOrNode = []) {
    // Remember to edit constructor so nodes are a parameter as well.
    if (keysOrNode instanceof Node) {
      this.root = keysOrNode
      Object.freeze(this)
      return
    }

    const sortedNodes = this.#sortKeys(
      // @ts-ignore
      keysOrNode.map(key => key?.toLowerCase() || null)
    ).map((key, i) => new Node(key, i))

    this.root = this.#createTree(sortedNodes)
    Object.freeze(this)
  }

  /**
   * @param {Key} key
   * @returns {BinaryTree}
   */
  add(key) {
    const keyToUse = key?.toLowerCase() || null,
      result = this.#insertNode(keyToUse)

    return result instanceof BinaryTree ? result : new BinaryTree(result)
  }

  /**
   * @returns {number}
   */
  size() {
    return this.root?.size || 0
  }

  /**
   * @param {Key} key
   * @returns {boolean}
   */
  contains(key) {
    const keyToUse = key?.toLowerCase() || null

    // Inefficient - could encounter the argument halfway, but would disregard it, finishing the keys array before actually checking for the argument.
    return this.keys().includes(keyToUse)
  }

  /**
   * @returns {Key[]}
   */
  keys() {
    return this.#treeKeys(this.root)
  }

  /**
   * @param {number} index
   * @returns {Key}
   * @throws {TypeError} If argument is an invalid type.
   * @throws {RangeError} If argument is out of the tree's range.
   */
  keyAtIndex(index) {
    // Assignment requires method to throw a RangeError if the index argument is out of range. However, this is bad practice, as it will cause an entire progam that uses this class to crash if not wrapped inside a trycatch block, or inside code that otherwise handles exceptions. Even then, this increases the amount of code required to safely call this method. Returning -1 upon an invalid keyAtIndex call would be a safer alternative.
    if (typeof index !== 'number')
      throw new TypeError(
        `expected ${typeof index} argument to be of type number`
      )
    if (index < 0 || index >= this.size() || this.size() === 0)
      throw new RangeError(`index ${index} out of range of tree`)

    return this.#keyAtIndex(index)
  }

  /**
   * @param {Key} key
   * @returns {number}
   * @throws {TypeError} If argument is an invalid type.
   * @throws {EvalError} If argument is not in the tree.
   */
  getIndex(key) {
    if (typeof key !== 'string')
      throw new TypeError(
        `expected ${typeof key} argument to be of type string`
      )
    if (this.root === null)
      throw new EvalError(`no node containing ${key} in tree`)
    const keyToUse = key?.toLowerCase() || null

    return this.#getIndex(keyToUse)
  }

  /**
   * @param {Key} key
   * @returns {number}
   * @throws {TypeError} If argument is an invalid type.
   * @throws {EvalError} If argument is not in the tree.
   */
  getIndex2(key) {
    if (typeof key !== 'string')
      throw new TypeError(
        `expected ${typeof key} argument to be of type string`
      )
    if (this.root === null)
      throw new EvalError(`cannot find ${key} index in an empty tree`)
    const keyToUse = key?.toLowerCase() || null

    return this.#getIndex2(keyToUse)
  }

  /**
   * @param {Key} key
   * @returns {BinaryTree}
   * @throws {TypeError} If key is not null, or a string with a single alphabet character.
   * @throws {EvalError} If tree is empty.
   */
  remove(key) {
    if (
      (key !== null && typeof key !== 'string') ||
      (typeof key === 'string' && !/^[a-z]$/i.test(key))
    )
      throw new TypeError(
        `expected ${typeof key} key to be of type null, or string with a single alphabetic character`
      )
    if (this.size() === 0)
      throw new EvalError('cannot remove key from empty tree')

    const result = this.#removeNode(key?.toLowerCase() || null)

    return result instanceof BinaryTree ? result : new BinaryTree(result)
  }

  /**
   * @param {Key[]} keys
   * @returns {Key[]}
   */
  #sortKeys(keys) {
    // Would be more efficient if I could sort keys, AND transform them into nodes at the same time.
    return keys.sort((a, b) =>
      a === null ? -1 : b === null ? 1 : a.charCodeAt(0) - b.charCodeAt(0)
    )
  }

  /**
   * @param {Node[]} sortedNodes An array of sorted nodes, with nodes containing null keys sorted before all others.
   * @returns {(Node[]|Node)[]}
   */
  #leftMidRight(sortedNodes) {
    // @ts-ignore
    const midIndex = sortedNodes.midIndex()

    return [
      sortedNodes.slice(0, midIndex),
      sortedNodes[midIndex],
      sortedNodes.slice(midIndex + 1, sortedNodes.length),
    ]
  }

  /**
   * @param {Node[]} nodes
   * @returns {Node|null}
   */
  #createTree(nodes) {
    const [leftNodes, midNode, rightNodes] = this.#leftMidRight(nodes)
    if (midNode === undefined) return null

    // @ts-ignore
    midNode.leftNode = this.#createTree(leftNodes)
    // @ts-ignore
    midNode.rightNode = this.#createTree(rightNodes)
    // @ts-ignore
    midNode.size =
      // @ts-ignore
      (midNode.leftNode?.size || 0) + (midNode.rightNode?.size || 0) + 1

    // @ts-ignore
    return midNode
  }

  /**
   * @param {Key} key
   * @param {Node|null} currentNode
   * @returns {Node|BinaryTree}
   */
  #insertNode(key, currentNode = this.root) {
    if (currentNode === null) {
      const newNode = new Node(key, 0) // Remember to add correct index.
      newNode.size = 1
      return newNode
    }
    if (currentNode.key === key) return this

    const { key: currentKey, index, size } = currentNode,
      newNode = new Node(currentKey, index)
    newNode.size = size + 1

    // "`" because its character code immediately precedes 'a'.
    if ((currentKey || '`') > (key || '`')) {
      const result = this.#insertNode(key, currentNode.leftNode)
      if (result instanceof BinaryTree) return result

      newNode.index = newNode.index + 1
      newNode.leftNode = result
      newNode.rightNode = this.#sumIndexes(currentNode.rightNode)
      return newNode
    }

    const result = this.#insertNode(key, currentNode.rightNode)
    if (result instanceof BinaryTree) return result

    newNode.leftNode = currentNode.leftNode
    newNode.rightNode = result
    return newNode
  }

  /**
   * @param {Node|null} node
   * @returns {Node|null} Top node of new subtree (incremented indexes), or null if argument was null.
   */
  #sumIndexes(node) {
    if (!node) return null

    const { key, index } = node

    return new Node(
      key,
      index + 1,
      this.#sumIndexes(node.leftNode),
      this.#sumIndexes(node.rightNode)
    )
  }

  /**
   * @param {Node|null} node
   * @returns {Key[]}
   */
  #treeKeys(node) {
    return node === null
      ? []
      : node.key === null
      ? [null]
      : [
          node.key,
          ...this.#treeKeys(node.leftNode),
          ...this.#treeKeys(node.rightNode),
        ]
  }

  /**
   * @param {number} index
   * @param {Node} [node]
   * @returns {Key}
   */
  // @ts-ignore
  #keyAtIndex(index, node = this.root) {
    return node.index === index
      ? node.key
      : this.#keyAtIndex(
          index,
          // @ts-ignore
          node[node.index > index ? 'leftNode' : 'rightNode']
        )
  }

  /**
   * @param {Key} key
   * @param {Node|null} [node]
   * @returns {number}
   * @throws {EvalError} If key is not in tree.
   */
  // @ts-ignore
  #getIndex(key, node = this.root) {
    if (node === null) throw new EvalError(`no node containing ${key} in tree`)
    if (node.key === key) return node.index

    return this.#getIndex(
      key,
      node[
        key === null
          ? 'leftNode'
          : node.key === null
          ? 'rightNode'
          : node.key > key
          ? 'leftNode'
          : 'rightNode'
      ]
    )
  }

  /**
   * @param {Key} key
   * @param {Node|null} [node]
   * @returns {number}
   * @throws {EvalError} If key is not in tree.
   */
  #getIndex2(key, node = this.root, counter = 0) {
    if (
      node?.leftNode === null &&
      node?.rightNode === null &&
      node?.key !== key
    )
      throw new EvalError(`missing key ${key} in tree - cannot get index`)
    if (node === null) return 0

    if ((key || '`') < (node.key || '`'))
      // Traverse left.
      return this.#getIndex2(key, node.leftNode, counter)

    if ((key || '`') > (node.key || '`')) {
      // To prevent information loss as we traverse down right subtrees.
      counter += (node.leftNode?.size || 0) + 1
      return this.#getIndex2(key, node.rightNode, counter)
    }

    return counter + (node.leftNode?.size || 0)
  }

  /**
   * @param {Key} key
   * @returns {Node|BinaryTree}
   */
  #removeNode(key) {
    if (this.size() === 1) return new BinaryTree()
    if (key === this.root?.key) {
      // Remove root node.
      // If root.right is null, OR if left subtree is equal to or larger than right subtree (as determined by root.left.size), set left node to root, with its right set to previous root's right.
      // Otherwise, set root.right to new root, with left set to previous root's left (IF new root is not null).
      if (this.root?.rightNode === null) this.root = this.root.leftNode
      if (this.root?.leftNode === null) this.root = this.root.rightNode
      if (
        (this.root?.leftNode.size || '`') >= (this.root?.rightNode.size || '`')
      ) {
      }
    }
  }
}
