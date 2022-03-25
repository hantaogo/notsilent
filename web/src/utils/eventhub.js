export let sharedEventHub = null

export const createSharedEventHub = () => {
  sharedEventHub = createEventHub()
}

export const createEventHub = () => {
  console.log('[eventhub] createEventHub')
  let listenerMap = {}
  let blackboard = {}
  const on = (name, listener) => {
    console.log('[eventhub] on', name)
    if (!listenerMap[name]) {
      listenerMap[name] = new Set()
    }
    const listenerSet = listenerMap[name]
    listenerSet.add(listener)
  }
  const off = (name, listener) => {
    console.log('[eventhub] off', name)
    if (!listenerMap[name]) {
      return
    }
    const listenerSet = listenerMap[name]
    listenerSet.delete(listener)
    if (listenerSet.size === 0) {
      delete listenerMap[name]
    }
  }
  const emit = (name, event) => {
    console.log('[eventhub] emit', name)
    // 记录到黑板
    blackboard[name] = event
    // 查找监听器
    if (!listenerMap[name]) {
      return
    }
    const listenerSet = listenerMap[name]
    listenerSet.forEach(listener => {
      Promise.resolve(listener).then(async fn => {
        await fn(event)
      })
    })
  }
  const get = (name, defVal = undefined) => {
    if (blackboard[name] !== undefined) {
      return blackboard[name]
    } else {
      return defVal
    }
  }
  const getAll = () => {
    return blackboard
  }
  const clear = () => {
    clearBlackboard()
    clearListener()
  }
  const clearBlackboard = () => {
    console.log('[eventhub] clearBlackboard')
    blackboard = {}
  }
  const clearListener = () => {
    console.log('[eventhub] clearListener')
    listenerMap = {}
  }
  return {
    on,
    off,
    emit,
    get,
    getAll,
    clear,
    clearBlackboard,
    clearListener,
  }
}