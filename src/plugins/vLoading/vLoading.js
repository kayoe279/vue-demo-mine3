import vLoading from "./vLoading.vue";


let instance;
export default {
  install: (Vue, options) => {
    const Loading = Vue.extend(vLoading);
    if (!instance) {
      instance = new Loading();
      instance.vm = instance.$mount();
      document.body.appendChild(instance.vm.$el)
    }
    const loading = {
      showLoading: (settings, cb) => {
        instance.setDefaultOptions();
        instance.isCover = false;
        if (typeof settings === 'string') {
          settings = { title: settings };
        }
        settings = Object.assign({}, settings, options);
        let { maskBgColor, theme, title, type, size, color } = settings;
        if (maskBgColor) instance.maskBgColor = maskBgColor;
        if (theme) instance.theme = theme;
        if (title) instance.title = title;
        if (type) instance.type = type;
        if (size) instance.size = size;
        if (color) instance.color = color;
  
        instance.show = true;
        typeof cb == "function" && cb();
      },
      // 覆盖全页面显示
      coverLoading: (settings, cb) => {
        instance.setDefaultOptions();
        instance.isCover = true;
        if (typeof settings === 'string') {
          instance.title = settings;
        } else {
          settings = Object.assign({}, settings, options);
          for (const key in settings) {
            if (instance[key] != undefined) instance[key] = settings[key]
          }
        }
        instance.show = true;
        typeof cb == "function" && cb();
      },
      hideLoading: (cb) => {
        instance.show = false;
        typeof cb == "function" && cb();
      }
    }
    Vue.prototype.$showLoading = loading.showLoading;
    Vue.prototype.$coverLoading = loading.coverLoading;
    Vue.prototype.$hideLoading = loading.hideLoading;
  }
}