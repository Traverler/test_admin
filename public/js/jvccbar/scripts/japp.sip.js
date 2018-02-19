//  *****************************************************************************
//  FileName	:  japp.sip.js
//  Author      :  wsj
//  Version     :  1.0.0.0
//  Create Time :  2015-09-09
//  Description :
// 		   1) js app for sip;
// *****************************************************************************


//*************************************************************************************************
// Global Var
//*************************************************************************************************
var  application   = null;

var Audio_Codec_ULaw = 0;
var Audio_Codec_GSM = 3;
var Audio_Codec_ALaw = 8;
var Audio_Codec_729A = 18;
var Audio_Codec_ILbc = 97;
var Audio_Codec_Speex = 98;
var Audio_Codec_Opus = 114;

//*************************************************************************************************
// Global Function
//*************************************************************************************************

function applicationSipLoad(callback){
    if(application != null)
    {
        return ;
    }
    if(typeof(callback) == "undefined"){
        callback = null;
    }
	application = new  JSipApplication();
	application.onLoad = callback;
	
	if(callback != null){
		setTimeout(createBar,1000); 
	}
}
function JSipApplication()
{
    this.oJSipCtrl = new JSipCtrl("application.oJSipCtrl");

	return this;
}

function createBar(){
	if(application.onLoad)
	{
    	application.onLoad();
 	}	
}

//*************************************************************************************************
// JSipCtrl Object
//*************************************************************************************************
function JSipCtrl(sName)
{
	//########################//
	//			Attribute		  //
	//########################//	
	//公共属性
	this.left			= 0;
	this.top			= 0;
	this.width			= 0;
	this.height			= 0;
	this.oBarCtrl		= null;
	this.appName = sName;
	this._contentWindow = window;
	this.id = "oSip_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";


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
			//	loadHeadMeta();
			}
			else
			{
				this.os = ua;
				this.version = "";
			}
		}

		return this;
	}
	this.ismsie = false;

	// 主图相关的HTML对象
	this.oBarShow		= null;
	this.oATL_BarShow   = null;

	//private fucntion
	this._createObject = function _createObject()
	{
		this.oBrowserSys = this._GetBrowerSys();
		this.ismsie = (this.oBrowserSys.os == "msie");

		//this.oBarShow = this._contentWindow.document.createElement("<DIV style='cursor:move;position:absolute;border:1px solid #000000; left:"+this.left+"px;top:"+this.top+"px;'>");
		this.oBarShow = this._contentWindow.document.createElement("DIV");
		this.oBarShow.style.cursor = "move";
		this.oBarShow.style.position = "absolute";
		this.oBarShow.style.padding = "5px";
		this.oBarShow.style.left = this.left+"px";
		this.oBarShow.style.top = this.top+"px";

		this._contentWindow.document.body.appendChild(this.oBarShow);

		try
		{
			// 创建电话条控件
			if(this.ismsie == true)
			{
				this.oBarShow.innerHTML = "<OBJECT height=\""+this.height+"\" width=\""+this.width+"\" classid=\"clsid:46F65DD9-A62C-40E0-B4D8-DBE1933F9AA1\" ></OBJECT>";
				this.oATL_BarShow = this.oBarShow.firstChild;
				this.oATL_BarShow.id = "oATL_BarShow_Ctrl_" + this.id;
				this._attachOCXEvents();
			}
			else
			{
				var eventText = this._attachFOCXEvents();
				this.oBarShow.innerHTML = "<OBJECT TYPE=\"application/x-itst-activex\" height=\""+this.height+"\" width=\""+this.width+"\" clsid=\"{46F65DD9-A62C-40E0-B4D8-DBE1933F9AA1}\" progid=\"AgentCtrl.AgentCtrlCtrl\" "+eventText+" </OBJECT>";;
				this.oATL_BarShow = this.oBarShow.firstChild;
				this.oATL_BarShow.id = "oATL_BarShow_Ctrl_" + this.id;
			}
		}
		catch(e)
		{
			alert("创建OCX SIP出错:【"+e.message+"】");
		}
		this.SetAttribute("AgentID","");
		this.SetAttribute("PhoneType",1);//sip:1  0 MacCard
		this.SetAttribute("AuthType",1);
		this.SetAttribute("SipProtocol","UDP");
	}
	this._attachFOCXEvents = function (){
		//呼叫事件 3
		var jsEvents = "event_OnRing=\"altSipEventOnRing\" ";
		jsEvents = jsEvents + "event_OnOrigated=\"altSipEventOnOrigated\" ";
		jsEvents = jsEvents + "event_OnDisconnected=\"altSipEventOnDisconnected\" ";
		jsEvents = jsEvents + "event_OnConnected=\"altSipEventOnConnected\" ";
		jsEvents = jsEvents + "event_OnError=\"altSipEventOnError\" ";

		jsEvents = jsEvents + "event_OnLoginSuccess=\"altSipEventOnLoginSuccess\" ";
		jsEvents = jsEvents + "event_OnLoginFailure=\"altSipEventOnLoginFailure\" ";
		jsEvents = jsEvents + "event_OnLogoutSuccess=\"altSipEventOnLogoutSuccess\" ";

		return jsEvents
	}
	this._attachOCXEvents = function (){
		//呼叫事件 3
		this.oATL_BarShow.attachEvent("OnRing",altSipEventOnRing);
		this.oATL_BarShow.attachEvent("OnOrigated",altSipEventOnOrigated);
		this.oATL_BarShow.attachEvent("OnDisconnected",altSipEventOnDisconnected);
		this.oATL_BarShow.attachEvent("OnConnected",altSipEventOnConnected);
		this.oATL_BarShow.attachEvent("OnError",altSipEventOnError);

		this.oATL_BarShow.attachEvent("OnLoginSuccess",altSipEventOnLoginSuccess);
		this.oATL_BarShow.attachEvent("OnLoginFailure",altSipEventOnLoginFailure);
		this.oATL_BarShow.attachEvent("OnLogoutSuccess",altSipEventOnLogoutSuccess);

	}
	this.showErr = function(Message){
		alert(Message);
	}


	//--------------------------------------------------------------------------------------------------
	// public function for user
	//--------------------------------------------------------------------------------------------------
    //public Attribute
    this.SetAttribute = function(aName,aValue){
		if(this.oATL_BarShow != null)
		{
			if(aName == "PhoneType"){
				this.oATL_BarShow.PhoneType = aValue;}
			else if(aName == "Dn"){
				this.oATL_BarShow.Dn = aValue;}
			else if(aName == "SipServerIP"){
				this.oATL_BarShow.SipServerIP = aValue;}
			else if(aName == "SipServerPort"){
				this.oATL_BarShow.SipServerPort = aValue;}
			else if(aName == "SipProtocol"){
				this.oATL_BarShow.SipProtocol = aValue;}
			else if(aName == "AuthType"){
				this.oATL_BarShow.AuthType = aValue;}
			else if(aName == "Domain"){
				this.oATL_BarShow.Domain = aValue;}
			else if(aName == "PassWord"){//MediaFlag
				this.oATL_BarShow.PassWord = aValue;}
			else if(aName == "DefaultCodec"){//MediaFlag
				this.oATL_BarShow.DefaultCodec = aValue;}
			//no  use
			else if(aName == "sendHandle"){
				this.oATL_BarShow.sendHandle = aValue;}
			else if(aName == "recvHandle"){
				this.oATL_BarShow.recvHandle = aValue;}
			else if(aName == "bandWidth"){
				this.oATL_BarShow.bandWidth = aValue;}
			else if(aName == "frameRate"){
				this.oATL_BarShow.frameRate = aValue;}
			else if(aName == "defaultIP"){
				this.oATL_BarShow.defaultIP = aValue;}
			else if(aName == "minMediaPort"){
				this.oATL_BarShow.minMediaPort = aValue;}
			else if(aName == "maxMediaPort"){
				this.oATL_BarShow.maxMediaPort = aValue;}
			else if(aName == "RtpSource"){
				this.oATL_BarShow.RtpSource = aValue;}
			else if(aName == "heartBeatInterval"){
				this.oATL_BarShow.heartBeatInterval = aValue;}
			else if(aName == "heartBeatType"){
				this.oATL_BarShow.heartBeatType = aValue;}
			else if(aName == "AgentID"){
				this.oATL_BarShow.AgentID = aValue;}
			else if(aName == "AgentType"){
				this.oATL_BarShow.AgentType = aValue;}
			else if(aName == "PhoneAssistIP"){
				this.oATL_BarShow.PhoneAssistIP = aValue;}
			else if(aName == "PhoneAssistPort"){
				this.oATL_BarShow.PhoneAssistPort = aValue;}
		}
    }
    this.GetAttribute = function(aName){

		if(aName == "PhoneType"){
			return this.oATL_BarShow.PhoneType  ;}
		else if(aName == "Dn"){
			return this.oATL_BarShow.Dn  ;}
		else if(aName == "SipServerIP"){
			return this.oATL_BarShow.SipServerIP  ;}
		else if(aName == "SipServerPort"){
			return this.oATL_BarShow.SipServerPort  ;}
		else if(aName == "SipProtocol"){
			return this.oATL_BarShow.SipProtocol  ;}
		else if(aName == "AuthType"){
			return this.oATL_BarShow.AuthType  ;}
		else if(aName == "Domain"){
			return this.oATL_BarShow.Domain  ;}
		else if(aName == "PassWord"){//MediaFlag
			return this.oATL_BarShow.PassWord  ;}
		else if(aName == "DefaultCodec"){//MediaFlag
			return this.oATL_BarShow.DefaultCodec  ;}
		//no use

		return "";
    }
	
	//--------------------------------------------------------------------------------------------------
	// 外部方法,Sip对外接口
	//--------------------------------------------------------------------------------------------------
	//1)	Initial（初始化）
	this.Initial = function Initial()	{  return this.oATL_BarShow.Initial();}
	//2)	RegisterPA（注册）
	this.RegisterPA = function RegisterPA() { return this.oATL_BarShow.RegisterPA(); }
	//3)	ReleasePA（注销）
	this.ReleasePA = function ReleasePA() { return this.oATL_BarShow.ReleasePA(); }

	//4)	Pickup（接通）
	this.Pickup = function Pickup() { return this.oATL_BarShow.Pickup(); }
	//5)	Reject（取消呼叫）
	this.Reject = function Reject() { return this.oATL_BarShow.Reject(); }
	//6)	Disconnect（挂断）
	this.Disconnect = function Disconnect() { return this.oATL_BarShow.Disconnect(); }
	//7)	SendDTMF（二次拨号）
	this.SendDTMF = function SendDTMF(tapKey) { return this.oATL_BarShow.SendDTMF(tapKey); }
	//8)	外呼（初始化）
	this.DoCall = function DoCall(destNum,transParentParam)
	{
		if(destNum == "")
			return -1;
		destNum = destNum+"@"+this.GetAttribute("SipServerIP")+":"+this.GetAttribute("SipServerPort");
		transParentParam = getDefaultParam(transParentParam);
		if(transParentParam !="")
			destNum = destNum + "$"+transParentParam;

		return this.oATL_BarShow.DoCall(destNum);
	}

	//--------------------------------------------------------------------------------------------------
	// 事件重载,电话条对外事件
	//--------------------------------------------------------------------------------------------------

	//2.4.1	呼叫事件 3
	this.OnRing = function(url){}
	this.OnOrigated = function(){}
	this.OnDisconnected = function(){}
	this.OnConnected = function(sType){}
	this.OnError = function(errorCode){}

	this.OnLoginSuccess = function(){}
	this.OnLoginFailure = function(){}
	this.OnLogoutSuccess = function(){}


	//--------------------------------------------------------------------------------------------------
	// 辅助函数,JS函数
	//--------------------------------------------------------------------------------------------------

	this._InvokeMethod = function  _InvokeMethod(cmdName,param){
		 if( cmdName == "")
			return -1;
		if(this.oBarCtrl != null) 
			return this.oBarCtrl.InvokeMethod(cmdName,param);
		return -1;
	}
	this._InvokeQueryMethod = function  _InvokeQueryMethod(cmdName,param){
		 if( cmdName == "")
			return "";
		if(this.oBarCtrl != null)
			return this.oBarCtrl.InvokeResultMethod(cmdName,param);
		return "";
	}

	this._createObject();
	return this;
}

//*************************************************************************************************
// 事件函数函数
//*************************************************************************************************
function altSipEventOnRing(url){ application.oJSipCtrl.OnRing(url);}
function altSipEventOnOrigated(){ application.oJSipCtrl.OnOrigated();}
function altSipEventOnDisconnected(){ application.oJSipCtrl.OnDisconnected();}
function altSipEventOnConnected(sType){ application.oJSipCtrl.OnConnected(sType);}
function altSipEventOnError(errorCode){ application.oJSipCtrl.OnError(errorCode);}

function altSipEventOnLoginSuccess(){ application.oJSipCtrl.OnLoginSuccess();}
function altSipEventOnLoginFailure(){ application.oJSipCtrl.OnLoginFailure();}
function altSipEventOnLogoutSuccess(){ application.oJSipCtrl.OnLogoutSuccess();}


//*************************************************************************************************
// 辅助函数
//*************************************************************************************************
function GetApspParam()
{	
     var  n = arguments.length;
     var  strReturn ="";
     for (var i = 0; i < arguments.length; i++) {
	    if(i==0)
		    strReturn = getDefaultParam(arguments[i]);
	    else
		    strReturn = strReturn+"|"+ getDefaultParam(arguments[i]);
     }		
    return strReturn;
 }
 function getDefaultParam(p1){
    if(typeof(p1) == "undefined")
        return "";
    return p1;
}
//--------------------------------------------------------------------------------------------------
// Base64编码
//--------------------------------------------------------------------------------------------------

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
    }
    c2 = str.charCodeAt(i++);
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) 
{//GbkToUtf8
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
    } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    }
    }
    return out;
}

function utf8to16(str) 
{//Utf8ToGbk
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
    c = str.charCodeAt(i++);
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i-1);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}

function GetBase64FromGBK(data)
{//GBKToUtf8=>EnBase64
    if (typeof(data) == "undefined")
        return "";
    return base64encode(utf16to8(data));
}

function GetGBKFromBase64(data)
{//DeBase64=>Utf8ToGBK
    if (typeof(data) == "undefined")
        return "";
    return utf8to16(base64decode(data));
}
