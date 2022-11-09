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
    const sortedNodes = this.#sortKeys(keys).map((key, i) => new Node(key, i))

    this.root = this.#createTree(sortedNodes)
    Object.freeze(this)
  }

  /**
   * @param {Key} key
   * @returns {BinaryTree}
   */
  add(key) {
    if (this.contains(key)) return this

    return new BinaryTree([...this.keys(), key])
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
    // Inefficient - could encounter the argument halfway, but would disregard it, finishing the keys array before actually checking for the argument.
    return this.keys().includes(key)
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
   * @throws {RangeError} If argument is not in the set.
   */
  getIndex(key) {}

  /**
   * @param {Key} key
   * @returns {BinaryTree}
   *
   */
  remove(key) {}

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
    if (node === null) return []
    if (node.key === null) return [null]

    return [
      node.key,
      // @ts-ignore
      ...this.#treeKeys(node.leftNode),
      ...this.#treeKeys(node.rightNode),
    ]
  }

  /**
   * @param {number} index
   * @param {Node} node
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
}
