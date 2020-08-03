var custom_website = new Map();

function init_custom_website() {
    if(checkCookie("custom_website")) {
        var custom_website_JSON = getCookie("custom_website");
        custom_website = _jsonToMap(custom_website_JSON);
    }
    
    //默认添加的网页
    if(!checkCookie("custom_website")) {
        addWebsitePanel("工具箱",
        ["ZoomEye",
        "Kenney",
        "mixamo",
        "Rinki",
        "智图",
        "Canva",
        "ASCII Generator",
        "OSGeo中国",
        "一个工具箱"
        ],
        ["https://www.zoomeye.org/",
        "https://www.kenney.nl/",
        "https://www.mixamo.com/#/",
        "http://rinki.world/auth/login",
        "https://zhitu.isux.us/",
        "https://www.canva.cn/",
        "http://patorjk.com/software/taag/",
        "https://www.osgeo.cn/app/",
        "http://www.atoolbox.net/"
        ]);
        addWebsitePanel("北化",
        ["数字校园",
         "教务处",
         "在线教育平台",
         "北化邮箱",
         "北化官网",
         "newJudge（内网可用）",
         "BUCTOJ"
        ],
        ["https://w.buct.edu.cn/",
        "https://jwglxt-proxy2.buct.edu.cn/jwglxt/xtgl/login_slogin.html?language=zh_CN&_t=1546417336865",
        "https://course-proxy2.buct.edu.cn/meol/index.do",
        "https://mail.buct.edu.cn/",
        "https://www.buct.edu.cn/",
        "http://10.14.48.107/new",
        "http://39.106.31.26/"
        ]);
    }
    

    for(let key of custom_website.keys()) {
        createWebsitePanel(key);
    }
}

//-------------------设置页面-----------------------------//
function createWebsitesGroup(title,names,urls) {
    var text = "";
    for(let i in names) {
        text += names[i] + '|' + urls[i] + ';\r';
    }

    var standardWebsitePanel = document.getElementById("edit-standard-website-panel");
    standardWebsitePanel.innerHTML += 
    "<div class='websites-group-piece' id='"+title+"-websitesgroup'>"+
        "<div class='website-group-piece'>"+
            "<input type=''text' value='"+title+"' class='edit-input-class' readonly='readonly' id='website-group-name'>"+
            "<button class='button-class edit-b-c right' onclick=\"getWebsitesGroup(\'"+title+"\')\"></button>"+
            "<button class='button-class edit-b-c delete' onclick=\"deleteWebsitesGroup(\'"+title+"\')\"></button>"+
        "</div>"+
        "<textarea id='"+title+"-textarea' class='websites-group'>"+text+"</textarea>"+
    "</div>";
}

function deleteWebsitesGroup(title) {
    $("#"+title+"-websitesgroup").remove();
    $("#"+title).remove();
    custom_website.delete(title);
    setCookie("custom_website",_mapToJson(custom_website));
}

function getWebsitesGroup(title) {
    var website = $("#"+title+"-textarea").val().trim();

    console.log(websites);
    var websites=website.split(';');
    var names = [];var urls = [];

    for(let i in websites) {
        if(websites[i] != ""){
            if(i === "0") {
                names[i] = websites[i].trim().slice(0,websites[i].indexOf('|'));
                urls[i] = websites[i].trim().slice(websites[i].indexOf('|')+1,websites[i].length);
            } else {
                names[i] = websites[i].trim().slice(0,websites[i].indexOf('|')-1);
                urls[i] = websites[i].trim().slice(websites[i].indexOf('|'),websites[i].length);
            }
        }
    }

    addWebsitePanel(title,names,urls);
    $("#"+title).remove();
    $("#"+title+"-websitesgroup").remove();
    createWebsitePanel(title,names,urls);
}

function setNewWebsitesGroup() {
    var title = $("#newGroupName").val();
    var websites = $("#newWebsites").val().split(';');
    console.log(websites);

    var names = [];var urls = [];

    for(let i in websites) {
        if(websites[i] != ""){
            if(i === "0") {
                names[i] = websites[i].trim().slice(0,websites[i].indexOf('|'));
                urls[i] = websites[i].trim().slice(websites[i].indexOf('|')+1,websites[i].length);
            } else {
                names[i] = websites[i].trim().slice(0,websites[i].indexOf('|')-1);
                urls[i] = websites[i].trim().slice(websites[i].indexOf('|'),websites[i].length);
            }
        }
    }

    addWebsitePanel(title,names,urls);
    createWebsitePanel(title);
}

//---------------下面这一段是添加定制组件函数---------------//
function addWebsitePanel(title,names,urls) {
    var tmp = new Object();
    tmp.names = names;
    tmp.urls = urls;
    custom_website.set(title,tmp);
    setCookie("custom_website",_mapToJson(custom_website));
}

//---------------下面这一段是动态创建组件函数---------------//
function createWebsitePanel(title) {
    if(!custom_website.has(title)) {
        console.log("该分类不存在");
        return;
    }
    var tmp = custom_website.get(title);
    var div = 
    "<div class='reco-websites standard-website-panel panel' id='"+title+"'>"+
        "<div class='panel-title'>"+
           title+
        "</div>"+
        "<div class='websites-table'>"+
            createTable(tmp.names,tmp.urls)+
        "</div>"+
    "</div>";
    var content = document.getElementById("website-group");
    content.innerHTML += div;

    createWebsitesGroup(title,tmp.names,tmp.urls);
}

//---------------下面这一段是动态表格处理函数---------------//
function createTable(names,urls) {
    //表格每行四个，列数不限
    var table = 
    "<table>"+
        "<tbody>"+
            "<tr>";

    var counter = 0;
    for(let i in names) {
        if(counter==0) {
            table += "<tr>";
        }
        counter++;
        table += 
        "<td>"+
            "<div class='website'>"+
                "<a class='website-a' target='_blank' href="+urls[i]+">"+names[i]+"</a>"+
            "</div>"+
        "</td>";
        if(counter==6) {
            table += "</tr>";
        }
    }

    table += 
        "</tbody>"+
    "</table>";
    return table;
}

function _strMapToObj(strMap) {
    let obj= Object.create(null);
    for (let[k,v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }
/**
*map转换为json
*/
function _mapToJson(map) {
   return JSON.stringify(this._strMapToObj(map));
}

function _objToStrMap(obj){
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k,obj[k]);
    }
    return strMap;
}
/**
*json转换为map
*/
function _jsonToMap(jsonStr){
    return this._objToStrMap(JSON.parse(jsonStr));
}