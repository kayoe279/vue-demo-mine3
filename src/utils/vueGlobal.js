/** 全局方法 */
import Vue from 'vue';

//excel导出数据
Vue.prototype.$exportExcel = function (name) {
  var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
  try {
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name + '.xlsx')
  } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
  return wbout
}

//开始时间不能大于结束时间
Vue.prototype.$timeValid = function (start, end) {
  if (start > end) {
    this.$message({
      type: 'warning',
      message: '开始时间不能大于结束时间'
    })
    return false;
  }
  return true;
}

//重置表单
Vue.prototype.resetForm = function (refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 统一处理
Vue.prototype.route = function (path) {
  console.log("this", this)
  this.$router.push(path);
}