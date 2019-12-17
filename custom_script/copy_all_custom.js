module.exports = {
  copyAssets: {
    src: ['{{SRC}}/assets/images/*'],
    dest: '{{WWW}}/assets/images'
  },
  copyAssetsImg: {
    src: ['{{SRC}}/assets/img/*'],
    dest: '{{WWW}}/assets/img'
  },
  copyAssetsFont: {
    src: ['{{SRC}}/assets/fonts/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyAssetsIcomoonFont: {
    src: ['{{SRC}}/assets/fonts/icomoon/*'],
    dest: '{{WWW}}/assets/fonts/icomoon'
  },
  copyAssetsIconFavicon: {
    src: ['{{SRC}}/assets/icon/*'],
    dest: '{{WWW}}/assets/icon'
  },
  copyMobiscrollCss: {
    src: ['{{ROOT}}/src/lib/mobiscroll/css/*'],
    dest: '{{WWW}}/lib/mobiscroll/css/'
  },
  copyAssesti18n: {
    src: ['{{ROOT}}/src/assets/i18n/*'],
    dest: '{{WWW}}/assets/i18n'
  },
  copyAssestIconMoon: {
    src: ['{{ROOT}}/src/assets/css/*'],
    dest: '{{WWW}}/assets/css/'
  }
}