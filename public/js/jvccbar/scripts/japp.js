//  *****************************************************************************
//  文 件 名：	japp.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   JVccBar的全局处理函数
//  说    明：
//		   JVccBar的全局处理函数
//  修改说明：
// *****************************************************************************

var  application   = null;

//电话条显示类型
var  showStyleNONE  = 0;
var  showStyleOCX   = 1;
var  showStyleJS    = 2;
var  showStyleAUTTO = 3;
var  showStyleSL    = 4;

//实际电话条类型使用类型
var  vccBarTypeOCX                = 0;
var  vccBarTypeHTML5              = 1;
var  vccBarTypeSILVERLIGHT        = 2;
var  vccBarTypePUREJS             = 3;
/////////////////////////////////
//     全局对外函数
/////////////////////////////////

function applicationLoad(left,top,width,height,showstyle,relationPath,callback){
    if(application != null)
    {
        return ;
    }
    if(typeof(relationPath) == "undefined"){
        relationPath = "";
    }
	if( showstyle == showStyleJS || (showstyle == showStyleAUTTO && IsWebSocketValid()) )
	{
		//loadJsFile(relationPath+"jquery-easyui-1.4/jquery.min.js");
		loadJsFile(relationPath+"jquery-easyui-1.4/jquery.easyui.min.js");
		loadCssFile(relationPath+"jquery-easyui-1.4/themes/default/easyui.css");
		loadCssFile(relationPath+"jquery-easyui-1.4/themes/icon.css");
	}

    loadJsFile(relationPath+"scripts/core/jbardef.js");
    loadJsFile(relationPath+"scripts/core/japsp.js");
    loadJsFile(relationPath+"scripts/core/jpublic.js");
    loadJsFile(relationPath+"scripts/core/jmonitor.js");
    loadJsFile(relationPath+"scripts/core/jslctrl.js");
	loadJsFile(relationPath+"scripts/core/jhtml5ctrl.js");
    loadJsFile(relationPath+"scripts/core/jvccbar.js");
    loadJsFile(relationPath+"scripts/core/jocxctrl.js");
    loadJsFile(relationPath+"scripts/core/jbarassist.js");

    var bJsUi = false;
    var sleepTime = 1000;
    if(showstyle == showStyleJS){
        bJsUi = true;
    }
    else if(showstyle == showStyleAUTTO){
        if(IsWebSocketValid() == true){
            bJsUi = true;
        }
    }
	if(bJsUi == true)
	{
		sleepTime = 3000;
		loadJsFile(relationPath+"scripts/jbardisplay.js");
		loadJsFile(relationPath+"scripts/jwechat.js");
	}

    application = new JApplication(left,top,width,height,showstyle,relationPath);
    application.onLoad = callback;

    setTimeout(createBar,sleepTime); 
}

function applicationUnLoad()
{
	if(application != null)
	{
		if(application.oJVccBar != null)
		{
			application.oJVccBar.UnInitial();
		}
		if(application.oJMonitor != null)
		{
			delete application.oJMonitor;
			application.oJMonitor = null;
		}
		if(application.oJBarDisplayer != null)
		{
			delete application.oJBarDisplayer;
			application.oJBarDisplayer = null;
		}
		delete application;
		application = null;
	}
}

function createBar()
{
    //1、创建电话条对象
	application.oJVccBar  = new JVccBar(application.left,application.top,application.width,application.height,application.showstyle,null);
	
	//2、创建内联的电话条界面，并和电话条对象建立关系
    application.CreateBarDisplay();
    application.oJVccBar.SetInlineShowBar(application.oJBarDisplayer);
    
    //3、电话条辅助功能
    application.InitAssist();
    
	if(application.onLoad)
	{
    	application.onLoad();
    	loadDebug();
	}
}



function JApplication(left,top,width,height,showstyle,relationPath)
{
    this.oJVccBar       = null;     //电话条对象
    this.oJMonitor      = null;     //监控对象
    this.oJBarDisplayer = null;     //显示对象
    this.oWecharCtrl    = null;     //微信展示界面

    this.oWechatManager = null;     //微信数据管理
    this.oVccBarAssist = null;      //辅助管理模块
    this.onLoad         = null;     //电话创建完毕回调函数
    this.oBrowserSys    = null;     //浏览器对象
   	this.oLogDisplay  	= null;	    //日志显示界面
	this.RelationPath   = relationPath;

    //电话条位置
	this.left			= left;
	this.top			= top;
	this.width			= width;
	this.height			= height;
	
	this.showstyle           = showstyle;
    this.surpportWebsocket = false;
   	this._contentWindow = window;

	/////////////////////////////////
	// 公用函数
	/////////////////////////////////
	//1、创建内置电话界面
	this.CreateBarDisplay =function()	{
		if( this.showstyle == showStyleJS || this.showstyle == showStyleAUTTO ){
            if( this.IsSurpportWebSocket() ) {
                this.oJBarDisplayer = new JBarDisplay(this.left,this.top,this.width,this.height,this._contentWindow);
            }
	    }	
	}
	//2、创建内置电话界面
	this.InitAssist = function()	{
        // 1）、微信数据管理
	    this.oWechatManager = new JWechChatManager();         
        // 2）、界面控制
        this.oVccBarAssist = new JVccBarAssist();
	    	
	}
	//3、电话条对象和监控对象相互绑定
	this.BindMonitorBarToEachOther = function(oMonitor)	{
	    try
	    {
	        oMonitor = (typeof(oMonitor) == "undefined")?this.oJMonitor:oMonitor;
	        if( oMonitor == null)
	        {
	            alert("监控控件没有初始化!");
	            return;
	        }
	        oMonitor.SetVccBarCtrl(this.oJVccBar);
	        this.oJVccBar.SetMonitorCtrl(oMonitor);
	    }
	    catch(e){
	        alert(e.message);
	    }
	}
	//4、得到主目录路径
	this.GetRelationPath = function(){
		return this.RelationPath;
	}
	//是否支持websocket
	this.IsSurpportWebSocket = function(){
	    return this.surpportWebsocket ;
	}
	//显示日志内容
	this.Log = function (str1){
	    if(this.oLogDisplay == null){
	        this.oLogDisplay = this._contentWindow.document.createElement("DIV");
	        this.oLogDisplay.style.cursor = "move";
	        this.oLogDisplay.style.position = "relative";
	        this.oLogDisplay.style.border = "0px solid #0000ff";
	        this.oLogDisplay.style.left = (this.left+350)+"px";
	        this.oLogDisplay.style.top = (this.top+150)+"px";
	        this.oLogDisplay.style.width = "600px";
	        this.oLogDisplay.style.height = "300px";
	        this.oLogDisplay.style.display = "none";
	        this.oLogDisplay.style.zIndex = "1000";
		    this._contentWindow.document.body.appendChild(this.oLogDisplay);
		    this.oLogDisplay.innerHTML ="<TEXTAREA id=\"idLog\"  rows=\"33\" cols=\"100\" value=\"日志\" style=\"overflow:auto;font-family:verdana;font-size:12px\"></TEXTAREA>";
	    }
	    if(str1 == ""){return;}
	    var oLog = this._contentWindow.document.getElementById("idLog");
        oLog.value=oLog.value+str1+"\r\n";

	}
	//控制日志是否显示
	this.DislayLog = function(showFlag){
	    if(this.oLogDisplay == null){
	        this.Log("");
	    }
		if(showFlag == 1){
			this.oLogDisplay.style.display = "block";
		}else{
			this.oLogDisplay.style.display = "none";
		}				
	}

	/////////////////////////////////
	// 事件
	/////////////////////////////////


	/////////////////////////////////
	// 辅助函数
	/////////////////////////////////

	this._Create = function()	{
	    this.surpportWebsocket = IsWebSocketValid();
    	this.oBrowserSys = this._GetBrowerSys();  
	}
    this._GetBrowerSys =function  _GetBrowerSys()	{
		this.os = "";
		this.version = "";
        var ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf("msie")>0) 
		{
			this.os = "msie";
            this.version = ua.match(/msie ([\d.]+)/)[1];
		}
        else if (ua.lastIndexOf("firefox")>0)
		{
		    this.os = "firefox";
            this.version = ua.match(/firefox\/([\d.]+)/)[1];
		}
        else if (ua.lastIndexOf("chrome")>0)
		{
			this.os = "chrome";
            this.version = ua.match(/chrome\/([\d.]+)/)[1];
		}
		else
		{
		    if(isIE())
		    {
		        this.os = "msie";
			    this.version = "11.0";
			    loadHeadMeta();
		    }
		    else
		    {
			    this.os = ua;
			    this.version = "";
			}
		}
		if(getLocalLanguage() == "zh-cn")
		    this.expression = "ua:【"+ua+"】\r\nos:【"+this.os+"】 version:【"+this.version+"】\r\nwebsocket:【"+((this.surpportWebsocket == true)?"支持":"不支持")+"】";
		else
		    this.expression = "ua:["+ua+"]\r\nos:["+this.os+"] version:["+this.version+"]\r\nwebsocket:["+((this.surpportWebsocket == true)?"surpport":"unsurpport")+"]";
		
		return this;
	}
	
	
	this._Create();
}


//--------------------------------------------------------------------------------------------------
// 全局函数
//--------------------------------------------------------------------------------------------------

function loadHeadMeta()
{
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("meta");
    oScript.setAttribute("http-equiv","X-UA-Compatible");
    oScript.setAttribute("content","IE=10");
    oHead.appendChild( oScript); 		
}


function loadJsFile(strFileName)
{
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = strFileName;
    oHead.appendChild( oScript); 		
}
function loadCssFile(strFileName)
{
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("link");
    oScript.setAttribute("rel","stylesheet");
    oScript.setAttribute("type","text/css");
    oScript.setAttribute("href",strFileName);
    oHead.appendChild( oScript); 		
}
function IsWebsocketExist(){
    if(!window.WebSocket && window.MozWebSocket)
        window.WebSocket=window.MozWebSocket;
    if(!window.WebSocket)
        return false;
    return true;
}
function IsWebSocketValid()
{
    return IsWebsocketExist();
    try{
	   var dummy = new WebSocket("ws://localhost:8989/test");
    } 
	catch (ex) 
	{
		try
		{
			webSocket = new MozWebSocket("ws://localhost:8989/test");
		}
		catch(ex)
		{
		    return false;
		}
	}
	
	return true;
}
function isIE() 
{ 
    try
    {
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    }
    catch(e)
    {
        return false;
    }
}
function getLocalLanguage()
{
    var type = navigator.appName;
    var lang = "";
    if(type == "Netscape")
    {
        lang = navigator.language;
    }
    else{
        lang = navigator.userLanguage;
    }
    //zh-CN   zh-tw
    return lang.toLowerCase();
}

var gDebug = null;
function loadDebug()
{
    document.onkeydown = hotkey;
    if(gDebug == null)
    {
	    gDebug = window.document.createElement("DIV");
	    gDebug.style.cursor = "move";
	    gDebug.style.position = "relative";
	    gDebug.style.border = "1px solid #0000ff";
	    gDebug.style.left = "50px";
	    gDebug.style.top = (document.body.clientHeight-100)+"px";
	    gDebug.style.width = "600px";
	    gDebug.style.height = "426px";
	    gDebug.style.display = "none";
	    window.document.body.appendChild(gDebug);
	    var innerHtml = "<INPUT type=\"text\" id=\"debugCmd\" NAME=\"debugCmd\"  size=\"40\"  title=\"命令方法\" onkeypress='onDebugger();'>";
	    innerHtml = innerHtml +  "<TEXTAREA id=\"debugInfo\"  rows=\"33\" cols=\"100\" value=\"日志\" style=\"overflow:auto;font-family:verdana;font-size:12px\"></TEXTAREA>";
	    gDebug.innerHTML = innerHtml;
	}
    
}
function hotkey(e)
{

    try
    {
        var keynum = null;
        if (window.event) {// IE
	        keynum = e.keyCode;
	    }
	    else if(e.which){// Netscape/Firefox/Opera
		    keynum = e.which;
	    }
	    if(keynum == null)
	        return ;
        e = e || window.event;
        if(e.altKey && e.keyCode == 68)//keycode   68 = d D
        {//keycode   72 = h H
            if(gDebug != null)
		        gDebug.style.display = "block";
        } 
        if(e.altKey && e.keyCode == 72)//keycode   72 = h H
        {//
            if(gDebug != null)
		        gDebug.style.display = "none";
        }
     }
     catch(ex) {
     }
}
function onDebugger()
{
    if (event.keyCode != 13) 
        return ;
    var oCmd = window.document.getElementById("debugCmd");
    if(oCmd == null)
        return ;
    var strCmd = oCmd.value;
    alert(strCmd);
}