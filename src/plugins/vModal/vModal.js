import vModal from "./vModal.vue";


let instance;
const installModal = (Vue, options) => {
  const Modal = Vue.extend(vModal);
  if (!instance) {
    instance = new Modal();
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el)
  }
  const modal = (settings) => {
    return new Promise((resolve, reject) => {
      instance.setDefaultOptions();
      if (typeof settings !== 'object') {
        console.error("请传入对象");
      } else {
        settings = Object.assign({}, settings, options);
        for (const key in settings) {
          if (instance[key] != undefined && typeof instance[key] != "function") {
            instance[key] = settings[key]
          }
        }
        // 确认
        instance.confirm = function () {
          if (instance.asyncClose) {
            instance.loading = true; // 异步关闭需加载等待
          } else {
            instance.showModal = false;
          }
          typeof settings['confirm'] == "function" && settings["confirm"]();
          resolve();
        }
        // 取消
        instance.cancel = function () {
          instance.showModal = false;
          if (typeof settings['cancel'] == "function") settings["cancel"]();
          else reject();
        }
      }
      instance.showModal = true;
    })
  }
  // 异步关闭modal
  modal.close = () => {
    instance.showModal = false;
  }
  //不关闭moadel直接清空loading
  modal.clearLoading = () => {
    instance.loading = false;
  }
  Vue.prototype.$modal = modal
}

export default {
  install: installModal
}