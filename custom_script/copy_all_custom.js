module.exports = {
  copyAssets: {
    src: ['{{SRC}}/assets/images/*'],
    dest: '{{WWW}}/assets/images'
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