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

function oppositRgbaColor(color) {

    var num = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),(\d+.\d+)\)$/);//r,g,b
    console.log(num);
    var r = (256 - num[1] - Math.random()*3*(2.5-num[4])) %256;
    var g = (256 - num[2] - Math.random()*3*(2.5-num[4])) %256;
    var b = (256 - num[3] - Math.random()*3*(2.5-num[4])) %256;
    var alpha = 1;
    return `rgba(${r},${g},${b},${alpha})`;

}

function createRandomColorPanel() {
    var elems = document.getElementsByClassName("panel");
    for(let el of elems) {
        
        var background_color = randomRgbaColor(1.7);
        var opposit_color = oppositRgbaColor(background_color);
        el.style['background-color'] = background_color;
        el.style.color = opposit_color;
        
        if(el.id === "edit-window") {
            background_color = randomRgbaColor(5);
            opposit_color = oppositRgbaColor(background_color);
            el.style['background-color'] = background_color;
            el.style.color = opposit_color;
        }
        console.log(opposit_color);

    }
    var buttoms = document.getElementsByClassName("edit-square-button");
    for(let b of buttoms) {
        var background_color = randomRgbaColor(1);
        var opposit_color = oppositRgbaColor(background_color);
        b.style['background-color'] = background_color;
        b.style.color = opposit_color;
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

