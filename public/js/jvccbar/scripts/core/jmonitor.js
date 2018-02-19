//  *****************************************************************************
//  文 件 名：	jmonitor.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   监控控件
//  说    明：
//		   支持Silverlight下带界面的质检和监控，同时支持非界面的监控数据接口
//  修改说明：
// *****************************************************************************

var G_oMonitorCtrl = null;


function JMonitorCtrl(nLeft,nTop,nWidth,nHeight,relationPath,oContentWindow,oWindow)
{
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	oWindow = (typeof(oWindow) == "undefined")?null:oWindow;
	this._window = (oWindow==null)?window:oWindow;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = "oMonitor_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
	this.oMonitorShow = null;
	this.oSL_MonShow = null;
	this.oSilverlight = null;
	G_oMonitorCtrl = this;
	//电话条对象
	this.oJVccBar = null;
	this._relationPath = (typeof(relationPath) == "undefined")?"":relationPath;

	
	this._createObject = function(){
        this.oMonitorShow = this._window.document.createElement("DIV");
        this.oMonitorShow.style.cursor = "move";
        this.oMonitorShow.style.position = "absolute";
        this.oMonitorShow.style.border = "1px solid #828282";
        this.oMonitorShow.style.left = this.left+"px";
        this.oMonitorShow.style.top = this.top+"px";
        this.oMonitorShow.style.width = this.width+"px";
        this.oMonitorShow.style.height = this.height+"px";
        this.oMonitorShow.style.textAlign = "center";
        this.oMonitorShow.id = "silverlightControlHost";
        if(this._contentWindow == this._window)
            this._contentWindow.document.body.appendChild(this.oMonitorShow);
        else
	        this._contentWindow.appendChild(this.oMonitorShow);
	    this.oMonitorShow.innerHTML = this._getMSLHtml();
	   
	    this.oSL_MonShow = this.oMonitorShow.firstChild;
	}

    this._getMSLHtml = function(){
        var sText = "";
        sText = sText + "<object id=\"objsilverlightControl\" data=\"data:application/x-silverlight-2,\" type=\"application/x-silverlight-2\" width=\"100%\" height=\"100%\" >";
		sText = sText + "<param name=\"source\" value=\"/CIN-DCP/CIN-COM/CC-Monitor/CCMonitor/Bin/Release/CCMonitor.xap\"/>";
        //sText = sText + "<param name=\"source\" value=\""+this._relationPath+"cab/CCMonitor.xap\"/>";
        sText = sText + "<param name=\"onError\" value=\"onSilverlightError\" />";
        sText = sText + "<param name=\"background\" value=\"white\" />";
        sText = sText + "<param name=\"minRuntimeVersion\" value=\"4.0.50826.0\" />";
        sText = sText + "<param name=\"autoUpgrade\" value=\"true\" />";
        sText = sText + "<param name=\"onLoad\" value=\"SilverlightPluginLoaded\" />";
 //     sText = sText + "<param name=\"Windowless\" value=\"true\" />";
        sText = sText + "<a href=\"http://go.microsoft.com/fwlink/?LinkID=149156&v=5.0.61118.0\" style=\"text-decoration:none\">";
        sText = sText + "<img src=\"http://go.microsoft.com/fwlink/?LinkId=161376\" alt=\"Get Microsoft Silverlight\" style=\"border-style:none\"/>";
        sText = sText + "</a>";
        sText = sText + "</object>";
        
        return sText;    
    }
    
    this._createObject();

    this._ExecuteCmd = function(cmdType,param,mType)
    {
        if(this.oJVccBar == null)	
	    {
		    alert("电话条对象为空,不能执行质检命令!");
		    return;
	    }
        if(cmdType == "listen") {
		    this.oJVccBar.Listen(param,mType);
	    }
	    else if(cmdType == "help"){
		    this.oJVccBar.Help(param,mType);
	    }
	    else if(cmdType == "insert"){
		    this.oJVccBar.Insert(param,mType);
	    }
	    else if(cmdType == "intercept"){
		    this.oJVccBar.Intercept(param,mType);
	    }
	    else if(cmdType == "forcerelease"){
		    this.oJVccBar.ForeReleaseCall(param,mType);
	    }
	    else if(cmdType == "disconnect"){
		    this.oJVccBar.Disconnect();
	    }
		else if (cmdType == "forceidle") {
		    this.oJVccBar.ForceIdle(param);
		}
		else if (cmdType == "forcebusy") {
		    this.oJVccBar.ForceBusy(param);
		}
		else if (cmdType == "forceout") {
		    this.oJVccBar.ForceOut(param);
		}			

    }
	this._GetAppMainPage = function(){
	    if(this.oSL_MonShow != null){
	        if(this.oSilverlight == null)
	        {
	            this.oSilverlight = this.oSL_MonShow.Content.MainApp;
	            this.oSilverlight.RegisterAPIEvent("","MonintorCallBack");
				if(this.oJVccBar != null){
					this.SetReportBtnStatus(this.oJVccBar.GetBtnStatus(),this.oJVccBar.GetAgentStatus());
					this.SetAgentWorkReport(this.oJVccBar.GetAttribute("AgentID"),this.oJVccBar.GetAgentStatus(),this.oJVccBar.GetAgentWorkStatus());
				}
	            this.OnMonitorControlLoad();
	        }
        }
	}	    
	//--------------------------------------------------------------------------------------------------
	// 公用函数
	//--------------------------------------------------------------------------------------------------
	
	this.Destory = function(){
        if(this._contentWindow == this._window)
            this._contentWindow.document.body.removeChild(this.oMonitorShow);
        else
	        this._contentWindow.removeChild(this.oMonitorShow);
	}
	this.SetVccBarCtrl = function(oVccBar){
	    this.oJVccBar = oVccBar;
	}	
	this.Intial = function(ip,port,vccid,agentId,passWord)
	{
	    if(this.oSilverlight != null)
	    {
	        this.oSilverlight.Initial(ip,port,vccid,agentId,passWord);
	    }
	}
	this.SetWallBoardServer = function (ip, port) {
	    if (this.oSilverlight != null) {
	        this.oSilverlight.SetReportServer(ip, port);
	    }
	}
	this.SetFunctionPage = function (pages)
	{
	    if(this.oSilverlight != null)
	    {
	        this.oSilverlight.SetFunctionPage(pages);
	    }
	}
	//1:display 2:API
	this.SetAppMode = function(mode)
	{
	    if(this.oSilverlight != null)
	    {
	        this.oSilverlight.SetAppMode(mode);
	    }
	}
	this.ChangeMode = function(index)
	{
	    if(this.oSilverlight != null)
	    {
	        this.oSilverlight.ChangeMode(index);
	    }
	}
	this.GetVersion = function () {
	    if (this.oSilverlight != null)
        {
	        return this.oSilverlight.GetVersion();
	    }
	}
	this.SetReportBtnStatus = function(btnIds,agentStatus)
	{
		if(this.oSilverlight != null)
			this.oSilverlight.SetEableBtns(btnIds,agentStatus);
	}
	this.SetAgentWorkReport = function(agentID,agentStatus,workStatus)
	{
		if(this.oSilverlight != null)
			this.oSilverlight.SetAgentStatus(agentID,agentStatus,workStatus);
	}
	
	//方法
	//2.3.5	监控命令	41
	//2.3.5.1	InitialState（查询监控信息）	41
	this.InitialState =  function InitialState()  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.InitialState();	
		return -1;
	}
	//2.3.5.2	AgentQuery（查询座席信息）	42
	this.AgentQuery =  function AgentQuery(monitorid,curpos)  {	
	    if(this.oSilverlight != null)
			return this.oSilverlight.AgentQuery(monitorid,curpos);	
		return -1;
	}
	//2.3.5.3	TelQuery（电话信息查询）	43
	this.TelQuery =  function TelQuery(monitorid,curpos)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.TelQuery(monitorid,curpos) ;	
		return -1;
	}
	//2.3.5.4	IvrQuery（IVR信息查询）	43
	this.IvrQuery =  function IvrQuery(monitorid,curpos)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.IvrQuery(monitorid,curpos);	
		return -1;
	}
	//2.3.5.5	ServiceQuery（服务器信息查询）	44
	this.ServiceQuery =  function ServiceQuery(monitorid,curpos)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.ServiceQuery(monitorid,curpos);	
		return -1;
	}
	//2.3.5.6	TaskQuery（任务信息查询）	46
	this.TaskQuery =  function TaskQuery(monitorid,curpos)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.TaskQuery(monitorid,curpos);	
		return -1;
	}
	//2.3.5.7	CallReportQuery（呼叫统计信息查询）	47
	this.CallReportQuery =  function CallReportQuery(monitorid,curpos)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.CallReportQuery(monitorid,curpos);	
		return -1;
	}
	//2.3.5.8	GetTaskSummary（得到具体Task概述信息）	49
	this.GetTaskSummary =  function GetTaskSummary(monitorid,taskid)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.GetTaskSummary(monitorid,taskid);	
		return -1;
	}
	//2.3.5.9	QueryMonitorSumInfo（查询指定参数的统计信息）	23
	this.QueryMonitorSumInfo = function QueryMonitorSumInfo(cmdName,amdParam){	
	    if(this.oSilverlight != null)
			return this.oSilverlight.QueryMonitorSumInfo(cmdName,amdParam);
	    return -1;
	}
	//2.3.5.10	StartNotification（开始监控）	50
	this.StartNotification =  function StartNotification(id,type,flag)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.StartNotification(id,type,flag);	
		return -1;
	}
	//2.3.5.11	EndNotification（结束监控）	51
	this.EndNotification =  function EndNotification(id)  {		
	    if(this.oSilverlight != null)
			return this.oSilverlight.EndNotification(id);	
		return -1;
    }
    //事件
    this.OnMonitorControlLoad = function(){}

    this.OnMethodResponseEvent = function(key,vReturn){ }
    //电话条    
	this.OnAgentReport = function (AgentReportInfo){}
	this.OnTelReport = function (TelReportInfo){}
	this.OnServiceReport = function (ServiceReportInfo){}
	this.OnIvrReport = function (IvrReportInfo){}
	this.OnTaskReport = function (TaskReportInfo){}
	this.OnOutboundReport = function (TaskInfo){}
	this.OnCallReportInfo = function (CallInfo){}
	this.OnQueryMonitorSumReport = function (cmdName,reportInfo){}	
	this.OnWallServiceReport = function (serviceReportInfo){}
	this.OnWallQueueReport = function (queueInfo){}
	this.OnServiceStaticReport = function (staticInfo){}
	this.OnAgentStaticReport = function (staticInfo){}
    	
	//显示函数
	this.Display = function (flag)
	{
		if(flag == 1)
		{
			//this.oMonitorShow.style.display = "block";
			this.Refresh();
		}
		else
		{
//			this.oMonitorShow.style.display = "none";
            this.oMonitorShow.style.left = "0px";
            this.oMonitorShow.style.top =  "0px";
            this.oMonitorShow.style.width = "0px";
            this.oMonitorShow.style.height = "0px";
		}				
	}
 	this.Refresh = function ()
	{
		if( this.oSL_MonShow != null)
		{
			this.oSL_MonShow.style.left = this.left;
			this.oSL_MonShow.style.top = this.top;
			this.oSL_MonShow.style.width = this.width;
			this.oSL_MonShow.style.height = this.height;
		}
		this.Resize(this.left,this.top,this.width,this.height);
	}
	this.Resize = function (nLeft,nTop,nWidth,nHeight)
	{
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>=0)?nWidth:100;
		this.height	= (nHeight>=0)?nHeight:100;
		
        this.oMonitorShow.style.left = this.left+"px";
        this.oMonitorShow.style.top = this.top+"px";
        this.oMonitorShow.style.width = this.width+"px";
        this.oMonitorShow.style.height = this.height+"px";
        
		//this.oSL_MonShow.style.width = this.width;
		//this.oSL_MonShow.style.height = this.height;
	}
 
    return this;
}


function onSilverlightError(sender, args) 
{
    var appSource = "";
    if (sender != null && sender != 0) {
      appSource = sender.getHost().Source;
    }
    
    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;

    if (errorType == "ImageError" || errorType == "MediaError") {
      return;
    }

    var errMsg = "Unhandled Error in Silverlight Application " +  appSource + "\n" ;

    errMsg += "Code: "+ iErrorCode + "    \n";
    errMsg += "Category: " + errorType + "       \n";
    errMsg += "Message: " + args.ErrorMessage + "     \n";

    if (errorType == "ParserError") {
        errMsg += "File: " + args.xamlFile + "     \n";
        errMsg += "Line: " + args.lineNumber + "     \n";
        errMsg += "Position: " + args.charPosition + "     \n";
    }
    else if (errorType == "RuntimeError") {           
        if (args.lineNumber != 0) {
            errMsg += "Line: " + args.lineNumber + "     \n";
            errMsg += "Position: " +  args.charPosition + "     \n";
        }
        errMsg += "MethodName: " + args.methodName + "     \n";
    }

    throw new Error(errMsg);
}

function SilverlightPluginLoaded()
{
    if(G_oMonitorCtrl != null)
    {
        G_oMonitorCtrl._GetAppMainPage();
    }
}
function MonitorFromSL(cmdType,destNum,mType)
{
    if(G_oMonitorCtrl != null)
        G_oMonitorCtrl._ExecuteCmd(cmdType,destNum,mType);
}
function MonintorCallBack(key,param1,param2)
{
    if(G_oMonitorCtrl != null)
    {
        if(  key == "InitialState"        || key == "AgentQuery"
            || key == "TelQuery"            || key == "IvrQuery"  
            || key == "ServiceQuery"        || key == "TaskQuery"  
            || key == "CallReportQuery"     || key == "GetTaskSummary"  
            || key == "QueryMonitorSumInfo" ||key == "StartNotification"  
            || key == "EndNotification")
        {
            G_oMonitorCtrl.OnMethodResponseEvent(key,param1);
        }
        else if(key == "OnAgentReport"){ G_oMonitorCtrl.OnAgentReport(param1);}
        else if(key == "OnTelReport"){ G_oMonitorCtrl.OnTelReport(param1);}
        else if(key == "OnServiceReport"){ G_oMonitorCtrl.OnServiceReport(param1);}
        else if(key == "OnIvrReport"){ G_oMonitorCtrl.OnIvrReport(param1);}
        else if(key == "OnTaskReport"){ G_oMonitorCtrl.OnTaskReport(param1);}
        else if(key == "OnOutboundReport"){ G_oMonitorCtrl.OnOutboundReport(param1);}
        else if(key == "OnCallReportInfo"){ G_oMonitorCtrl.OnCallReportInfo(param1);}
        else if(key == "OnQueryMonitorSumReport"){ G_oMonitorCtrl.OnQueryMonitorSumReport(param1,param2);}
        else if(key == "OnWallServiceReport"){ G_oMonitorCtrl.OnWallServiceReport(param1);}
        else if(key == "OnWallQueueReport"){ G_oMonitorCtrl.OnWallQueueReport(param1);}
        else if(key == "OnServiceStaticReport"){ G_oMonitorCtrl.OnServiceStaticReport(param1);}
        else if(key == "OnAgentStaticReport"){ G_oMonitorCtrl.OnAgentStaticReport(param1);}
    }
}


