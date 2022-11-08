'use strict'

export default class ImmutableSortedSet {
  constructor() {}

  /**
   * @param {Key} key
   * @returns {ImmutableSortedSet}
   */
  add(key) {}

  /**
   * @returns {number}
   */
  size() {}

  /**
   * @param {Key} key
   * @returns {boolean}
   */
  contains(key) {}

  /**
   * @returns {(string|null)[]}
   */
  keys() {}

  /**
   * @param {number} index
   * @returns {string | null}
   * @throws {RangeError} If argument is out of the tree's range.
   */
  getAtIndex(index) {}

  /**
   * @param {Key} key
   * @returns {number}
   * @throws {RangeError} If argument is not in the set.
   */
  getIndex(key) {}

  /**
   * @param {string} key
   * @returns {ImmutableSortedSet}
   *
   */
  remove(key) {}
}

/**
 * @typedef {string|null} Key
 */
