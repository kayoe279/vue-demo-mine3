(function () {
    var Thtml = document.documentElement;
    function onWindowResize() {
		Thtml.style.fontSize = Thtml.getBoundingClientRect().width * 100 / 750  + 'px';
    }
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
})();