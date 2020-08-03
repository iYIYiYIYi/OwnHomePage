function activeWindow(id) {
    $(id).fadeIn(200);
}

function closeWindow(id) {
    $(id).fadeOut(200);
}

function randomRgbaColor(minAlpha) { //随机生成RGBA颜色
    var r = Math.floor(Math.random() * 256); //随机生成256以内r值
    var g = Math.floor(Math.random() * 256); //随机生成256以内g值
    var b = Math.floor(Math.random() * 256); //随机生成256以内b值
    var alpha = Math.random()*minAlpha + 0.4; //随机生成1以内a值
    return `rgba(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
}


function createRandomColorPanel() {
    var elems = document.getElementsByClassName("panel");
    for(let el of elems) {
        el.style['background-color'] = randomRgbaColor(1.5);
        if(el.id === "edit-window")
            el.style['background-color'] = randomRgbaColor(5);
    }
    var buttoms = document.getElementsByClassName("edit-square-button");
    for(let b of buttoms) {
        b.style['background-color'] = randomRgbaColor(1);
    }
    // document.documentElement.style['background-color'] = randomRgbaColor(1); //主页随机颜色
}

var menus = ["edit-home-panel","edit-search-engine-panel","edit-standard-website-panel"];
function showMenuContent(menuName) {
    var index = menus.indexOf(menuName);
    for(let i in menus) {
        if(index == i){
            document.getElementById(menus[i]).style['display'] = 'inherit';
        } else {
            document.getElementById(menus[i]).style['display'] = 'none';
        }
    }
}

