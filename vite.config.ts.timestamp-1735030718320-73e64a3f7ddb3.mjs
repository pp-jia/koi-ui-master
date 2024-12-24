// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/ppj/Desktop/yjs/%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3/%E4%BF%A1%E6%81%AF%E6%8A%BD%E5%8F%96/koi-ui-master/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.2_sass@1.83.0/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/ppj/Desktop/yjs/%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3/%E4%BF%A1%E6%81%AF%E6%8A%BD%E5%8F%96/koi-ui-master/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.11_@types+node@22.10.2_sass@1.83.0__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueSetupExtend from "file:///C:/Users/ppj/Desktop/yjs/%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3/%E4%BF%A1%E6%81%AF%E6%8A%BD%E5%8F%96/koi-ui-master/node_modules/.pnpm/vite-plugin-vue-setup-extend@0.4.0_vite@5.4.11_@types+node@22.10.2_sass@1.83.0_/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///C:/Users/ppj/Desktop/yjs/%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3/%E4%BF%A1%E6%81%AF%E6%8A%BD%E5%8F%96/koi-ui-master/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.11_@types+node@22.10.2_sass@1.83.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import Unocss from "file:///C:/Users/ppj/Desktop/yjs/%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3/%E4%BF%A1%E6%81%AF%E6%8A%BD%E5%8F%96/koi-ui-master/node_modules/.pnpm/unocss@0.61.9_postcss@8.4.49_rollup@4.29.1_vite@5.4.11_@types+node@22.10.2_sass@1.83.0_/node_modules/unocss/dist/vite.mjs";
import { viteMockServe } from "file:///C:/Users/ppj/Desktop/yjs/%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3/%E4%BF%A1%E6%81%AF%E6%8A%BD%E5%8F%96/koi-ui-master/node_modules/.pnpm/vite-plugin-mock@3.0.2_esbuild@0.23.1_mockjs@1.1.0_vite@5.4.11_@types+node@22.10.2_sass@1.83.0_/node_modules/vite-plugin-mock/dist/index.mjs";
import viteCompression from "file:///C:/Users/ppj/Desktop/yjs/%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3/%E4%BF%A1%E6%81%AF%E6%8A%BD%E5%8F%96/koi-ui-master/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.4.11_@types+node@22.10.2_sass@1.83.0_/node_modules/vite-plugin-compression/dist/index.mjs";
import path from "path";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      Unocss(),
      vueSetupExtend(),
      viteCompression(),
      createSvgIconsPlugin({
        // 配置SVG图片
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      // 配置mock
      viteMockServe({
        // 解析根目录下的mock文件夹
        mockPath: "mock",
        // @ts-ignore
        localEnabled: command === "serve",
        // 保证开发阶段可以使用mock接口
        supportTs: true,
        // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true
        // 监视文件更改 更改mock的时候，不需要重新启动编译
      })
    ],
    resolve: {
      // 配置路径别名
      alias: {
        "@": path.resolve("./src"),
        // 相对路径别名配置，使用 @ 代替 src
        "~": path.resolve("./src")
      }
    },
    css: {
      // css全局变量使用，@/styles/variable.scss文件
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    server: {
      host: "localhost",
      // 配置localhost、本机IP地址
      port: 5730,
      // 端口号
      hmr: true,
      // 热更新
      open: true,
      // 自动打开
      proxy: {
        // 代理跨域
        [env.VITE_WEB_BASE_API]: {
          // 配置哪个环境下的
          target: env.VITE_SERVER,
          rewrite: (path2) => path2.replace(new RegExp("^" + env.VITE_WEB_BASE_API), ""),
          // 路径重写，例如：将路径中包含dev-api字段替换为空。注意：只有请求真实后端接口才会有用，使用mock接口还是得带koi
          // 允许跨域
          changeOrigin: true
        }
      }
    },
    esbuild: {
      // 在生产环境全部去除console 和 debugger
      drop: env.VITE_DROP_CONSOLE.length < 5 ? ["console", "debugger"] : []
    },
    // 预编译，增加访问速度，针对node_modules
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "echarts",
        "vue-i18n",
        "element-plus/es/components/text/style/css",
        "element-plus/es/components/collapse-item/style/css",
        "element-plus/es/components/collapse/style/css",
        "element-plus/es/components/space/style/css",
        "element-plus/es/components/container/style/css",
        "element-plus/es/components/aside/style/css",
        "element-plus/es/components/main/style/css",
        "element-plus/es/components/header/style/css",
        "element-plus/es/components/button-group/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/transfer/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/tab-pane/style/css"
      ]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwcGpcXFxcRGVza3RvcFxcXFx5anNcXFxcXHU5ODc5XHU3NkVFXHU3NkY4XHU1MTczXFxcXFx1NEZFMVx1NjA2Rlx1NjJCRFx1NTNENlxcXFxrb2ktdWktbWFzdGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwcGpcXFxcRGVza3RvcFxcXFx5anNcXFxcXHU5ODc5XHU3NkVFXHU3NkY4XHU1MTczXFxcXFx1NEZFMVx1NjA2Rlx1NjJCRFx1NTNENlxcXFxrb2ktdWktbWFzdGVyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9wcGovRGVza3RvcC95anMvJUU5JUExJUI5JUU3JTlCJUFFJUU3JTlCJUI4JUU1JTg1JUIzLyVFNCVCRiVBMSVFNiU4MSVBRiVFNiU4QSVCRCVFNSU4RiU5Ni9rb2ktdWktbWFzdGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBDb25maWdFbnYsIFVzZXJDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG4vLyBrZWVwQWxpdmUgXHU3RUM0XHU0RUY2bmFtZVxuaW1wb3J0IHZ1ZVNldHVwRXh0ZW5kIGZyb20gXCJ2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kXCI7XG4vLyBcdTVGMTVcdTUxNjVzdmdcdTk3MDBcdTg5ODFcdTc2ODRcdTYzRDJcdTRFRjZcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xuaW1wb3J0IFVub2NzcyBmcm9tIFwidW5vY3NzL3ZpdGVcIjtcbi8vIFx1NjU3MFx1NjM2RW1vY2tcdTkxNERcdTdGNkVcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tIFwidml0ZS1wbHVnaW4tbW9ja1wiO1xuLy8gZ3ppcFx1NTM4Qlx1N0YyOVxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG4vLyBcdTkxNERcdTdGNkVtb2NrXHU2ODM5XHU2MzZFXHU1Qjk4XHU3RjUxXHVGRjBDXHU4RkQ5XHU5MUNDXHU1MTk5XHU2Q0Q1XHU1QzA2XHU2NTM5XHU2MjEwXHU3QkFEXHU1OTM0XHU1MUZEXHU2NTcwXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTsgLy8gXHU4M0I3XHU1M0Q2XHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHU1MjJCXHU1NDBEXHU5MTREXHU3RjZFXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICBVbm9jc3MoKSxcbiAgICAgIHZ1ZVNldHVwRXh0ZW5kKCksXG4gICAgICB2aXRlQ29tcHJlc3Npb24oKSxcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcbiAgICAgICAgLy8gXHU5MTREXHU3RjZFU1ZHXHU1NkZFXHU3MjQ3XG4gICAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwic3JjL2Fzc2V0cy9pY29uc1wiKV0sXG4gICAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCJcbiAgICAgIH0pLFxuICAgICAgLy8gXHU5MTREXHU3RjZFbW9ja1xuICAgICAgdml0ZU1vY2tTZXJ2ZSh7XG4gICAgICAgIC8vIFx1ODlFM1x1Njc5MFx1NjgzOVx1NzZFRVx1NUY1NVx1NEUwQlx1NzY4NG1vY2tcdTY1ODdcdTRFRjZcdTU5MzlcbiAgICAgICAgbW9ja1BhdGg6IFwibW9ja1wiLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGxvY2FsRW5hYmxlZDogY29tbWFuZCA9PT0gXCJzZXJ2ZVwiLCAvLyBcdTRGRERcdThCQzFcdTVGMDBcdTUzRDFcdTk2MzZcdTZCQjVcdTUzRUZcdTRFRTVcdTRGN0ZcdTc1Mjhtb2NrXHU2M0E1XHU1M0UzXG4gICAgICAgIHN1cHBvcnRUczogdHJ1ZSwgLy8gXHU2MjUzXHU1RjAwXHU1NDBFXHVGRjBDXHU1M0VGXHU0RUU1XHU4QkZCXHU1M0Q2IHRzIFx1NjU4N1x1NEVGNlx1NkEyMVx1NTc1N1x1MzAwMiBcdThCRjdcdTZDRThcdTYxMEZcdUZGMENcdTYyNTNcdTVGMDBcdTU0MEVcdTVDMDZcdTY1RTBcdTZDRDVcdTc2RDFcdTg5QzYuanMgXHU2NTg3XHU0RUY2XHUzMDAyXG4gICAgICAgIHdhdGNoRmlsZXM6IHRydWUgLy8gXHU3NkQxXHU4OUM2XHU2NTg3XHU0RUY2XHU2NkY0XHU2NTM5IFx1NjZGNFx1NjUzOW1vY2tcdTc2ODRcdTY1RjZcdTUwMTlcdUZGMENcdTRFMERcdTk3MDBcdTg5ODFcdTkxQ0RcdTY1QjBcdTU0MkZcdTUyQThcdTdGMTZcdThCRDFcbiAgICAgIH0pXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdThERUZcdTVGODRcdTUyMkJcdTU0MERcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoXCIuL3NyY1wiKSwgLy8gXHU3NkY4XHU1QkY5XHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHU5MTREXHU3RjZFXHVGRjBDXHU0RjdGXHU3NTI4IEAgXHU0RUUzXHU2NkZGIHNyY1xuICAgICAgICBcIn5cIjogcGF0aC5yZXNvbHZlKFwiLi9zcmNcIilcbiAgICAgIH1cbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgLy8gY3NzXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHU0RjdGXHU3NTI4XHVGRjBDQC9zdHlsZXMvdmFyaWFibGUuc2Nzc1x1NjU4N1x1NEVGNlxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6ICdAaW1wb3J0IFwiLi9zcmMvc3R5bGVzL3ZhcmlhYmxlLnNjc3NcIjsnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogXCJsb2NhbGhvc3RcIiwgLy8gXHU5MTREXHU3RjZFbG9jYWxob3N0XHUzMDAxXHU2NzJDXHU2NzNBSVBcdTU3MzBcdTU3NDBcbiAgICAgIHBvcnQ6IDU3MzAsIC8vIFx1N0FFRlx1NTNFM1x1NTNGN1xuICAgICAgaG1yOiB0cnVlLCAvLyBcdTcwRURcdTY2RjRcdTY1QjBcbiAgICAgIG9wZW46IHRydWUsIC8vIFx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU0RUUzXHU3NDA2XHU4REU4XHU1N0RGXG4gICAgICAgIFtlbnYuVklURV9XRUJfQkFTRV9BUEldOiB7XG4gICAgICAgICAgLy8gXHU5MTREXHU3RjZFXHU1NEVBXHU0RTJBXHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9TRVJWRVIsXG4gICAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIGVudi5WSVRFX1dFQl9CQVNFX0FQSSksIFwiXCIpLCAvLyBcdThERUZcdTVGODRcdTkxQ0RcdTUxOTlcdUZGMENcdTRGOEJcdTU5ODJcdUZGMUFcdTVDMDZcdThERUZcdTVGODRcdTRFMkRcdTUzMDVcdTU0MkJkZXYtYXBpXHU1QjU3XHU2QkI1XHU2NkZGXHU2MzYyXHU0RTNBXHU3QTdBXHUzMDAyXHU2Q0U4XHU2MTBGXHVGRjFBXHU1M0VBXHU2NzA5XHU4QkY3XHU2QzQyXHU3NzFGXHU1QjlFXHU1NDBFXHU3QUVGXHU2M0E1XHU1M0UzXHU2MjREXHU0RjFBXHU2NzA5XHU3NTI4XHVGRjBDXHU0RjdGXHU3NTI4bW9ja1x1NjNBNVx1NTNFM1x1OEZEOFx1NjYyRlx1NUY5N1x1NUUyNmtvaVxuICAgICAgICAgIC8vIFx1NTE0MVx1OEJCOFx1OERFOFx1NTdERlxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBlc2J1aWxkOiB7XG4gICAgICAvLyBcdTU3MjhcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUxNjhcdTkwRThcdTUzQkJcdTk2NjRjb25zb2xlIFx1NTQ4QyBkZWJ1Z2dlclxuICAgICAgZHJvcDogZW52LlZJVEVfRFJPUF9DT05TT0xFLmxlbmd0aCA8IDUgPyBbXCJjb25zb2xlXCIsIFwiZGVidWdnZXJcIl0gOiBbXVxuICAgIH0sXG4gICAgLy8gXHU5ODg0XHU3RjE2XHU4QkQxXHVGRjBDXHU1ODlFXHU1MkEwXHU4QkJGXHU5NUVFXHU5MDFGXHU1RUE2XHVGRjBDXHU5NDg4XHU1QkY5bm9kZV9tb2R1bGVzXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgIFwidnVlXCIsXG4gICAgICAgIFwidnVlLXJvdXRlclwiLFxuICAgICAgICBcInBpbmlhXCIsXG4gICAgICAgIFwiYXhpb3NcIixcbiAgICAgICAgXCJAdnVldXNlL2NvcmVcIixcbiAgICAgICAgXCJlY2hhcnRzXCIsXG4gICAgICAgIFwidnVlLWkxOG5cIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90ZXh0L3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbGxhcHNlLWl0ZW0vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sbGFwc2Uvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3BhY2Uvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29udGFpbmVyL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2FzaWRlL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21haW4vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaGVhZGVyL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2J1dHRvbi1ncm91cC9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1idXR0b24vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2hlY2tib3gtZ3JvdXAvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZm9ybS9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9mb3JtLWl0ZW0vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnV0dG9uL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2lucHV0L3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2lucHV0LW51bWJlci9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zd2l0Y2gvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdXBsb2FkL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lbnUvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ljb24vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcm93L3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhZy9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kaWFsb2cvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbG9hZGluZy9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1ncm91cC9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9wb3BvdmVyL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Njcm9sbGJhci9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90b29sdGlwL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Ryb3Bkb3duL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Ryb3Bkb3duLW1lbnUvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJvcGRvd24taXRlbS9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zdWItbWVudS9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51LWl0ZW0vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZGl2aWRlci9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jYXJkL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xpbmsvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnJlYWRjcnVtYi9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9icmVhZGNydW1iLWl0ZW0vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFibGUvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdHJlZS1zZWxlY3Qvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFibGUtY29sdW1uL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NlbGVjdC9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9vcHRpb24vc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcGFnaW5hdGlvbi9zdHlsZS9jc3NcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2FsZXJ0L3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NoZWNrYm94L3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RhdGUtcGlja2VyL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RyYW5zZmVyL3N0eWxlL2Nzc1wiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYnMvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW1hZ2Uvc3R5bGUvY3NzXCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFiLXBhbmUvc3R5bGUvY3NzXCJcbiAgICAgIF1cbiAgICB9XG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1osU0FBUyxjQUFjLGVBQXNDO0FBQy9jLE9BQU8sU0FBUztBQUVoQixPQUFPLG9CQUFvQjtBQUUzQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLFlBQVk7QUFFbkIsU0FBUyxxQkFBcUI7QUFFOUIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxVQUFVO0FBSWpCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQTZCO0FBQ3hFLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFDdkMsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsZUFBZTtBQUFBLE1BQ2YsZ0JBQWdCO0FBQUEsTUFDaEIscUJBQXFCO0FBQUE7QUFBQSxRQUVuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0FBQUEsUUFDMUQsVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBO0FBQUEsTUFFRCxjQUFjO0FBQUE7QUFBQSxRQUVaLFVBQVU7QUFBQTtBQUFBLFFBRVYsY0FBYyxZQUFZO0FBQUE7QUFBQSxRQUMxQixXQUFXO0FBQUE7QUFBQSxRQUNYLFlBQVk7QUFBQTtBQUFBLE1BQ2QsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFNBQVM7QUFBQTtBQUFBLE1BRVAsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsT0FBTztBQUFBO0FBQUEsUUFDekIsS0FBSyxLQUFLLFFBQVEsT0FBTztBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBO0FBQUEsTUFFSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixtQkFBbUI7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sS0FBSztBQUFBO0FBQUEsTUFDTCxNQUFNO0FBQUE7QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBLFFBRUwsQ0FBQyxJQUFJLGlCQUFpQixHQUFHO0FBQUE7QUFBQSxVQUV2QixRQUFRLElBQUk7QUFBQSxVQUNaLFNBQVMsQ0FBQUEsVUFBUUEsTUFBSyxRQUFRLElBQUksT0FBTyxNQUFNLElBQUksaUJBQWlCLEdBQUcsRUFBRTtBQUFBO0FBQUE7QUFBQSxVQUV6RSxjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBO0FBQUEsTUFFUCxNQUFNLElBQUksa0JBQWtCLFNBQVMsSUFBSSxDQUFDLFdBQVcsVUFBVSxJQUFJLENBQUM7QUFBQSxJQUN0RTtBQUFBO0FBQUEsSUFFQSxjQUFjO0FBQUEsTUFDWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
