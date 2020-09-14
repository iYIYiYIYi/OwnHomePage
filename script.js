window.onload = init;

var titles = new Array();       //用户自定义网站名称
var userWebsites = new Array(); //用户自定义常用网站

function init() {


  init_custom_website();
  initPanels();
  initWebsites();
  // createRandomColorPanel();
  
  if(getCookie("useParticle") == "true") {
    $("#particle").attr("checked",true);
    animate();
    init_particle();
  }

  getTime();

  if(getCookie("bingBackground") == "true") {
    $("#bing-wallpaper").attr("checked",true);
    document.documentElement.style = "background: url(\"http://bing.ioliu.cn/v1/rand/?w=1280&h=720\");background-size: cover;background-repeat: no-repeat;";
  }
  
}

function useWallpaper() {
  if($("#bing-wallpaper").prop("checked")) {
      setCookie("bingBackground","true");
  } else {
      setCookie("bingBackground","false");
  }
}

function useParticle() {
  if($("#particle").prop("checked")) {
      setCookie("useParticle","true");
  } else {
      setCookie("useParticle","false");
  }
}


function search() {
  //搜索
    var keyword = document.getElementById("search-key").value;
    if(keyword===""){
        document.getElementById("search-key").placeholder = "请输入关键字";
        return false;
    }
      
    window.open(searchEngine.get(config.index)+keyword);
    return false;
}

function getTime() {
    var time = new Date();
    document.getElementById("clock").innerHTML = (time.getMonth()+1)+"月"+time.getDate()+"日"+time.getHours()+"时"+time.getMinutes()+"分";
    setTimeout("getTime()",1000);
}

/***
 * 初始化用户自定义网站
 */
function initWebsites() {
  titles = getCookie("siteNames").split(",");
  userWebsites = getCookie("websites").split(",");
  if(userWebsites.length == 0||userWebsites[0] == "") {
    return;
  }
  
  for(let i = 0; i < userWebsites.length-1; ++i) {
    loadCustomWebsite(userWebsites[i],titles[i]);
  }
}

function loadCustomWebsite(userWebsite,title) {
  if(userWebsite.indexOf('http') == -1||userWebsite.indexOf('https') == -1){
    userWebsite = 'http://' + userWebsite;
  }
  var counter = 0;
  var baseUrl;
  for(let i = 0;i < userWebsite.length; i++) {
    if(userWebsite.charAt(i) == '/') {
      counter ++;
      if(counter == 3) {
        baseUrl = userWebsite.substring(0,i);
      }
    }
  }
  
  var imgscr = baseUrl + "/favicoon.ico";

  var favo_websites = document.getElementById("favo-websites");
  if(validateImage(imgscr)){
    favo_websites.innerHTML += 
    "<div class='recent-website' id='"+title+"-userWebsite'>"+
      "<div class='remove-website' onclick='removeWebsite(\""+title+"\")'></div>"+
      "<a class='website-a' target='_blank' href="+userWebsite+">"+
        "<div class='website-icon' style='background: url("+baseUrl+"/favicon.ico"+") no-repeat;background-size:cover;'>"
        +"</div>"+
        title+
      "</a>"+
    "</div>";
  } else {

    favo_websites.innerHTML += 
    "<div class='recent-website' id='"+title+"-userWebsite'>"+
      "<div class='remove-website' onclick='removeWebsite(\""+title+"\")'></div>"+
      "<a class='website-a' target='_blank' href="+userWebsite+">"+
        "<div class='website-icon' >"
        +"</div>"+
        title+
      "</a>"+
    "</div>";
  }
}

function validateImage(url)
{    
  return new Promise(function(resolve, reject) {
    var ImgObj = new Image()
    ImgObj.src = url
    ImgObj.onload = function(res) {
      resolve(res)
    }
    ImgObj.onerror = function(err) {
      reject(err)
    }
  }).catch((e)=>{});

}

function submitWebsite() {
  var siteName = $("#input-custom-sitename").val();
  var url = $("#input-custom-website").val();
  var urlIndex = userWebsites.indexOf(url);
  if(urlIndex !== -1) {
    titles[i] = siteName;
    setCookie("siteNames",titles);
    initWebsites();
    return;
  }
  addWebsite(siteName,url);
  loadCustomWebsite(url,siteName);
  closeWindow('#add-website-window');
}

function removeWebsite(title) {
  $("#"+title+"-userWebsite").remove();
  var index = titles.indexOf(title);
  if(index !== -1) {
    titles.splice(index,1);
    userWebsites.splice(index,1);
    setCookie("siteNames",titles);
    setCookie("websites",userWebsites);
  }
}

/***
 * 添加用户自定义网站
 */
function addWebsite(siteName,url) {
  titles[titles.length-1]=(siteName+",");
  userWebsites[userWebsites.length-1]=(url+",");
  setCookie("websites",userWebsites);
  setCookie("siteNames",titles);
}

/***
 * 设置Cookie
 */
function setCookie(name,value) {
  var Days = 30;
  var exp = new Date(); 
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  var cookie = document.cookie;
  cookie = name+"="+value+ ";expires=" + exp.toGMTString();
  document.cookie = cookie;
}

/***
 * 获取Cookie
 */
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

/***
 * 检测Cookie
 */
function checkCookie(cname)
{
  var cookie=getCookie(cname);
  if (cookie!="")
  {
    return true;
  }
  return false;
}

/**
 * 将中文符号转换成英文符号
 */ 
function chineseChar2englishChar(chineseChar){
  // 将单引号‘’都转换成'，将双引号“”都转换成"
  var str = chineseChar.replace(/\’|\‘/g,"'").replace(/\“|\”/g,"\"");
  // 将中括号【】转换成[]，将大括号｛｝转换成{}
  str = str.replace(/\【/g,"[").replace(/\】/g,"]").replace(/\｛/g,"{").replace(/\｝/g,"}");
  // 将逗号，转换成,，将：转换成:
  str = str.replace(/，/g,",").replace(/：/g,":");
  return str;
}

//---------------下面这一段是JSON对象处理函数---------------//
function convertJSON(object){
  //将JSON对象转换为string
  var str = JSON.stringify(object);
  return str;
}

function convertObject(name){
  //从cookie读取JSON对象
  var object = JSON.parse(getCookie(name));
  return object;
}