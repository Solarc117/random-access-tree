'use strict'
import '../types/index.js'

export default class Node {
  /**
   * @type {number}
   */
  size

  /**
   * @param {Key} key
   * @param {number} index
   * @param {Node|null} [leftNode]
   * @param {Node|null} [rightNode]
   */
  constructor(key, index, leftNode = null, rightNode = null) {
    this.key = key
    this.index = index
    this.leftNode = leftNode
    this.rightNode = rightNode
  }
}
