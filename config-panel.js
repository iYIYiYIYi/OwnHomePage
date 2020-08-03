var config = {
    title:"- 自 产 自 销 -",
    tab:"- 自 产 自 销 -",
    index:0,

    global(){
        return this;
    }
};
var searchEngine = new Map();

function initPanels() {
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
    for(let name of searchEngine.keys()) {
        urls.push(searchEngine.get(name));
        document.getElementById("edit-search-engine-panel").innerHTML += createSearchEngine(name,searchEngine.get(name));
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
    setCookie("searchEngine",_mapToJson(searchEngine));
}

function deletesearchEngine(name) {
    console.log("deleting");
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
function addAllEngines(index,url) {
    var engineBlock = 
    "<button style='background:url("+url+"/favicon.ico) no-repeat;background-size:cover;' class='edit-button' onclick='chooseEngine("+index+")' id='choose-engine-"+index+"'></button>";
    var enginePanel = document.getElementById("float-window");
    enginePanel.innerHTML += engineBlock;
}

function initEnginePanel() {
    var se = document.getElementById("search-engine");
    se.style = "background:url("+urls[index].slice(0,urls[config.index].indexOf("com")+3)+"/favicon.ico) no-repeat;background-size:cover;";

    for(let i in urls) {
        if(urls[i]!=""){
            addAllEngines(i,urls[i].slice(0,urls[i].indexOf("com")+3));
        }
    }
}

function chooseEngine(index) {
    config.index = index;
    console.log(index);
    var se = document.getElementById("search-engine");
    se.style = "background:url("+urls[index].slice(0,urls[index].indexOf("com")+3)+"/favicon.ico) no-repeat;background-size:cover;";
    setCookie("config", convertJSON(this.config));
    closeWindow("#float-window");
}