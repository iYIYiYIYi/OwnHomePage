function activeWindow(id) {
    if ($(id).css('display')=='none') {
        $(id).show();
    } else {
        closeWindow(id);
    }
}

function closeWindow(id) {
    $(id).hide();
}

function loadJSON(objurl) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: objurl,
        success: function (result) {
            createRandomColorPanel(result);
        }
    });
}

function RandomIntegerInRange(min,max) {
    return Math.floor(Math.random()*(max - min +1) + min);
}

function randomRgbaColor(colorJSON,colorG) { //随机生成RGBA颜色,或选取预定颜色
    
    // var r = Math.floor(Math.random() * 256); //随机生成256以内r值
    // var g = Math.floor(Math.random() * 256); //随机生成256以内g值
    // var b = Math.floor(Math.random() * 256); //随机生成256以内b值
    // var alpha = Math.random()*minAlpha + 0.4; //随机生成1以内a值
    // return `rgba(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
    
    //选取预定颜色，存储在color.json文件中
    var colorC = colorJSON.color[colorG].length;
    return colorJSON.color[colorG][RandomIntegerInRange(0,colorC-1)];
}

function chooseWhiteOrBlack(backgroundcolor) {
    var num = backgroundcolor.substring(backgroundcolor.indexOf('(') + 1, backgroundcolor.lastIndexOf(')')).split(/,\s*/);
    var r = num[0] % 256;
    var g = num[1] % 256;
    var b = num[2] % 256;
    if ( (r+g+b <= 250 && r+g+b >=150) || r+g+b >= 600) {
        return `rgba(0,0,0,1)`;
    } else {
        return `rgba(255,255,255,1)`;
    }
}

//this functon is useless, maybe it will be useful in the future
// function oppositRgbaColor(color) {

//     var num = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),(\d+.\d+)\)$/);//r,g,b
//     var r = (256 - num[1] - Math.random()*3*(2.5-num[4])) %256;
//     var g = (256 - num[2] - Math.random()*3*(2.5-num[4])) %256;
//     var b = (256 - num[3] - Math.random()*3*(2.5-num[4])) %256;
//     var alpha = 1;
//     return `rgba(${r},${g},${b},${alpha})`;

// }

function createRandomColorPanel(colorJSON) {
    var colorNum = colorJSON.color.length;  //确定所有颜色
    var colorG = RandomIntegerInRange(0,colorNum-1); //随机选择颜色组
    var elems = document.getElementsByClassName("panel");
    for(let el of elems) {
        
        var background_color = randomRgbaColor(colorJSON,colorG);
        var font_color = chooseWhiteOrBlack(background_color);
        el.style['background-color'] = background_color;
        el.style.color = font_color;
        
        if(el.id === "edit-window") {
            background_color = randomRgbaColor(colorJSON,colorG);
            font_color = chooseWhiteOrBlack(background_color);
            el.style['background-color'] = background_color;
            el.style.color = font_color;
        }
    }
    var buttoms = document.getElementsByClassName("edit-square-button");
    for(let b of buttoms) {
        var background_color = randomRgbaColor(colorJSON,colorG);
        var font_color = chooseWhiteOrBlack(background_color);
        b.style['background-color'] = background_color;
        b.style.color = font_color;
    }
   
}

var menus = ["edit-home-panel","edit-search-engine-panel","edit-standard-website-panel","edit-user-info"];
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

