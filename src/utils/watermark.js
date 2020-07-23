var defaultOptions = {
    textMark: '测试',
    rotate: 30,
    rows: 60,
    parentContainer: document.body
} // 默认参数
var waterMark = {};
// 初始化
waterMark.loadMark = function (options) {
    var params = Object.assign({}, defaultOptions, options);
    var watermarkDiv = document.createElement("div");
    watermarkDiv.setAttribute("style", `width:100%;height:100%;position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`);
    watermarkDiv.setAttribute("id", "_wm");
    watermarkDiv.innerHTML = "";
    for (let i = 0; i < params.rows; i++) {
        var divs = document.createElement("div");
        divs.setAttribute(
            "style",
            `
            position:absolute;
            width:120px;
            height:120px;
            font-size:0.3rem;
            left: ${i % 2 == 0 ? 72.5 : 252.5}px;
            top: ${i * 80 + 20}px;
            transform: rotate(-${params.rotate}deg) translateX(${
            (i + 1) % 4 == 0 ? 80 : 0
            }px);
            text-align:${i % 4 == 0 ? "center" : "left"};
            z-index:500;
            opacity: 0.15;
            color: #333;
            `
        );
        divs.innerHTML = params.textMark;
        watermarkDiv.appendChild(divs);
    }
    if (params.parentContainer) {
        params.parentContainer.appendChild(watermarkDiv);
    }
}
// 移除水印
waterMark.removeMark = function () {
    var _wm = document.querySelector("#_wm");
    if (_wm) {
        var parentElement = _wm.parentNode;
        if (parentElement) parentElement.removeChild(_wm);
    }
}

export default waterMark