import Vue from 'vue';
import router from '@/router/index.js';

// upload

// validate

// upload url
// Vue.prototype.$uploadUrl=`${BASE_URL}api/admin/upload`;
// Vue.prototype.$uploadUrl=`http://yacht.test/api/admin/upload`;
// Vue.prototype.$uploadUrl=`${BASE_URL}api/admin/upload?upload_type=banner`;
// Vue.prototype.$uploadUrl=`http://yacht.test/api/admin/upload?upload_type=banner`;

// role
Vue.prototype.$getRole=function(){
  return window.sessionStorage.getItem('ROLE');
}

// judgeRole
Vue.prototype.$judgeRole=function(role='admin'){
  return Vue.prototype.$getRole()==role;
}

// getRandomTagType
Vue.prototype.$getRandomTagType=function(){
  let types=['success','info','warning','danger'];
  let index=Math.round(Math.random()*(types.length));

  return types[index];
}

// removeArticle
Vue.prototype.$removeArticle=function(id,cb){
  let msg='确定要删除吗?';

  this.$confirm(msg, '提示', {
    type: 'warning'
  }).then(() => {
    this.$ajax("delete",`articles/${id}`).then(res=>{
      cb&&cb();
      this.$message({
        message: '文章删除成功',
        type: 'success'
      });
    });
  }).catch(() => {

  });
}

Vue.prototype.$removeYachtGroup=function(id,cb){
  let msg='确定要删除吗?';

  this.$confirm(msg, '提示', {
    type: 'warning'
  }).then(() => {
    this.$ajax("delete",`admin/moments/${id}`).then(res=>{
      cb&&cb();
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    });
  }).catch(() => {

  });
}

Vue.prototype.$updateYachtGroup=function(id,status,cb){
  let data={
    id:id,
    status:status,
  };

  this.$ajax("put",`admin/moments/${id}`,data).then(res=>{
    cb();
    this.$message.success("操作成功");
  });
}

// toUpdateArticle
Vue.prototype.$toUpdateArticle=function(id){
  router.push(`/article/media-info/article-show/${id}`);
}

Vue.prototype.$toUpdateBrand=function(id){
  router.push(`/brand/show/${id}`);
}

Vue.prototype.$toUpdateBrandYacht=function(id){
  router.push(`/brand/yacht-show/${id}/0`);
}

Vue.prototype.$toUpdateWharf=function(id){
  router.push(`/wharf/show/${id}`);
}

Vue.prototype.$toAddBrandYacht=function(id){
  router.push(`/brand/yacht-show/0/${id}`);
}

Vue.prototype.$toUpdateYachtSold=function(id){
  router.push(`/yacht-sold/show/${id}`);
}

Vue.prototype.$toYachtGroup=function(id){
  router.push(`/yacht-group/show/${id}`);
}

Vue.prototype.$toImportCatchData=function(id){
  router.push({name:"catch-data-edit",params:{id:id}});
}


// switchStatus
Vue.prototype.$switchState=function(uri,val,cb,column='active'){
    console.log(column);
  let data={
      active:val
  };
  if(column == 'status'){
    data = {
      status:val
    }
  }
  if(column == 'is_top'){
      data = {
          is_top:val
      }
  }
  console.log(data);
  this.$ajax("put",uri,data).then(res=>{
    cb&&cb();
    this.$message.success(res.data.message);
  });
}

// $switchActive
Vue.prototype.$switchActive=function(uri,val,cb){
    let data={
        active:val
    };
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        this.$ajax("delete",uri,data).then(res=>{
            cb&&cb();
            data = res.data;
            if (data.status_code == 0) {
                this.$message({
                    message: data.message,
                    type: 'success'
                });
            } else {
                this.$message({
                    message: data.message,
                    type: 'error'
                });

            }
        });
    })
};

Vue.prototype.$switchArticleState=function(id,val,cb){
  let data={
    id:id,
    type:"active",
    active:val
  };

  this.$ajax("put",`articles/${id}`,data).then(res=>{
    cb&&cb();
    this.$message.success("状态更新成功");
  });
}
Vue.prototype.$switchArticleTop=function(id,val,cb){
  let data={
    is_top:val,
  };

  this.$ajax("put",`articles/${id}`,data).then(res=>{
    cb&&cb();
    this.$message.success("状态更新成功");
  });
}

Vue.prototype.$switchBadgeState=function(id,val,cb){
  let data={
    id:id,
    badge_status:val,
  };

  this.$ajax("put",`admin/catch-data/${id}`,data).then(res=>{
    cb&&cb();
    this.$message.success("状态更新成功");
  });
}

// showImage
Vue.prototype.$showImage=function(src,e,dialog){
  let imgW=e.target.naturalWidth+40;
  let winW=document.documentElement.clientWidth*.9;

  dialog.src=src;
  dialog.width=imgW>winW?`${winW}px`:`${imgW}px`;
  dialog.visible=true;
}

//excel导出数据
Vue.prototype.$exportExcel = function (name) {
    var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }),name+ '.xlsx')
    } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
    return wbout
}

//改变状态
Vue.prototype.$changeStatus = function(cb){
    cb&&cb();
}
//开始时间不能大于结束时间
Vue.prototype.$timeValid = function (start,end) {
    if(start > end){
      this.$message({
          type:'warning',
          message:'开始时间不能大于结束时间'
      })
      return false;
    }
    return true;
}

//重置表单
Vue.prototype.resetForm = function (refName){
  if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 统一处理
Vue.prototype.route = function (path) {
  console.log("this", this)
  this.$router.push(path);
}