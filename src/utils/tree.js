/**
 * 从树中查询子节点
 * @param { Object } node 树节点
 * @param { Function } find 形如function(node) => XXX，XXX非空时停止遍历
 * @param { String } childrenKey 节点孩子数组的属性名，默认为children
 * @returns find函数返回非空时，返回XXX，如果没找到，返回null
 */
export function findTreeNode(node, find, childrenKey = 'children') {
  if (node instanceof Array) {
    for (const child of node) {
      const t = findTreeNode(child, find, childrenKey)
      if (t) {
        return t
      }
    }
    return null
  } else {
    const ok = find(node)
    if (ok) {
      return node
    } else if (node[childrenKey] instanceof Array) {
      return findTreeNode(node[childrenKey], find, childrenKey)
    } else {
      return null
    }
  }
}

// 遍历树，node为树节点，func形如function(node, parentList) => bool，返回true停止
export function mapTree(node, func, childrenKey = 'children') {
  const path = [node]
  mapTreeWithPathIter(path, node, func, childrenKey)
  return node
}

function mapTreeWithPathIter(path, node, func, childrenKey) {
  if (node instanceof Array) {
    for (const child of node) {
      if (mapTreeWithPathIter(path, child, func, childrenKey) === true) {
        return true
      }
    }
  } else if (node) {
    if (func(node, path) === true) {
      return true
    }
    path.push(node)
    if (mapTreeWithPathIter(path, node[childrenKey], func, childrenKey) === true) {
      return true
    }
    path.pop()
  }
}

// 替换对象属性
export const replaceObject = (obj1, obj2) => {
  if (isObject(obj1) && isObject(obj2)) {
    // 清除obj1的所有属性
    for(const k in obj1) {
      delete obj1[k]
    }
    // 替换为obj2的所有属性
    for (const k in obj2) {
      obj1[k] = obj2[k]
    }
  }
}

// 树形结构遍历（非递归，更快） tree: [...], func: (node) => { // ... })
// 迭代函数返回对象时替换原对象
export function mapTreeQuick(tree, func, childrenKey = 'children') {
  let node = null
  const list = [...tree]
  while ((node = list.shift())) {
    const children = node[childrenKey]
    // 执行迭代函数，返回对象时，替换原对象
    const result = func(node)
    if (isObject(result)) {
      // 清除原对象所有属性
      for(const k in node) {
        delete node[k]
      }
      // 替换为返回对象的所有属性
      for (const k in result) {
        node[k] = result[k]
      }
    }
    // 继续
    children && list.push(...children)
  }
  return tree
}

function isObject(arg) {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

/**
 * 从树中查找节点和访问路径
 * @param Object node 根节点
 * @param Function find 匹配节点的函数，返回true为找到
 * @param String childrenKey 子节点列表的属性名，默认值：children
 * @param Array parents 路径上的所有节点（内部使用）
 * @returns Array 从根节点到目标节点的路径上的所有节点，形如：[第一层父节点1, 第二层父节点, ..., 目标节点]
 */
 export const findWithPathInTree = function (node, find, childrenKey = 'children', parents = []) {
  if (node instanceof Array) {
    for (const child of node) {
      if (findWithPathInTree(child, find, childrenKey, parents)) {
        return parents
      }
    }
    return false
  } else {
    if (find(node)) {
      const copy = JSON.parse(JSON.stringify(node))
      delete copy[childrenKey]
      parents.push(copy)
      return true
    } else if (Array.isArray(node[childrenKey]) && node[childrenKey].length > 0) {
      const copy = JSON.parse(JSON.stringify(node))
      delete copy[childrenKey]
      parents.push(copy)
      const found = findWithPathInTree(node[childrenKey], find, childrenKey, parents)
      if (!found) {
        parents.pop()
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }
}