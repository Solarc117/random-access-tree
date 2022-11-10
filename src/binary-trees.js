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
   * @param  {Key[]} [keys]
   */
  constructor(keys = []) {
    const sortedNodes = this.#sortKeys(
      keys.map(key => key?.toLowerCase() || null)
    ).map((key, i) => new Node(key, i))

    this.root = this.#createTree(sortedNodes)
    Object.freeze(this)
  }

  /**
   * @param {Key} key
   * @returns {BinaryTree}
   */
  add(key) {
    const keyToUse = key?.toLowerCase() || null

    return this.contains(keyToUse)
      ? this
      : new BinaryTree([...this.keys(), keyToUse])
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
   * @returns {BinaryTree}
   *
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

    const keyToUse = key?.toLowerCase() || null,
      keys = this.keys().filter(currentKey => currentKey !== keyToUse)

    return new BinaryTree(keys)
  }

  /**
   * @param {Key[]} keys
   * @returns {Key[]}
   */
  #sortKeys(keys) {
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
}
