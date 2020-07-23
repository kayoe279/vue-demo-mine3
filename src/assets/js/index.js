// 测试用的js文件
window.onload = function () {
    console.log('我是zz');
    var hello = document.getElementsByClassName('hello');
    for (let i = 0; i < hello.length; i++) {
        // hello[i].style.cssText = `
        //     font-size:20px;
        //     color:red;
        //     background-color:gray;
        //     text-align:center;
        //     border:1px solid black;
        //     box-sizing:border-box;
        // `
        
        hello[i].onmouseenter = function () {
            hello[i].style.border = '1px solid black'
        }
        hello[i].onmouseleave = function () {
            hello[i].style.border = 'none'
        }
    }



    

}