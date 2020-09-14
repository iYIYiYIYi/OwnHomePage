var config = {
    title:"CLARQUES NAV",
    tab:"CLARQUES PRO",
    index:"百度",

    global(){
        return this;
    }
};
var searchEngine = new Map();//用户自定义搜索引擎

function initPanels() {
    if(!checkCookie("searchEngine")) {
        searchEngine.set("百度","https://www.baidu.com/s?&wd=");
        searchEngine.set("多吉搜索","https://www.dogedoge.com/results?q=");
        searchEngine.set("搜狗","https://www.sogou.com/web?query=");
        searchEngine.set("gobai","https://gobaidugle.com/search?keyword=");
        searchEngine.set("知乎","https://www.zhihu.com/search?type=content&q=");
        setCookie("searchEngine",_mapToJson(searchEngine));
    }
    if(checkCookie("searchEngine")) {
        searchEngine = _jsonToMap(getCookie("searchEngine"));
    }
    if(checkCookie("config")) {
        config = convertObject("config");
    }
    if(config != null) {
        head.innerHTML = config.title;
        index = config.index;
        document.getElementById("ohp-title").innerText = config.tab;
    }
    initEnginePanel();
}

function changeTitle() {
    var title1 = $("#title-area").val();
    title1 = title1.replace(/\n/g,"<br/>");
    var tab1 = $("#title-input").val();
    var head = document.getElementById("head");
    if(title1 != ""){
        head.innerHTML = title1;
        this.config.title = title1;
    }
    if(tab1 !=""){
        document.getElementById("ohp-title").innerText = tab1;
        this.config.tab = tab1;
    }
    setCookie("config", convertJSON(this.config));
}


function adjustsearchEngine(name,url) {
    name = name.replace(" ","");
    url = url.replace(" ","");
    if(name === ""){
        $("#name-searchEngine-input").attr('placeholder',网站名称不能为空);
        return;
    }
    if(url === ""){
        $("#url-searchEngine-input").attr('placeholder',网站链接不能为空);
        return;
    }
    if(!searchEngine.has(name)) {
        document.getElementById("edit-search-engine-panel").innerHTML += createSearchEngine(name,url);
        $("#name-searchEngine-input").val("");
        $("#url-searchEngine-input").val("");
    }
    searchEngine.set(name,url);
    addAllEngines(name,url)
    setCookie("searchEngine",_mapToJson(searchEngine));
}

function deletesearchEngine(name) {
    var id = '#'+name+"-piece"
    $(id).remove();
    searchEngine.delete(name);
    setCookie("searchEngine",_mapToJson(searchEngine));
}

function createSearchEngine(name,url) {
    var nameVal = "$('#"+name+"\').val()";
    var urlVal = "$('#"+url+"\').val()";
    var websitePiece = 
    "<div class='website-piece' id='"+name+"-piece'>"+
        "<input type='text' id='"+name+"' readonly='readonly' class='edit-input-class' value='"+name+"'>"+
        "<input type='text' id='"+url+"' class='edit-input-class' value='"+url+"'>"+
        "<button class='button-class edit-b-c right' onclick=\"adjustsearchEngine("+nameVal+","+urlVal+")\"></button>"+
        "<button class='button-class edit-b-c delete' onclick=\"deletesearchEngine("+nameVal+")\"></button>"+
    "</div>";
    return websitePiece;
}

//------------------------------搜索引擎选择------------------------------//
function addAllEngines(name,url) {
    var baseUrl = getMainDomain(url);

    var engineBlock = 
    "<button style='background:url("+baseUrl+"/favicon.ico) no-repeat;background-size:cover;' class='edit-button' onclick='chooseEngine(\""+name+"\")' id='choose-engine-"+index+"'></button>";
    var enginePanel = document.getElementById("float-window");
    enginePanel.innerHTML += engineBlock;
}

function initEnginePanel() {
    var se = document.getElementById("search-engine");
    se.style = "background:url("+getMainDomain(searchEngine.get(index))+"/favicon.ico) no-repeat;background-size:cover;";

    for(let name of searchEngine.keys()) {
        if(searchEngine.get(name)!=""){
            addAllEngines(name,searchEngine.get(name));
            document.getElementById("edit-search-engine-panel").innerHTML += createSearchEngine(name,searchEngine.get(name));
        }
    }
}

function chooseEngine(index) {
    config.index = index;
    var se = document.getElementById("search-engine");
    se.style = "background:url("+getMainDomain(searchEngine.get(index))+"/favicon.ico) no-repeat;background-size:cover;";
    setCookie("config", convertJSON(this.config));
    closeWindow("#float-window");
}

function getMainDomain(url) {
    if(url.indexOf('http') == -1||url.indexOf('https') == -1){
        url = 'http://' + url;
    }
    var counter = 0;
    var baseUrl;
    for(let i = 0;i < url.length; i++) {
        if(url.charAt(i) == '/') {
            counter ++;
            if(counter == 3) {
                baseUrl = url.substring(0,i);
                return baseUrl;
            }
        }
    }
}