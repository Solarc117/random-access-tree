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
  constructor(key, index, leftNode = null, rightNode = null, size = 1) {
    this.key = key
    this.index = index
    this.leftNode = leftNode
    this.rightNode = rightNode
    this.size =
      // @ts-ignore
      size || (this.leftNode?.size || 0) + (this.rightNode?.size || 0) + 1
  }
}
