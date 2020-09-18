var backendurl = 'http://api.navigation.yihuang728.club/';//服务端API接口
// var backendurl = 'http://127.0.0.1:8080/';//服务端API接口
var user;

function login(username,passwordHash) {
    $.ajax({
        type:'GET',
        datatype:'json',
        url:backendurl+'visitor?username='+username+'&password='+passwordHash,
        success:function (result){
            if(result == undefined || result == '') {
                $("#login-tip").text("咦，我见过你吗？");
                return;
            }
            user = result;

            if($("#remember-user").prop("checked")) {
                setCookie("user",JSON.stringify({uuuuu:username,ppppp:passwordHash}));
            }
            
            loadUser(result);
        },
        error:function (error) {
            $("#login-tip").text("哎呀，服务器不见了！");
        },
        complete:function () {
            loadJSON('color.json');
        }
        
    })
}

function loadUser(result) {
    $("#userLogin").hide();
    $("#username-span").text(result.userName);
    $("#userLogged").show();
    for(let i=0;i<result.visitorWebsites.length;i++) {
        var u = result.visitorWebsites[i];
        var index = u.indexOf('.');
        var index1 = u.indexOf('.',index);
        var title = u.substring(index,index1);
        loadCustomWebsite(u,title);
    }
    
    for(let j=0;j<result.websiteGroups.length;j++) {
        //生成面板
        createWebsitePanelOnline(result.websiteGroups[j].groupName,result.websiteGroups[j].links,result.websiteGroups[j].websiteHash);
    }


    // loadJSON('color.json');
    $("#getwebsite-tip").text("登陆就会保存在云端了");
}

function loginUser(){
    var username = $("#username").val();
    var password = $("#password").val();
    if(username == ''||password == '') {
        $("#login-tip").text("喂，告诉我你叫什么啊！");
        return;
    }

    login(username,hex_md5(password));
}


function logoutUser(){
    for (const websiteGroup in user.websiteGroups) {
        $("#"+user.websiteGroups[websiteGroup].groupName+"-online-websitesgroup").remove();
        $("#"+user.websiteGroups[websiteGroup].groupName+"-online").remove();
    }

    $("#userLogin").show();
    $("#username").val("");
    $("#password").val("");
    $("#userLogged").hide();
    $("#username-span").text('');
    setCookie("user","");
    user = undefined;
}

function registerUser(){
    var username = $("#username").val();
    var password = $("#password").val();
    if(username == ''||password == '') {
        return;
    }

    user = {
        userName: username,
        password_Hash: hex_md5(password),
        visitorWebsites:[],
        websiteGroups:[]
    }

    //使用Ajax添加用户
    $.ajax({
        type:"POST",
        datatype:'json',
        data:JSON.stringify(user),
        contentType: 'application/json',
        traditional:true,
        url:backendurl+"addvisitor",
        success:function (result) {
            if(!result) {
                $("#username").val("");
                $("#password").val("");
                $("#login-tip").text("哎呀，服务器不见了！");
            } else {
                $("#userLogin").hide();
                $("#username-span").text(username);
                $("#userLogged").show();
                if($("#remember-user").prop("checked")) {
                    setCookie("user",JSON.stringify({uuuuu:username,ppppp:passwordHash}));
                }
            }
        }
    });
}

function isUpdateGroup(title) {
    if(user == undefined) {
        alert("先登陆啊啊啊！");
        $("#"+title+"-update").attr("checked",false);
        return ;
    }

    //从本地同步到云端
    if($("#"+title+"-update").prop("checked") ) {
        var websitelinks = new Object();
        var website = $("#"+title+"-textarea").val().trim();
        var websites=website.split(';');

        for(let i in websites) {
            if(websites[i] != ""){
                if(i === "0") {
                    websitelinks[websites[i].trim().slice(0,websites[i].indexOf('|'))] = websites[i].trim().slice(websites[i].indexOf('|')+1,websites[i].length);
                } else {
                    websitelinks[websites[i].trim().slice(0,websites[i].indexOf('|')-1)] = websites[i].trim().slice(websites[i].indexOf('|'),websites[i].length);
                }
            }
        }
        
        for (const key in user.websiteGroups) {
            if(user.websiteGroups[key].groupName == title) {
                $("#"+title+"-update").attr("checked",false);
                alert("已经有一个叫个这名字的了~");
                return;
            }
        }
        var websiteGroup = {
            websiteHash:'none', //服务端生成websiteHash
            groupName:title,
            links:websitelinks
        }

        user.websiteGroups.push(websiteGroup);
        $.ajax({
            type:"POST",
            dataType:'json',
            data:JSON.stringify(user),
            contentType: 'application/json',
            traditional:true,
            url:backendurl+'updateVisitor',
            success: function (result){
                if(result != '') {
                    custom_website.delete(title);
                    setCookie("custom_website",_mapToJson(custom_website));
                    user = result;   
                    $("#"+title+"").attr("id",title+"-online");
                    $("#"+title+"-websitesgroup").attr("id",title+"-online-websitegroup");
                    $("#"+title+"-websiteHash").text('标识码：'+user.websiteGroups[user.websiteGroups.length-1].websiteHash);
                    $("#"+title+"-websiteHash").attr("id",title+"-online-websiteHash");
                    $("#"+title+"-name").attr("id",title+"-online-name");
                    $("#"+title+"-submitbutton").attr("onclick","getWebsitesGroup(\'"+title+"-online\')");
                    $("#"+title+"-submitbutton").attr("id",title+"-online-submitbutton");
                    $("#"+title+"-deletebutton").attr("onclick","deleteWebsitesGroup(\'"+title+"-online\')");
                    $("#"+title+"-deletebutton").attr("id",title+"-online-deletebutton");
                    $("#"+title+"-textarea").attr("id",title+"-online-textarea");
                    $("#"+title+"-update").attr("onclick","isUpdateGroup(\'"+title+"-online\')");
                    $("#"+title+"-update").attr("id",title+"-online-update");
                    $("#"+title+"-update-tip").attr("id",title+"-online-update-tip");
                    
                } else {
                    alert("咦，我服务器呢？");
                    $("#"+title+"-update").attr("checked",false);
                }
            },
            error: function (error) {
                console.error(error);
                user.websiteGroups.pop();
                alert("咦，我服务器呢？");
                $("#"+title+"-update").attr("checked",false);
            }
        });

    } else {
        //从云端保存到本地
        for(var t in user.websiteGroups) {
            // console.log("======================================");
            // console.log(user.websiteGroups[t]);
            // console.log(title);
            // console.log(user.websiteGroups[t].groupName === title.replace("-online",''));
            // console.log($("#"+title+"-websiteHash").text());
            // console.log(user.websiteGroups[t].websiteHash == $("#"+title+"-websiteHash").text().replace("标识码：",''));
            if(user.websiteGroups[t].groupName === title.replace("-online",'')
            && user.websiteGroups[t].websiteHash === $("#"+title+"-websiteHash").text().replace("标识码：",'')) {
                var tmp = {
                    names:[],
                    urls:[]
                }
                for(var i in user.websiteGroups[t].links) {
                    if(user.websiteGroups[t].links[i] != '') {
                        tmp.names.push(i);
                        tmp.urls.push(user.websiteGroups[t].links[i]);
                    }
                }

                var backup = JSON.stringify(user.websiteGroups);
                user.websiteGroups.splice(t,1);
                $.ajax({
                    type:"POST",
                    dataType:'json',
                    data:JSON.stringify(user),
                    contentType: 'application/json',
                    traditional:true,
                    url:backendurl+'updateVisitor',
                    success: function (result){
                        if(result != '') {
                            title = title.replace("-online",'');
                            custom_website.set(title,tmp);
                            setCookie("custom_website",_mapToJson(custom_website));
                            $("#"+title+"-online").attr("id",title+"");
                            $("#"+title+"-online-websitesgroup").attr("id",title+"-websitesgroup");
                            $("#"+title+"-online-websiteHash").text('');
                            $("#"+title+"-online-websiteHash").attr("id",title+"-websiteHash");
                            $("#"+title+"-online-name").attr("id",title+"-name");
                            $("#"+title+"-online-submitbutton").attr("onclick","getWebsitesGroup(\'"+title+"\')");
                            $("#"+title+"-online-submitbutton").attr("id",title+"-submitbutton");
                            $("#"+title+"-online-deletebutton").attr("onclick","deleteWebsitesGroup(\'"+title+"\')");
                            $("#"+title+"-online-deletebutton").attr("id",title+"-deletebutton");
                            $("#"+title+"-online-textarea").attr("id",title+"-textarea");
                            $("#"+title+"-online-update").attr("onclick","isUpdateGroup(\'"+title+"\')");
                            $("#"+title+"-online-update").attr("id",title+"-update");
                            $("#"+title+"-online-update-tip").attr("id",title+"-update-tip");
                        } else {
                            alert("咦，我服务器呢？");
                            $("#"+title+"-update").attr("checked",true);
                        }
                    },
                    error: function (error) {
                        console.error(error);
                        user.websiteGroups = JSON.parse(backup);
                        $("#"+title+"-online-update").attr("checked",true);
                        alert("咦，我服务器呢？");
                    }
                });
                // console.clear();
                break;
            }
        }

        
    }
}

//获取热榜
function getHot() {
    var hotUrl = "https://www.tophub.fun:8888/v2/GetAllInfoGzip?id=1&page=0";

    $.ajax({
        type:"GET",
        dataType:'json',
        traditional:true,
        url:hotUrl,
        success: function (result){
            for(let t=1; t<=15; t++) {
                var item = "<div class='hot-item'>"+
                                "<a class='hot-title' target='_blank' href='"+result.Data.data[t].Url+"'>"+t+'.'+result.Data.data[t].Title+"</a>"+
                            "</div>";
                $("#hot").append(item);
            }
        }
    });
}

function test(){
    alert("好！很有精神！");
}

