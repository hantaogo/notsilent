const user = {
  state: {
    name: '',
    avatar: '',
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
  },

  actions: {
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        // 用户ID
        commit('SET_NAME', '匿名者')
        // 用户名
        commit('SET_AVATAR', '')
        resolve()
      })
    },

    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 不调用接口的登出
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        resolve()
      })
    },
  }
}

export default user
