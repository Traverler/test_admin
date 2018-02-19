//  *****************************************************************************
//  文 件 名：	jpublic.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		 公共函数
//  说    明：
//		 公共函数
//  修改说明：
// *****************************************************************************


//--------------------------------------------------------------------------------------------------
// 公共函数
//--------------------------------------------------------------------------------------------------

///////////////////////////////////////////////////////////////////////////// 
// Debug Type
var VccBar_Log_None           = 0;
var VccBar_Log_Error          = VccBar_Log_None+1;
var VccBar_Log_Warn           = VccBar_Log_None+2;
var VccBar_Log_Debug          = VccBar_Log_None+3;
var VccBar_Log_Info           = VccBar_Log_None+4;
var VccBar_Log_Protocol       = VccBar_Log_None+5;

var MAXCALLNUMLEN  =  64;
var g_DebugFlag = 1;//0:表示强制kill Maccard 1:表示不强制kill Maccard


//VccBar_Log_None VccBar_Log_Info VccBar_Log_Debug VccBar_Log_Warn VccBar_Log_Error
var gLogType = VccBar_Log_Warn; 
//写日志
function LeafOutMuchMessage(nType,strMsg)
{
    if(nType>=VccBar_Log_Protocol)
        return true;
    if(    strMsg.indexOf("OnStaticInfoReport")>=0
        || strMsg.indexOf("OnQueueReport")>=0 
        )
        return false;
    return true;
}
function DisplayLog(nType,strMsg)
{
    if(!LeafOutMuchMessage(nType,strMsg))
        return ;
    if(nType<=gLogType)
    {
        strMsg = "【"+getTimeString()+"】 " + strMsg;
        application.Log(strMsg);
        if( console == null || typeof(console) == 'undefined' )
            return;
        console.log(strMsg);
    }    
}

//得到子字符串
function getSubString(source,bgn,end)
{
    if(bgn == "" && end=="" )
	    return source;
    var  dest = "";
    var  temp = source;
    if(bgn == ""){
	    dest = temp;
    }else{
	    var  nBgn = temp.indexOf(bgn);
	    if(nBgn<0)
		    return "";
	    nBgn = nBgn+bgn.length;
	    dest = temp.substr(nBgn,temp.length);
    }
    temp = dest;
    if(end == ""){
	    dest = temp;
    }else{
	    var nEnd = temp.indexOf(end);
	    if(nEnd<0)
		    return "";
	    dest = temp.substr(0,nEnd);
    }
    return dest;
}
//得到相关两个数组的字符串值
function getRelatedIntArrayValue(arrSource,arrDest,sValue){
    for(var i=0;i<arrSource.length;i++)
    {
		if(arrSource[i] == sValue)
			return arrDest[i];
    }
    return -1;
}
//得到相关两个数组的数值
function getRelatedStringArrayValue(arrSource,arrDest,sValue){
    for(var i=0;i<arrSource.length;i++)
    {
		if(arrSource[i] == sValue)
			return arrDest[i];
    }
    return "";
}

//去掉空格
function trimStr(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}
//去掉左边空格
function trimLeftStr(str)
{
     return str.replace(/(^\s*)/g,"");
}
//去掉右边空格
function trimRightStr(str)
{
     return str.replace(/(\s*$)/g,"");
}
//得到默认字符串参数
function getDefaultParam(p1){
    if(typeof(p1) == "undefined")
        return "";
    return p1;
}
//得到当前时间值
function getTimeString()
{
     var  date=new Date();
     var  year=date.getFullYear();
     var  month=date.getMonth()+1;
     month =(month<10 ? "0"+month:month);
     var  day = date.getDate();
     day =(day<10 ? "0"+day:day);
     var  hour = date.getHours();
     hour =(hour<10 ? "0"+hour:hour);
     var  minute = date.getMinutes();
     minute =(minute<10 ? "0"+minute:minute);
     var  second = date.getSeconds();
     second =(second<10 ? "0"+second:second);	 
     var  mSecond = date.getMilliseconds();
	 
     var enddate = year.toString()+":"+month.toString()+":"+day.toString()+" "+hour.toString()+":"+minute.toString()+":"+second.toString()+"  "+ mSecond.toString(); 
      return enddate;
}
function stringFormat() 
{
     if (arguments.length == 0)
         return "";
     var str = arguments[0];
     for (var i = 1; i < arguments.length; i++) {
         var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
         str = str.replace(re, arguments[i]);
     }
     return str;
} 
 
// StringFormat("&Type={0}&Ro={1}&lPlan={2}&Plan={3}&={4}&Id={5}&Id={6}", data1, data2, data3,data4, data5,data6,data7);
function formatCallNum(strNum)
{
	var chNums = "";
	var nCount = 0;
	for(var i=0;i<strNum.length;i++)
	{
		if(strNum[i] == ' ' ||strNum[i] == '-')
			continue;
		chNums = chNums + strNum[i];
		nCount++;
	}
	return chNums;
}
//是否有逗号
function isPhoneNum(strNum,bComma)
{
   if(typeof(bComma) == "undefined"){bComma = false;}
 
	for(var i=0;i<strNum.length;i++)
	{
		var num = strNum[i];
        if(bComma)
        {
            if(num == ',')
                continue;
        }
        if(isNaN(num)) //IsNaN 数字 为false
            return false;
	}
	return true;   
}


//--------------------------------------------------------------------------------------------------
// xml解析器
//--------------------------------------------------------------------------------------------------

function CXmlParse()
{
   this.oXmlDoc = null;
   this.nType = -1; //0 firefox 1:IE
   this.loadXMLFile = function (xmlFileName) {
        try //Internet Explorer
        {
             this.oXmlDoc=new ActiveXObject("Microsoft.XMLDOM");
             this.nType = 1;
        }
        catch(e)
        {
              try //Firefox, Mozilla, Opera, etc.
              {
                  this.oXmlDoc = document.implementation.createDocument("","",null);
                  this.nType = 0;
              }
              catch(e) 
              {
                alert(e.message);
                this.nType = -1;
                return false;
              }
        }
        
        try 
        {
              this.oXmlDoc.async=false;
              this.oXmlDoc.load(xmlFileName);
              alert(xmlFileName);
        }
        catch(e) 
        {
            alert(e.message);
            this.nType = -1;
            return false;
        }
        return true;
    }

   this.loadXml = function(xml){
        try
        {
            var parser = new DOMParser();
            this.oXmlDoc = parser.parseFromString(xml,"text/xml");
            this.nType = 0;
        }
        catch(e)
        {   
            try
            {
                this.oXmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                this.nType = 1;
                this.oXmlDoc.async=false;
                this.oXmlDoc.loadXML(xml);
            }
            catch(e)
            {   
                this.nType = -1;
                return false;
            }
        }
        
        return true;
   }
   this.queryNodes = function(xPath){
        if(this.nType == -1)
        {
            return null;
        }
        if(this.nType == 0)
        {
            return this.oXmlDoc.getElementsByTagName(xPath);
        }
        else
        {
            return this.oXmlDoc.selectSingleNode(xPath);
        }
   }
   this.queryNode = function(xPath){
        if(this.nType == -1)
        {
            return null;
        }
        if(this.nType == 0)
        { 
            var nodes = this.oXmlDoc.getElementsByTagName(xPath);
            if(nodes.length>0)
                return nodes[0];
            return null;
        }
        else
        {
            return this.oXmlDoc.selectSingleNode(xPath);
        }
   }
   this.queryNodeValue = function(oNode){
        if(this.nType == -1)
        {
            return "";
        }
        if(this.nType == 0)
        {
            if(oNode == null)
                return "";
            return oNode.childNodes[0].nodeValue;//读取子节点的值
        }
        else
        {
            if(oNode != null)
                return oNode.text;
            else
                return "";
        }
   }
   this.queryNodeValueByPath = function(xPath){
        if(this.nType == -1)
        {
            return "";
        }
        return this.queryNodeValue(this.queryNode(xPath))
   }
   this.queryNodeAttribute = function(oNode,attrName){
        if(this.nType == -1)
        {
            return "";
        }
        if(this.nType == 0)
        {
            if(oNode == null)
                return "";
            else
                return oNode.getAttribute(attrName);//读取子节点的值
        }
        else
        {
		    if(!oNode)    return "" ;
		    if(!oNode.attributes)   return "" ;   
		    if(oNode.attributes[attrName]!=null)   return oNode.attributes[attrName].value ;
		    if(oNode.attributes.getNamedItem(attrName)!=null)    return oNode.attributes.getNamedItem(attrName).value ;
		    return "";
        }
   }
   this.queryNodeAttributeByPath = function(xPath,attrName){
        if(this.nType == -1)
        {
            return "";
        }
        return this.queryNodeAttribute(this.queryNode(xPath),attrName);
   }
   this.close = function(){
        this.oXmlDoc = null;
        this.nType = null;
   }

   return this;
}

function xmlTest()
{
	var str = "<apspMessage ver=\"2.0.0\" time=\"2014:05:09 18:05:07 546\"><header><sessionID>WUSHENGJUN</sessionID></header><body type=\"event\" name=\"OnPrompt\"><paspparam>4407||0</paspparam></body></apspMessage>";
    var  type = getSubString(str,"type=\"","\"");	
    var  name = getSubString(str,"name=\"","\"");
    var  param = getSubString(str,"<paspparam>","</paspparam>");
    var oParse = new CXmlParse();
    if(oParse.loadXml(str))
    {
        if(oParse.nType == 1)
            alert("IE:"+oParse.queryNodeAttributeByPath("apspMessage/body","name"));
        else
            alert(oParse.queryNodeAttributeByPath("body","name"));
        if(oParse.nType == 1)
            alert("IE:"+oParse.queryNodeValueByPath("apspMessage/header/sessionID"));
        else
            alert(oParse.queryNodeValueByPath("sessionID"));
    }
    oParse = null;
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

function CharToHex(str) {
    var out, i, len, c, h;
    out = "";
    len = str.length;
    i = 0;
    while(i < len) 
    {
        c = str.charCodeAt(i++);
        h = c.toString(16);
        if(h.length < 2)
            h = "0" + h;
        
        out += "\\x" + h + " ";
        if(i > 0 && i % 8 == 0)
            out += "\r\n";
    }
    return out;
}
function getCookie(c_name){
    if(document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1)
                c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
function setCookie(c_name, value, expiredays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    var str = c_name+ "=" + escape(value) + ((expiredays==null) ? "":";expires="+exdate.toGMTString());
    document.cookie = str;
}

/*
 |JS-CINVCCBar版本基线      |          电话条基线版本               |        时 间      |
 ----------------------------------------------------------------------------------------
 |JS-CINVCCBar(1.0.0.6)     |      CINVCCBAR-Setup(20.150101).rar   |    20150307       |
 ----------------------------------------------------------------------------------------
 |JS-CINVCCBar(1.0.0.7)     |      CINVCCBAR-Setup(20.150401).rar   |    20150521       |
 ----------------------------------------------------------------------------------------
 |JS-CINVCCBar(1.0.0.8)     |      CINVCCBAR-Setup(20.150502).rar   |    20150527       |
 ----------------------------------------------------------------------------------------
 */
function GetCABVersion(){
    if (g_JsVersion == "1.0.0.6"){
        return "|20.150101";
    }
    else if (g_JsVersion == "1.0.0.7"){
        return "20.150101|20.150401";
    }
    else if (g_JsVersion == "1.0.0.8"){
        return "20.150401|20.150101";
    }
    return "";
}


/*************************************/
/* JTimer                          */
/*************************************/
var TIMER_AUTO     =  0;
var TIMER_HANDLE   =  1;
var g_oJTimer = null;
function JTimeItem(){
    this.id = -1;
    this.interval = 0;
    this.intervalMax = 0;
    this.intervalCount = -1;
    return this;
}
function JTimer(minInterval){

    if(typeof(minInterval) == "undefined")
        minInterval = 100;//0.1 s

    if(g_oJTimer != null){
        g_oJTimer._cellInterVal = minInterval;
        return g_oJTimer;
    }

    this._cellInterVal = minInterval;
    this._bStart = false;
    this._onTimerCallBackEvent = null;
    this._timers = new Array();
    this._timerType = TIMER_AUTO;//0:自动 1:手动
    this._timerID = null;


    //*******************************
    // public
    //*******************************
    this.SetTimerCallBack = function(callBack){
        this._onTimerCallBackEvent = callBack;
    }
    this.IsProcess = function(){
        return this._bStart;
    }
    this.OnTimer = function(){
        if(this._onTimerCallBackEvent == null)
            return ;
        for(var i=0;i<this._timers.length;i++)
        {
            if(this._timers[i].intervalMax == -1)
                continue;
            this._timers[i].intervalCount++;
            if((this._timers[i].intervalCount >= this._timers[i].intervalMax) && (this._timers[i].intervalMax != -1))
            {
                this._timers[i].intervalCount = 0;
                this._onTimerCallBackEvent(this._timers[i].id);
            }
        }
    }

    this.Start = function(){
        if(this._bStart)
            return;
        if(this._timerType == TIMER_AUTO)
        {
            if(g_oJTimer._timerID == null)
                g_oJTimer._timerID = setInterval( function(){ g_oJTimer.OnTimer()} ,g_oJTimer._cellInterVal);
        }
        this._bStart = true;
    }
    this.Stop = function(){
        if(!this._bStart)
            return ;
        if(g_oJTimer._timerID != null)
        {
            clearInterval(g_oJTimer._timerID);
            g_oJTimer._timerID = null;
        }
        this._bStart = false;
    }

    this.SetTimer = function(id,interval){
        if(id<0 || interval<=0){
            return -1;
        }
        var nIndex = this._getTimerIndex(id);
        if(nIndex != -1){
            this.Reset(id);
            return -3;
        }
        var oTimer = new JTimeItem();
        oTimer.id = id;
        oTimer.interval = interval;
        oTimer.intervalMax = interval/this._cellInterVal;
        this._timers.push(oTimer);
        return this._timers.length -1;
    }
    this.KillTimer = function(id){
        var nIndex = this._getTimerIndex(id);
        if(nIndex != -1)
        {
            this._timers.splice(nIndex,1);
        }
    }
    this.Reset = function(id){
        var nIndex = this._getTimerIndex(id);
        if(nIndex != -1)
        {
            this._timers[nIndex].intervalCount = 0;
        }
    }
    this._getTimerIndex = function(id){
        for(var i=0;i<this._timers.length;i++)
        {
            if(this._timers[i].id == id)
                return i;
        }
        return -1;
    }

    g_oJTimer = this;
    return this;
}
