import atomStyle from '@vite-plugin-vue-atom-style/core'
import presetFower from '@vite-plugin-vue-atom-style/preset-fower'
import vue from '@vitejs/plugin-vue'
import svgIcon from 'vite-plugin-svg-icons'
import path from 'path'

export default function createVitePlugins(viteEnv, isBuild = false) {
  return [
    atomStyle({
      presets: [presetFower],
      // vue第一行为 <!-- atom-style --> 时，才使用这个插件
      flag: '<!-- atom-style -->',
      // vue第一行为 <!-- atom-style-ignore --> 时，不使用这个插件
      ignoreFlag: '<!-- atom-style-ignore -->',
    }),
    vue(),
    svgIcon({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: isBuild
    })
  ]
}
