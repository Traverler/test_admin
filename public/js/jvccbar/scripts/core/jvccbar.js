//  *****************************************************************************
//  文 件 名：	jvccbar.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   电话条对位接口
//  说    明：
//		   支持ocx和websocket两种方式，同时支持内联函数
//  修改说明：
// *****************************************************************************


function JVccBar(nLeft,nTop,nWidth,nHeight,showstyle,oContentWindow)
{
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	this.showstyle      = showstyle;  //showStyleNONE/showStyleOCX/showStyleJS
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = "oBar_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
    this.oBarControl = null ;

	this.userBtnIds = "";
	this.workStatus = -1;
	
	//电话条内联显示对象
	this.oBarShow		= null;	
	//电话条功能实现对象
	this.oBarCtrl		= null;	
	//监控控件对象
	this.oMonitorCtrl	= null;	
	
	this.errDescription = "";		// 错误提示信息
	
	//特殊参数
	this._appType = -1; //0：Agent 1：Monitor 2：agent+minitor

	//########################//
	//			方法	　    //
	//########################//
	//内部方法:
	this._createObject = function _createObject()
	{
		// 创建电话条控件,有优先使用websocket
		if(this.oBarControl == null){
		    this.oBarControl = new CHtmlBarControl(getLocalLanguage());
		}

		switch(this.showstyle)
		{
		    case showStyleOCX:
		    {
                this.oBarCtrl = new JOcxCtrl(this.left,this.top,this.width,this.height,1,this._contentWindow);
                this.oBarCtrl.oParent = this;
		    }
		    break;
			case showStyleSL:
			{
				this.height = this.width = 0;
				//this.oBarCtrl = new JSilverLightCtrl(this.left,this.top,this.width,this.height,"/CIN-DCP/CIN-COM/CC-VccBar/CCVccBar/CCVccBar/Bin/Release/",this._contentWindow);
				this.oBarCtrl = new JSilverLightCtrl(this.left,this.top,this.width,this.height,application.GetRelationPath()+"cab/",this._contentWindow);
			}
			break;
		    case showStyleJS:
		    {
                this.oBarCtrl = new JHTML5Ctrl();
		    }
		    break;
			case showStyleNONE:
		    default:
		    {
		        if( application.IsSurpportWebSocket() ){
	                this.oBarCtrl = new JHTML5Ctrl();
	            }
	            else{
					this.height = this.width = 0;
					this.oBarCtrl = new JSilverLightCtrl(this.left,this.top,this.width,this.height,application.GetRelationPath()+"cab/",this._contentWindow);
	            }
		    }
		    break;		    
		}
		//set oBarCtrl default attribute
		this.SetAttribute("AgentType",0);
		this.SetAttribute("PassWord","111111");
		this.SetAttribute("MainPortID",14800);
		this.SetAttribute("BackPortID",14800);
		this.SetAttribute("TaskID","0");
		this.SetAttribute("MonitorPort",4502);
		this.SetAttribute("AppType",0);
		this.SetAttribute("SipServerPort",5060);
		this.SetAttribute("SipPassWord","00000000");
		this.SetAttribute("SipProtocol","UDP");
		this.SetAttribute("SipPassWdCryptType",0);
		this.SetAttribute("SipAuthType",1);
		this.SetAttribute("PhonType",0);
		this.SetAttribute("SelfPrompt",0);
		this.SetAttribute("forceEndProcess",g_DebugFlag);
		
		//set event callback function
		this.oBarCtrl.oParent = this;
	    this.oBarCtrl.attachEventfun(this._eventFunction);
	    this.oBarCtrl.attachResponsefun(this._responseFunction);

		if(this.GetJVccBarType() == vccBarTypeHTML5 )
			this.oBarCtrl.GetVersion();

	}


    //*********************回调函数******************************//
    //异步命令的函数返回函数(html5中才有)
	this._responseFunction  = function(cmdName,param){ 
        DisplayLog(VccBar_Log_Debug,"JVccBar:OnMethodResponseEvent(cmdName:【"+cmdName+"】 param: 【"+param+"】)");
	    if(cmdName == "GetWeChatParam")
	    {
             if(application.oWechatManager != null){
                application.oWechatManager.SetUserInfo(param);
             }
        }
		else if(cmdName == "Initial"){
			if(param == "-2"){
				if(getLocalLanguage() == lg_zhcn)
					alert("版本不匹配，请更新版本再使用!");
				else
					alert("dismatch version，please update new version!");
			}
		}
       application.oJVccBar.OnMethodResponseEvent(cmdName,param);
	}
	//事件的回调函数
	this._eventFunction  = function(cmdIndex,param){
		var oThis = this.oParent;
		if(param == null || typeof(param) == "undefined")
			param = "";
		var arrParam ;
		try{
			arrParam = param.split("|");
		}
		catch(e){

		}
	    if(cmdIndex == 31 || cmdIndex == 116)
	    {
            DisplayLog(VccBar_Log_Debug,"JVccBar:_eventFunction(cmdIndex="+cmdIndex+",param="+param+")");
        }
        else
        {
            DisplayLog(VccBar_Log_Debug,"JVccBar:_eventFunction(cmdIndex="+cmdIndex+",param="+param+")");
        }
	    switch(cmdIndex){
	    //呼叫事件 3
	    case eventOnCallRing:
	        application.oJVccBar.OnCallRing(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5],arrParam[6],arrParam[7],arrParam[8],arrParam[9],arrParam[10],arrParam[11],arrParam[12],arrParam[13],arrParam[14],arrParam[15],arrParam[16]);
	        break;
	    case eventOnAnswerCall:
	        application.oJVccBar.AnswerCall(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5],arrParam[6]);
	        break;
	    case eventOnCallEnd:
	        application.oJVccBar.OnCallEnd(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5],arrParam[6],arrParam[7],arrParam[8],arrParam[9],arrParam[10],arrParam[11],arrParam[12],arrParam[13],arrParam[14]);
	        break;
	    //提示事件 18    
	    case eventOnPrompt:
	        {
                var des = application.oJVccBar.oBarControl.GetErrorItemDes(arrParam[0]);
                if(des == "") des = arrParam[1];
	            if(oThis.GetAttribute("SelfPrompt") == 1 && application.oJVccBar.oBarShow != null)
	            {
					oThis.oBarShow.ShowSelfPrompt(arrParam[0],des);
	            }
	            else
	            {
					oThis.OnPrompt(arrParam[0],des);
                }
	        }
	        break;
	    case eventOnReportBtnStatus:
			oThis.userBtnIds = param;
	        if( oThis.oBarShow != null)
	        {
	            oThis.oBarShow.ChangeBtnStatus(param);
	            oThis.oBarShow.SetAgentStatus(oThis.GetAgentStatus());
	        }
	        if(oThis.oMonitorCtrl != null)
	        {
	            oThis.oMonitorCtrl.SetReportBtnStatus(param,oThis.GetAgentStatus());
	        }
			oThis.OnReportBtnStatus(param);
			oThis.OnAgentStatus(oThis.GetAgentStatus());
	        break;
	    case eventOnInitalSuccess:	        
	        if( oThis.oBarShow != null)
	            oThis.oBarShow.SetSubBusyStatus(oThis.GetBusySubStatus());
	        oThis.OnInitalSuccess();
	        break;
	    case eventOnInitalFailure:	        
	        oThis.OnInitalFailure(arrParam[0],arrParam[1]);
	        break;
	    case eventOnEventPrompt:
	        oThis.OnEventPrompt(arrParam[0],arrParam[1]);
	        break;
	    case eventOnAgentWorkReport:
			oThis.workStatus = parseInt(arrParam[0]);
	        if(arrParam[0] == "-1")
	        {
	            if( oThis.oBarShow != null)
	                oThis.oBarShow.SetSubBusyStatus("");
	        }
	        if(oThis.oMonitorCtrl != null)
	        {
	            oThis.oMonitorCtrl.SetAgentWorkReport(oThis.GetAttribute("AgentID"),oThis.GetAgentStatus(),parseInt(arrParam[0]));
	        }
	        oThis.OnAgentWorkReport(arrParam[0],arrParam[1]);
	        break;
	    case eventOnCallDataChanged:
	        oThis.OnCallDataChanged(param);
	        break;
	    case eventOnBarExit:
		{
			var des = oThis.oBarControl.GetErrorItemDes(arrParam[0]);
			if(des == "") des = arrParam[1];
			oThis.OnBarExit(arrParam[0],des);
			break;
		}
	    case eventOnCallQueueQuery:
	        oThis.OnCallQueueQuery(param);
	        break;
	    case eventOnQueryGroupAgentStatus:
			{
				//QueryInfo+"@"+type
				var oMyParam = param.split("@");
				var ntype = "0";
				if(oMyParam.length>1)
					ntype = oMyParam[1];
				oThis.OnQueryGroupAgentStatus(oMyParam[0],ntype);
			}
	        break;
	    case eventOnSystemMessage:
	        oThis.OnSystemMessage(arrParam[0],arrParam[1]);
	        break;
	    case eventOnRecvWeiboMsg:
	        oThis.OnRecvWeiboMsg(param);
	        break;
	    case eventOnIMMessage:
	        oThis.OnIMMessage(arrParam[0],arrParam[1]);
	        break;
	    case eventOnRecvWeChatMessage:
	        {
	            if(application.oWechatManager != null)
	            {
    	            application.oWechatManager.OnSaveRecvMessageReport(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5],arrParam[6],arrParam[7],arrParam[8],arrParam[9],arrParam[10],arrParam[11],arrParam[12],arrParam[13]);
	            }       
    	        oThis.OnRecvWeChatMessage(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5],arrParam[6],arrParam[7],arrParam[8],arrParam[9],arrParam[10],arrParam[11],arrParam[12],arrParam[13]);
	        }
	        break;
	    case eventOnSendWeChatMsgReport:
	        {
	            if(application.oWechatManager != null)
	            {
	                application.oWechatManager.OnSaveSendMessageReport(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5]);
	            }
	            oThis.OnSendWeChatMsgReport(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5]);
	         }
	        break;
	    case eventOnUploadFileToMMSReport:
		    {
				if(application.oWechatManager != null){
					application.oWechatManager.OnInvokeUploadFileToMMSReport(arrParam[0],arrParam[1],arrParam[2]);
				}
				oThis.OnUploadFileToMMSReport(arrParam[0],arrParam[1],arrParam[2]);
			}
	        break;
	    case eventOnDownloadFileToMMSReport:
			{
				if (application.oWechatManager != null) {
					application.oWechatManager.OnInvokeDownFileFromMMSReport(arrParam[0], arrParam[1],arrParam[2],arrParam[3]);
				}
				oThis.OnDownloadFileToMMSReport(arrParam[0], arrParam[1],arrParam[2],arrParam[3]);
			}
	        break;
	    case eventOnWorkStaticInfoReport:
		{
			oThis.OnWorkStaticInfoReport(param);
			break;
		}
	    case eventOnAQueryCTIInfoReport:
			oThis.OnQuerySPGroupList(arrParam[0], getSubString(param,"|",""));
			break;
		case eventOnAgentBusyReasonReport:
			oThis.OnAgentBusyReason(arrParam[0], getSubString(param,"|",""));
			break;
		case eventOnAgentLogUploadReport:
			//0000101000056603|0|192.168.2.136:8089|cincc_0000101000056603_20160513_165554.zip|358|201 Created
			oThis.OnAgentLogUpload(arrParam[0],arrParam[1],arrParam[2],arrParam[3],arrParam[4],arrParam[5]);
			break;

	    //监控事件 13
	    case eventOnAgentReport:
	        oThis.OnAgentReport(param);
	        break;
	    case eventOnTelReport:
	        oThis.OnTelReport(param);
	        break;
	    case eventOnServiceReport:
	        oThis.OnServiceReport(param);
	        break;
	    case eventOnIvrReport:
	        oThis.OnIvrReport(param);
	        break;
	    case eventOnTaskReport:
	        oThis.OnTaskReport(param);
	        break;
	    case eventOnOutboundReport:
	        oThis.OnOutboundReport(param);
	        break;
	    case eventOnCallReportInfo:
	        oThis.OnCallReportInfo(param);
	        break;
	    case eventOnQueueReport:
	        oThis.OnQueueReport(param);
	        break;
	    case eventOnQueryMonitorSumReport:
	        oThis.OnQueryMonitorSumReport(arrParam[0],arrParam[1]);
	        break;
	    case eventOnWallServiceReport:
	        oThis.OnWallServiceReport(param);
	        break;
	    case eventOnWallQueueReport:
	        oThis.OnWallQueueReport(param);
	        break;
	    case eventOnServiceStaticReport:
	        oThis.OnServiceStaticReport(param);
	        break;
	    case eventOnAgentStaticReport:
	        oThis.OnAgentStaticReport(param);
	        break;
	    case eventOnWebsocketSocket:

			if(this.GetBarType() == vccBarTypeSILVERLIGHT)
			{
				var code = arrParam[0];
				if(code == 1){
					DisplayLog(VccBar_Log_Protocol,arrParam[1]);
				}
				else if(code == 2){
					DisplayLog(VccBar_Log_Info,arrParam[1]);
				}
				else if(code == 4){
					DisplayLog(VccBar_Log_Warn,arrParam[1]);
				}
				else if(code == 8){
					DisplayLog(VccBar_Log_Error,arrParam[1]);
				}
				else{
					oThis.OnPrompt(arrParam[0],arrParam[1]);
				}
			}
			else
			{
				//if(oThis.GetAttribute("SelfPrompt") == 1 && oThis.oBarShow != null)
				if(oThis.GetAttribute("SelfPrompt")  == 1 && oThis.oBarShow != null)
				{
					oThis.oBarShow.ShowSelfPrompt(arrParam[0],arrParam[1]);
				}
				else
				{
					//oThis.OnPrompt(arrParam[0],arrParam[1]);
					oThis.OnPrompt(arrParam[0],arrParam[1]);
				}
			}
	        break;
	    }
	}
	
	
	//--------------------------------------------------------------------------------------------------
	// 属性设置,电话条对外接口
	//--------------------------------------------------------------------------------------------------
    //设置电话条属性
    this.SetAttribute = function(aName,aValue){
        if(aName == "AppType"){
            //Agent类型，监控走单独的接口Silverlight接口
            this._appType = aValue;
        }
		else if(aName == "AutoUpdateURL"){
			if(aValue != ""){
				if(aValue.charAt(aValue.length-1) == "/")
					aValue = aValue + "JVccBar/version/update";
				else
					aValue = aValue + "/JVccBar/version/update";
			}
		}
		this.oBarCtrl.SetCtrlAttribute(aName,aValue);
    }
    this.GetAttribute = function(aName){
        return this.oBarCtrl.GetCtrlAttribute(aName);
    }
	
	//--------------------------------------------------------------------------------------------------
	// 外部方法,电话条对外接口
	//--------------------------------------------------------------------------------------------------
	//2.3.1	基本命令	9
	//2.3.1.1	Initial（初始化）	9
	this.Initial = function Initial(){
	    if(this._appType == 0)
	    {
	        return this.oBarCtrl.Initial();
	    }
	    else if(this._appType == 1)
	    {
	        alert("单独监控请不要使用电话条方式!");
	        return 0;
	    }
	    else if(this._appType == 2)
	    {
	        return this.oBarCtrl.Initial();
	    }
        return -1;	    
	}
	//2.3.1.2	SerialBtn（设置电话条按钮）	10
	this.SerialBtn = function SerialBtn(btnIDS,hiddenIDS){ 
	    if(this.oBarShow != null){
	        this.oBarShow.SerialBtn(btnIDS,hiddenIDS);
	    }
	    return this.oBarCtrl.SerialBtn(btnIDS,hiddenIDS);
	}
	//2.3.1.3	GetBtnStatus（得到可用电话按钮）	10
	this.GetBtnStatus = function GetBtnStatus(CallNum) {
		//return this.oBarCtrl.GetBtnStatus(CallNum);
		return this.userBtnIds;
	}
	//2.3.1.4	Configurate（设置电话条配置）	10
	this.Configurate = function Configurate(Params) {return this.oBarCtrl.Configurate(Params);}
	//2.3.1.5	GetConfiguration（得到电话条配置参数）	12
	this.GetConfiguration = function GetConfiguration() { return this.oBarCtrl.GetConfiguration();}
	//2.3.1.6	UnInitial（释放电话条）	12
	this.UnInitial = function UnInitial(code){
		if(typeof(code) == "undefined") code = 0;
		return this.oBarCtrl.UnInitial();
	}
	//2.3.1.7	SetUIStyle（设置电话条风格）	13
	this.SetUIStyle = function SetUIStyle(barStyle){	return this.oBarCtrl.SetUIStyle(barStyle);}
	//2.3.1.8	GetVersion（得到电话版本）	13
	this.GetVersion = function GetVersion() { return g_JsVersion+"("+this.oBarCtrl.GetVersion()+")"; }
	
	//2.3.2	基本状态	14
	//2.3.2.1	SetBusy（置忙）	14
	this.SetBusy = function SetBusy(subStatus){	return this.oBarCtrl.SetBusy(subStatus);}
	//2.3.2.2	SetIdle（置闲）	14
	this.SetIdle = function SetIdle(){	return this.oBarCtrl.SetIdle();}
	//2.3.2.3	SetWrapUp（置后续态）	14
	this.SetWrapUp = function SetWrapUp(){	return this.oBarCtrl.SetWrapUp();}
	//2.3.2.4	SetCTICalloutTask（设置外呼任务）	15
	this.SetCTICalloutTask = function SetCTICalloutTask(TastNum){	return this.oBarCtrl.SetCTICalloutTask(TastNum);}
	//2.3.2.5	GetCTICalloutTask（得到外呼任务编号）	15
	this.GetCTICalloutTask = function GetCTICalloutTask(){	return this.oBarCtrl.GetCTICalloutTask();}
	//2.3.2.6	GetCallData（得到随路数据）	15
	this.GetCallData = function GetCallData(destAgentID){	return this.oBarCtrl.GetCallData(destAgentID);}
	//2.3.2.7	SetCallData（设置随路数据）	16
	this.SetCallData = function SetCallData(destAgentID,calldata){	return this.oBarCtrl.SetCallData(destAgentID,calldata);}
	//2.3.2.8	GetTransfer（得到前转信息）	16
	this.GetTransfer = function GetTransfer(){	return this.oBarCtrl.GetTransfer();}
	//2.3.2.9	SetTransfer（设置前转信息）	17
	this.SetTransfer = function SetTransfer(forwardDeviceID,forwardState,answerType){	return this.oBarCtrl.SetTransfer(forwardDeviceID,forwardState,answerType);}
	//2.3.2.10	ChangeCallQueue（调整用户排队优先级）	17
	this.ChangeCallQueue = function ChangeCallQueue(calling,sid,orderid){ return this.oBarCtrl.ChangeCallQueue(calling,sid,orderid);}
	//2.3.2.11	GetCallID（得到CallID）	17
	this.GetCallID = function GetCallID(){	return this.oBarCtrl.GetCallID();}
	//2.3.2.12	QuerySPGroupList（得到技能组中某种状态的座席列表）	18
	this.QuerySPGroupList = function QuerySPGroupList(groupID,agentStatus,cmdType,checkAuthor,action,interval){
		if(typeof(action) == "undefined") action = 2;
		if(typeof(interval) == "undefined") interval = 0;
		return this.oBarCtrl.QuerySPGroupList(groupID,agentStatus,cmdType,checkAuthor,action,interval);
	}
	//2.3.2.13	GetCallInfo（得到当前呼叫信息）	19
	this.GetCallInfo = function GetCallInfo(){	return this.oBarCtrl.GetCallInfo();}
	//2.3.2.14	SetTransparentParameter（设置透明参数）	20
	this.SetTransparentParameter = function SetTransparentParameter(transparentParam){	return this.oBarCtrl.SetTransparentParameter(transparentParam);}
	//2.3.2.15	GetAgentStatus（得到座席状态）	20
	this.GetAgentStatus = function GetAgentStatus(){	return this.oBarCtrl.GetAgentStatus();}
	//补充函数
	this.GetAgentSubBusyStatus = function GetAgentSubBusyStatus(){	return this.oBarCtrl.GetAgentSubBusyStatus();}
	//2.3.2.16	GetBusySubStatus（得到座席忙碌子状态）	20
	this.GetBusySubStatus = function GetBusySubStatus(){	return this.oBarCtrl.GetBusySubStatus();}
	//2.3.2.17	SetDisplayNumber（设置外呼显示号码）	21
	this.SetDisplayNumber = function SetDisplayNumber(dstNum){	return this.oBarCtrl.SetDisplayNumber(dstNum);}
	//2.3.2.18	GetDisplayNumber（座席分机显示号码）	21
	this.GetDisplayNumber = function GetDisplayNumber(){	return this.oBarCtrl.GetDisplayNumber();}
	//2.3.2.19	CallQueueQuery（查询排队信息）	21
	this.CallQueueQuery = function CallQueueQuery(serviceID,action,interval){
		if(typeof(action) == "undefined") action = 2;
		if(typeof(interval) == "undefined") interval = 0;
		return this.oBarCtrl.CallQueueQuery(serviceID,action,interval);
	}
	//2.3.2.20	QueryGroupAgentStatus（查询指定组的座席状态）	22
	this.QueryGroupAgentStatus = function QueryGroupAgentStatus(groupIDs,action,interval,type){
		if(typeof(type) == "undefined") type = 0;
		return this.oBarCtrl.QueryGroupAgentStatus(groupIDs,action,interval,type);
	}
	//2.3.2.21	QueryPreViewCallOutNumbers（查询并分配预览外呼号码）	22
	this.QueryPreViewCallOutNumbers = function QueryPreViewCallOutNumbers(serviceNum,agentID,num,realloc){	return this.oBarCtrl.QueryPreViewCallOutNumbers(serviceNum,agentID,num,realloc);}
	//2.3.2.22	GetBase64Data（得到base64编码）	24
	this.GetBase64Data = function GetBase64Data(data){	return this.oBarCtrl.GetBase64Data(data);}
	//2.3.2.23	GetDataFromBase64（从Base64编码得到原始数据）	24
	this.GetDataFromBase64 = function GetDataFromBase64(data){	return this.oBarCtrl.GetDataFromBase64(data);}
	//2.3.2.24	SetWeChatQueueFlag（设置座席是否参与排对）	24
	this.SetWeChatQueueFlag = function SetWeChatQueueFlag(flag) { return this.oBarCtrl.SetWeChatQueueFlag(flag);}
	//2.3.2.25	GetWeChatQueueFlag（得到座席参与排队标示）	25
	this.GetWeChatQueueFlag = function GetWeChatQueueFlag() { return this.oBarCtrl.GetWeChatQueueFlag();}
	//2.3.2.26	TransferCallQueue（转接排队中的用户）	25
	this.TransferCallQueue = function TransferCallQueue(queuekey,lTransferType,destNum) { return this.oBarCtrl.TransferCallQueue(queuekey,lTransferType,destNum);}
	//2.3.2.27	SetActiveService（设置当前人工服务）	15
	this.SetActiveService = function SetActiveService(ServiceNum){	return this.oBarCtrl.SetActiveService(ServiceNum);}
	//2.3.2.28	GetActiveService（得到当前人工服务）	15
	this.GetActiveService = function GetActiveService(){	return this.oBarCtrl.GetActiveService();}
	//2.3.2.29	GetExitCause（得到座席退出原因列表）	15
	this.GetExitCause = function GetExitCause(){	return this.oBarCtrl.GetExitCause();}
	//2.3.2.30	SetForwardNumber（设置接续号码）	15
	this.SetForwardNumber = function SetForwardNumber(Num,State){	return this.oBarCtrl.SetForwardNumber(Num,State);}
	//2.3.2.31	GetForwardNumber（得到接续号码）	15
	this.GetForwardNumber = function GetForwardNumber(){	return this.oBarCtrl.GetForwardNumber();}
	//2.3.2.32	SetAgentReservedStatus（设置坐席预留状态）	15
	this.SetAgentReservedStatus = function SetAgentReservedStatus(agentStatus,subBusyStatus){
		return this.oBarCtrl.SetAgentReservedStatus(agentStatus,subBusyStatus);
	}	//
	this.GetAgentWorkStatus = function(){ return this.workStatus;}

	this.GetAgentLogFile = function(destAgentID,uploadServer,urlType){
		destAgentID = getDefaultParam(destAgentID);
		if(destAgentID == "")
			return -1;
		if(typeof(urlType) == "undefined") urlType = 0;//acd
		uploadServer = getDefaultParam(uploadServer);
		return this.oBarCtrl.GetAgentLogFile(destAgentID,urlType,uploadServer);
	}

	//2.3.3	呼叫命令	25
	//2.3.3.1	MakeCall（外呼）	25
	this.MakeCall = function MakeCall(DestNum,serviceDirect,taskID,transParentParam,phoneID)	{		return this.oBarCtrl.MakeCall(DestNum,serviceDirect,taskID,transParentParam,phoneID);	}
	//2.3.3.2	CallIn（内呼）	26
	this.CallIn = function CallIn(DestAgentID,serviceDirect,taskID,transParentParam)	{		return this.oBarCtrl.CallIn(DestAgentID,serviceDirect,taskID,transParentParam);	}
	//2.3.3.3	TransferOut（转出）	27
	this.TransferOut = function TransferOut(lTransferType,DestNum){		return this.oBarCtrl.TransferOut(lTransferType,DestNum);	}
	//2.3.3.4	Hold（保持）	28
	this.Hold = function Hold(){	return this.oBarCtrl.Hold();}
	//2.3.3.5	RetrieveHold（接回）	28
	this.RetrieveHold = function RetrieveHold(){	return this.oBarCtrl.RetrieveHold();}
	//2.3.3.6	Disconnect（挂断）	28
	this.Disconnect = function Disconnect(callType){	return this.oBarCtrl.Disconnect(callType);}
	//2.3.3.7	Answer（接通）	29
	this.Answer = function Answer(recordFlag){	
	    if(typeof(recordFlag) == "undefined") recordFlag = 0;
	    return this.oBarCtrl.Answer(recordFlag);
	}
	//2.3.3.8	Consult（咨询）	29
	this.Consult = function Consult(lConsultType,ConsultNum){		return this.oBarCtrl.Consult(lConsultType,ConsultNum);	}
	//2.3.3.9	Transfer（转移）	30
	this.Transfer = function Transfer(){	return this.oBarCtrl.Transfer();}
	//2.3.3.10	Conference（会议）	30
	this.Conference = function Conference(){	return this.oBarCtrl.Conference();}
	//2.3.3.11	SendDTMF（二次拨号）	30
	this.SendDTMF = function SendDTMF(TapKey){	return this.oBarCtrl.SendDTMF(TapKey);}
	//2.3.3.12	BeginRecord（录音）	31
	this.BeginRecord = function BeginRecord(destAgentID,fileName){	return this.oBarCtrl.BeginRecord(destAgentID,fileName);}
	//2.3.3.13	StopRecord（停录）	31
	this.StopRecord = function StopRecord(destAgentID){	return this.oBarCtrl.StopRecord(destAgentID);}
	//2.3.3.14	BeginPlay（视频推送）	31
	this.BeginPlay = function BeginPlay(DestAgentID,destDeviceID,nType,fileName,varparam){	return this.oBarCtrl.BeginPlay(DestAgentID,destDeviceID,nType,fileName,varparam);}
	//2.3.3.15	StopPlay（停止推送）	32
	this.StopPlay = function StopPlay(DestAgentID,DestDeviceID){	return this.oBarCtrl.StopPlay(DestAgentID,DestDeviceID);}
	//2.3.3.16	Bridge（桥接）	32
	this.Bridge = function Bridge(IVRNum,bEndCall){		return this.oBarCtrl.Bridge(IVRNum,bEndCall);	}
	//2.3.3.17	Mute（静音）	33
	this.Mute = function Mute(flag){	return this.oBarCtrl.Mute(flag);}
	//2.3.3.18	AlterNate（切换）	33
	this.AlterNate = function AlterNate(destDeviceID){	return this.oBarCtrl.AlterNate(destDeviceID);}
	//2.3.3.19	CallBack（回拨）	33
	this.CallBack = function CallBack(){	return this.oBarCtrl.CallBack();}
	//2.3.3.20	ReCall（重播）	34
	this.ReCall = function ReCall(){	return this.oBarCtrl.ReCall();}
	//2.3.3.21	SMMsg（短信）	34
	this.SMMsg = function SMMsg(DestAddress,ShortMessage){	return this.oBarCtrl.SMMsg(DestAddress,ShortMessage);}
	//2.3.3.22	ReleaseThirdOne（挂断第三方）	35
	this.ReleaseThirdOne = function ReleaseThirdOne(retrieveCall){	return this.oBarCtrl.ReleaseThirdOne(retrieveCall);}
	//2.3.3.23	BeginCollect（开始收号）	35
	this.BeginCollect = function BeginCollect(destAgentID,destDeviceID,playType,filename,min,max,end,cel,fto,ito){	return this.oBarCtrl.BeginCollect(destAgentID,destDeviceID,playType,filename,min,max,end,cel,fto,ito);}
	//2.3.3.24	StopCollect（结束收号）	36
	this.StopCollect = function StopCollect(destAgentID,destDeviceID){	return this.oBarCtrl.StopCollect(destAgentID,destDeviceID);}
	//2.3.3.25	ForceReset（复位）	36
	this.ForceReset = function ForceReset(){	return this.oBarCtrl.ForceReset();}
	//2.3.3.26	SendIMMessage（发送即时消息功能）	36
	this.SendIMMessage = function SendIMMessage(destTarget0,destTarget1,destTarget2,logicOperator,msgtype,message){	return this.oBarCtrl.SendIMMessage(destTarget0,destTarget1,destTarget2,logicOperator,msgtype,message);}
	
	//2.3.4	质检命令	37
	//2.3.4.1	ForeReleaseCall（强拆）	37
	this.ForeReleaseCall = function ForeReleaseCall(DestAgentID,type)	{		return this.oBarCtrl.ForeReleaseCall(DestAgentID,type);	}
	//2.3.4.2	Insert（强插）	37
	this.Insert = function Insert(DestAgentID,type,callID)	{		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this.oBarCtrl.Insert(DestAgentID,type,callID);	
	}
	//2.3.4.3	Listen（监听）	38
	this.Listen = function Listen(DestAgentID,type,callID)	{		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this.oBarCtrl.Listen(DestAgentID,type,callID);	
	}
	//2.3.4.4	Intercept（拦截）	38
	this.Intercept = function Intercept(DestAgentID,type,callID)	{		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this.oBarCtrl.Intercept(DestAgentID,type,callID);	
	}
	//2.3.4.5	Lock（锁定）	39
	this.Lock =  function Lock(DestAgentID)  {		return this.oBarCtrl.Lock(DestAgentID);	}
	//2.3.4.6	UnLock（解锁）	39
	this.UnLock =  function UnLock(DestAgentID)  {		return this.oBarCtrl.UnLock(DestAgentID);	}
	//2.3.4.7	ForceIdle（强制置闲）	39
	this.ForceIdle =  function ForceIdle(DestAgentID)  {		return this.oBarCtrl.ForceIdle(DestAgentID);	}
	//2.3.4.8	ForceBusy（强制置忙）	40
	this.ForceBusy =  function ForceBusy(DestAgentID)  {		return this.oBarCtrl.ForceBusy(DestAgentID);	}
	//2.3.4.9	ForceOut（强制签出）	40
	this.ForceOut =  function ForceOut(DestAgentID)  {		return this.oBarCtrl.ForceOut(DestAgentID);	}
	//2.3.4.10	Help（辅助）	40
	this.Help =  function Help(DestAgentID,type,callID)  {		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this.oBarCtrl.Help(DestAgentID,type,callID);	
	}

	//2.3.5	监控命令	41
	//2.3.5.1	InitialState（查询监控信息）	41
	this.InitialState =  function InitialState()  {		return this.oBarCtrl.InitialState();	}
	//2.3.5.2	AgentQuery（查询座席信息）	42
	this.AgentQuery =  function AgentQuery(monitorid,curpos)  {		return this.oBarCtrl.AgentQuery(monitorid,curpos);	}
	//2.3.5.3	TelQuery（电话信息查询）	43
	this.TelQuery =  function TelQuery(monitorid,curpos)  {		return this.oBarCtrl.TelQuery(monitorid,curpos);	}
	//2.3.5.4	IvrQuery（IVR信息查询）	43
	this.IvrQuery =  function IvrQuery(monitorid,curpos)  {		return this.oBarCtrl.IvrQuery(monitorid,curpos);	}
	//2.3.5.5	ServiceQuery（服务器信息查询）	44
	this.ServiceQuery =  function ServiceQuery(monitorid,curpos)  {		return this.oBarCtrl.ServiceQuery(monitorid,curpos);	}
	//2.3.5.6	TaskQuery（任务信息查询）	46
	this.TaskQuery =  function TaskQuery(monitorid,curpos)  {		return this.oBarCtrl.TaskQuery(monitorid,curpos);	}
	//2.3.5.7	CallReportQuery（呼叫统计信息查询）	47
	this.CallReportQuery =  function CallReportQuery(monitorid,curpos)  {		return this.oBarCtrl.CallReportQuery(monitorid,curpos);	}
	//2.3.5.8	GetTaskSummary（得到具体Task概述信息）	49
	this.GetTaskSummary =  function GetTaskSummary(monitorid,taskid)  {		return this.oBarCtrl.GetTaskSummary(monitorid,taskid);	}
	//2.3.5.9	QueryMonitorSumInfo（查询指定参数的统计信息）	23
	this.QueryMonitorSumInfo = function QueryMonitorSumInfo(cmdName,amdParam){	return this.oBarCtrl.QueryMonitorSumInfo(cmdName,amdParam);}
	//2.3.5.10	StartNotification（开始监控）	50
	this.StartNotification =  function StartNotification(id,type,flag)  {		return this.oBarCtrl.StartNotification(id,type,flag);	}
	//2.3.5.11	EndNotification（结束监控）	51
	this.EndNotification =  function EndNotification(id)  {		return this.oBarCtrl.EndNotification(id);	}


	//2.3.6	扩展命令	51
	//2.3.6.1	SendWeiboMsg（发送微博消息）	51
	this.SendWeiboMsg = function SendWeiboMsg(message ){	return this.oBarCtrl.SendWeiboMsg(message );}
	//2.3.6.2	UploadFileToMMS（上传微信文件）	52
	this.UploadFileToMMS = function UploadFileToMMS(fileName,userId,vccPublicId){	return this.oBarCtrl.UploadFileToMMS(fileName,userId,vccPublicId);}
	//2.3.6.3	DownFileFromMMS（下载微信文件）	52
	this.DownFileFromMMS = function DownFileFromMMS(url,userId,vccPublicId,sessionId,msgSeq){	return this.oBarCtrl.DownFileFromMMS(url,userId,vccPublicId,sessionId,msgSeq);}
	//2.3.6.4	SendWeChatMsg（发送微信消息）	53
	this.SendWeChatMsg = function SendWeChatMsg(sessionId,type,userId,vccPublicId,msgtype,content,tempURL,title,data,needMmcOpenData)
	{
	    if(application.oWechatManager != null)
	    {
	        application.oWechatManager.SaveSendMessage(sessionId,type,userId,vccPublicId,msgtype,content,tempURL,title,data,needMmcOpenData);
	    }	
	    return this.oBarCtrl.SendWeChatMsg(sessionId,type,userId,vccPublicId,msgtype,content,tempURL,title,data,needMmcOpenData);
	}
	//2.3.6.5	QueryWeChatData（查询微信信息）	54
	this.QueryWeChatData = function QueryWeChatData(type,userId,vccPublicId,sessionId,msgSeq,count,direction){	return this.oBarCtrl.QueryWeChatData(type,userId,vccPublicId,sessionId,msgSeq,count,direction);}
	//2.3.6.6	QueryWeChatHistory（查询微信历史信息）	55
	this.QueryWeChatHistory = function QueryWeChatHistory(Type,userId,vccPublicId,formTime,toTime,key,curpos){	return this.oBarCtrl.QueryWeChatHistory(Type,userId,vccPublicId,formTime,toTime,key,curpos);}
	//2.3.6.7	GetWeChatParam（得到微信用户信息）	56
	this.GetWeChatParam = function GetWeChatParam(userId){	return this.oBarCtrl.GetWeChatParam(userId);}

	//--------------------------------------------------------------------------------------------------
	// 事件重载,电话条对外事件
	//--------------------------------------------------------------------------------------------------
	
	//2.4.1	呼叫事件 3
	this.OnCallRing = function (CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,filename,networkInfo,queueTime,opAgentID){}
	this.AnswerCall = function (UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID){}
	this.OnCallEnd = function (CallID,SerialID,ServiceDirect,UserNo,BgnTime,EndTime,AgentAlertTime,UserAlertTime,FileName,Directory,DisconnectType,UserParam,TaskID,serverName,networkInfo){}
    
    //2.4.2	提示事件 19
	this.OnPrompt = function (code,description){}
	this.OnReportBtnStatus = function (btnIDS){}
	this.OnInitalSuccess = function (){}
	this.OnInitalFailure = function (code,description){}
	this.OnEventPrompt = function (eventIndex,eventParam){}
	this.OnAgentWorkReport = function (workStatus,description){}
	this.OnCallDataChanged = function (callData){}
	this.OnBarExit = function (code,description){}
	this.OnCallQueueQuery = function (QueueInfo){}
	this.OnQueryGroupAgentStatus = function (QueryInfo,type){}
	this.OnSystemMessage  = function (code,description){}
	this.OnRecvWeiboMsg = function (message){}
	this.OnIMMessage = function (msgType,message){}
	this.OnRecvWeChatMessage = function (sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp){}
	this.OnSendWeChatMsgReport = function (userId,sessionId,msgseq,code,des,timeStamp){}
	this.OnUploadFileToMMSReport = function (strFileName,status,strUrl){}
	this.OnDownloadFileToMMSReport = function (strUrl,status,strFileName,msgSeq){}
	this.OnWorkStaticInfoReport = function (staticInfo){}
	this.OnQueueReport = function (ServiceReportInfo){}
	this.OnQuerySPGroupList = function(type,ctiInfo){}
	this.OnAgentBusyReason = function(type,des){}
	this.OnAgentStatus = function (agentstatus){}
	this.OnAgentLogUpload = function(destAgent,urlType,uploadServer,fileName,code,des){}
	
	//2.4.3	监控事件  12
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

	this.OnMethodResponseEvent = function (cmdName,param){}

    this.SetInlineShowBar = function(oBar)
    {
		this.oBarShow = oBar;

	    if(this.oBarShow != null)
	        this.oBarCtrl.SerialBtn(this.oBarShow._btnIDs);
    }
    this.SetMonitorCtrl = function(oMonitor)
    {
		this.oMonitorCtrl = oMonitor;
    }
    //设置消息异步的
    this.SetAsynMethod = function (flag) {
        if (this.GetJVccBarType() != vccBarTypeHTML5)
            this.oBarCtrl.GetBarCtrl().SetAsysMode(flag);
    }
    //得到设置消息异步的
    this.GetAsynMethod = function () {
        if (this.GetJVccBarType() != vccBarTypeHTML5)
            return this.oBarCtrl.GetBarCtrl().GetAsysMode();
        return 1;//异步
    }

	//--------------------------------------------------------------------------------------------------
	// 辅助函数,JS函数
	//--------------------------------------------------------------------------------------------------

	this.GetBarCtrl = function(){ 
	        return this.oBarCtrl.GetBarCtrl();}
	this.GetJVccBarType = function(){ 
	        return this.oBarCtrl.GetBarType();}
	this.Display = function (flag){
	    if(this.oBarShow == null)
	        return ;
		if(flag == 1){
			this.oBarShow.style.display = "block";
		}else{
			this.oBarShow.style.display = "none";
		}				
	}

	this._createObject();
	
	return this;
}
