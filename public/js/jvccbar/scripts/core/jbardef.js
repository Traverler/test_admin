//  *****************************************************************************
//  文 件 名：	jbardef.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   数据类型定义
//  说    明：
//		   数据类型定义
//  修改说明：
// *****************************************************************************

////////////////////////////////////////////////////////////////////////////
// event public interface
//2.4.1	呼叫事件 3
var eventOnCallRing   = 0;
var eventOnAnswerCall = 1;
var eventOnCallEnd    = 2;
//2.4.2	提示事件 18
var eventOnPrompt                  = 3;
var eventOnReportBtnStatus         = 4;
var eventOnInitalSuccess           = 5;
var eventOnInitalFailure           = 6;
var eventOnEventPrompt             = 7;
var eventOnAgentWorkReport         = 8;
var eventOnCallDataChanged         = 9;
var eventOnBarExit                 = 10;
var eventOnCallQueueQuery          = 11;
var eventOnQueryGroupAgentStatus   = 12;
var eventOnSystemMessage           = 13;
var eventOnRecvWeiboMsg            = 14;
var eventOnIMMessage               = 15;
var eventOnRecvWeChatMessage       = 16;
var eventOnSendWeChatMsgReport     = 17;
var eventOnUploadFileToMMSReport   = 18;
var eventOnDownloadFileToMMSReport = 19;
var eventOnServiceStaticReport     = 20;
var eventOnAQueryCTIInfoReport     = 21;
var eventOnAgentBusyReasonReport   = 22;
var eventOnAgentLogUploadReport    = 23;

//2.4.3	监控事件 13
var eventOnAgentReport             = eventOnAgentLogUploadReport+1;
var eventOnTelReport               = eventOnAgentReport + 1;
var eventOnServiceReport           = eventOnAgentReport + 2;
var eventOnIvrReport               = eventOnAgentReport + 3;
var eventOnTaskReport              = eventOnAgentReport + 4;
var eventOnOutboundReport          = eventOnAgentReport + 5;
var eventOnCallReportInfo          = eventOnAgentReport + 6;
var eventOnQueueReport             = eventOnAgentReport + 7;
var eventOnQueryMonitorSumReport   = eventOnAgentReport + 8;
var eventOnWallServiceReport       = eventOnAgentReport + 9;
var eventOnWallQueueReport         = eventOnAgentReport + 10;
var eventOnWorkStaticInfoReport    = eventOnAgentReport + 11;
var eventOnAgentStaticReport       = eventOnAgentReport + 13;
//websocket
var eventOnWebsocketSocket         = 60;

var lg_zhcn    = "zh-cn";
var lg_english = "en-us";
var g_JsVersion = "1.0.0.12";


function GetLanguageItem(lg,zhcnValue,zhus)
{
    return (lg==lg_zhcn)?zhcnValue:zhus;
}
//--------------------------------------------------------------------------------------------------
// 错误描述
//--------------------------------------------------------------------------------------------------

function CErrorItem()
{
    this.code = 0;
	this.description = ""; //chinesa
	this.level = 0;
	this.engshDes = "";
	
	return this;
}

function CHtmlBarControl(language)
{
    this._language = language;
	this._arrErrorInfo = new Array(); 	

	this._loadErrorInfo = function()
	{	
        this._addItem(2100,0,"消息未定义","message not defined");
        this._addItem(2101,2,"消息参数异常","parameter error");
        this._addItem(2102,2,"消息发送失败","send message failure");
        this._addItem(2110,2,"座席不存在","agent not exist");
        this._addItem(2111,2,"座席暂停使用","agent unusefull temporary");
        this._addItem(2112,2,"座席密码验证错误","wrong agent password");
        this._addItem(2113,2,"座席密码未生效","agent password uneffective");
        this._addItem(2114,2,"座席密码已过期","agent password overdue");
        this._addItem(2115,2,"座席已锁定","agent locked");
        this._addItem(2116,2,"座席时间戳不匹配","agent timestamp mismatching");
        this._addItem(2117,2,"座席登录分机和绑定分机不匹配","agent'd device is mismatching with binded device");
        this._addItem(2118,2,"座席所用分机已被其他座席登录","agent'd device is used by other");
        this._addItem(2119,1,"座席已登录","agent signined");
        this._addItem(2120,2,"座席不允许被替代","agent can't be replaced");
        this._addItem(2121,1,"座席未登录","agent have not been signined");
        this._addItem(2122,1,"座席忙","agent busy");
        this._addItem(2123,2,"登录失败：此座席已在其他地方登录且正在通话中","signing failuer:this agent is called by other");
        this._addItem(2124,2,"登录失败：此座席已在其他地方登录且后处理中","signing failuer:this agent is wrapup by other");
        this._addItem(2125,1,"座席未空闲","agent not idle");
        this._addItem(2126,1,"座席未接通","agent not connected");
        this._addItem(2130,2,"对方座席不存在","opponent agent not exist");
        this._addItem(2131,2,"对方座席暂停使用","opponent agent unusefull temporary");
        this._addItem(2132,2,"对方座席已锁定","opponent agent locked");
        this._addItem(2133,2,"对方座席分机未设置","opponent agent's device not set");
        this._addItem(2134,1,"对方座席未登录","opponent agent not signin");
        this._addItem(2135,1,"对方座席忙","opponent agent busy");
        this._addItem(2136,1,"对方座席通话中","opponent agent calling");
        this._addItem(2137,1,"对方座席后处理中","opponent agent wrapup");
        this._addItem(2138,1,"对方座席空闲","opponent agent idle");
        this._addItem(2140,1,"分机通话中","agent'device calling");
        this._addItem(2141,2,"分机未设置IVR服务","device not set IVR service");
        this._addItem(2143,2,"坐席登录达到最大限制","signined agent count over limit");
        this._addItem(2143,2,"座席登录质检服务验证错误","monitor login failure for wrong password");
   //   <web 3000-3999>  
        //websocket_guard_connecting 3000   
        //websocket_guard_connected
        this._addItem(3001,2,"连接电话条卫士成功","connect CINGurad success");
        //websocket_guard_colsed
        //websocket_guard_remoteserver_disconnected
        this._addItem(3003,2,"电话条卫士连接失败,请确认是否启动!","connect CINGurad failure,be sure CINGuard startup");
        //websocket_connecting                        = 3100;
        //websocket_connected
        //websocket_colsed
        //websocket_remoteserver_disconnected

	// <!--CINNGCCA :4000-4299-->";
        this._addItem(4000,2,"创建A服务类失败","create AClass failuer");
        this._addItem(4001,2,"CTI Interface服务器地址错误或者没有启动!","CTI Interface address wrong or CTI Interface server not startup"); 
        this._addItem(4002,2,"CTI服务器地址错误或者没有启动!","CTI server address wrong or CTI server server not startup");  
        this._addItem(4003,2,"CTI Interface的Initail方法调用失败!","invoke Initial failure in CTI Interface");
        this._addItem(4004,2,"登录CTI服务器失败,确认CTI可用或者配置信息是否成功!","login cti failure,be sure cti server is ok and congfiguration is right");
        this._addItem(4005,2,"由于网络原因座席和CTI断开，请不要挂机，3S后重新连接!","agent disconnect temporary cause by network,it will be reconnect after ten seconds");
        this._addItem(4006,2,"座席正在重连...","agent reconnecting ...");                  
        this._addItem(4007,0,"重连成功,座席就绪可以重新使用!","reconnected success! the agent is already ok");    
        this._addItem(4008,2,"由于某些原因网络中断,导致座席和CTI服务器断开,请和管理员联系!","agent is signout from cti cause of network,please get help for administrator");        	 
        this._addItem(4009,2,"心跳检测到CTI中座席已经退出!","agent is signout by heartbeat checking");        	 
        this._addItem(4010,1,"座席设置的phoneType类型和服务器端设置不一样，使用服务器端设置的电话类型","phoneType mismatch with server's,using server's setting");        	 

	// <!--CINVCCBAR :4300-4599-->";
        this._addItem(4300,2,"A接口控件没有注册或者路径不对!","CINNGCCA not register"); 
        this._addItem(4301,2,"PA控件没有注册或者路径不对!","PA not register"); 
        this._addItem(4302,2,"M控件没有注册或者路径不对!","CINMonitor not register");  
        this._addItem(4303,2,"CTI服务器断开,请与管理员联系!","disconnect from cti,please get help for administrator"); 
        this._addItem(4305,2,"本座席被其他终端所替代!","agent replaced by other");    
        this._addItem(4309,2,"电话注册失败!","sipphone register failure");    
        this._addItem(4310,2,"请初始化控件!","please initial the ocx");    
        this._addItem(4311,2,"命令不可用,无法执行!","method disanble,can't execute");    
        this._addItem(4312,2,"目标号码不能为空!","target number can't be empty");    
        this._addItem(4313,2,"目标号码不合法!","target number unvalidated ");    
        this._addItem(4314,2,"目标号码不能超过64位","target number can't be more then 64 character");    
	 

        this._addItem(4360,0,"正在注册Sip电话...","sipphone regsitering...");   
        this._addItem(4361,0,"电话注册成功!","sipphone regsitered success");         
        this._addItem(4362,0,"正在检测到座席卡...","checking agent card...");     
        this._addItem(4363,2,"没有检测到座席卡!","ageng card not checked");     
        this._addItem(4364,1,"设置ftp服务器信息失败!","ftp config wrong");   
    
        this._addItem(4400,0,"签入CTI服务器成功!","agent signin success");    
        this._addItem(4401,2,"签入CTI服务器失败!","agent signin failure");       
        this._addItem(4402,0,"签出CTI服务器成功!","agent signout success");         
        this._addItem(4403,0,"签出CTI服务器失败!","agent signout failure");                     
        this._addItem(4404,2,"座席被强制迁出!","agent force signout");                    
        this._addItem(4405,2,"座席已经被锁定,请联系质检席解锁!","agent locked,please contact with monitor agent");    
        this._addItem(4407,1,"正在向CTI服务器注册...","sigining to cti server...");            
        this._addItem(4408,0,"正在向Monitor服务器注册...","logining to monitor server...");        
        this._addItem(4409,0,"注册Monitor成功!","login monitor server success");            
        this._addItem(4410,0,"电话条初始化成功!","cinvccbar initial success");    
        this._addItem(4411,2,"电话条初始化失败!","cinvccbar initial failure");   
        this._addItem(4412,0,"正在向备用CTI服务器注册...","sigining to backup cti server...");   
        this._addItem(4413,0,"正在向备用Monitor服务器注册...","logining to backup monitor server...");  
        this._addItem(4414,2,"座席子状态报告","agent substatus report");   	 
	 
    
        this._addItem(4450,0,"座席已经被拦截!","agent intercepted");       
        this._addItem(4451,1,"没有要被接回的对象!","have no retrieved line");      
        this._addItem(4452,1,"外呼必须忙碌下才能进行!","makeout must be use in busy");      
        this._addItem(4453,1,"没有通话,不能转移...","can't transfer out of call");                  
        this._addItem(4454,1,"只有两个人通话的时候才能执行此命令...","can only be executed in tow line");    
        this._addItem(4455,1,"普通状态下,二次拨号码必须在0-15之间!","the code must be from 0 to 15 in senddtmf");    
        this._addItem(4456,1,"用户已挂机","user have been out of call");                  
        this._addItem(4457,1,"请快点服务,所有坐席都忙碌!","hurry! all agents are busy"); 
        this._addItem(4458,1,"Mute必须通话下才能进行!","mute can only be execute in call");  	 
        this._addItem(4459,2,"客户端接通yealink话机的失败!","yealink phone pickup failure in client type");  	
        this._addItem(4460,1,"会议或者咨询时不能挂断主控座席!","the master agent can't be disconnect in conferece or consult scene");  	 		 
	 
	 
	// <!--CINMonitor :4600-4699-->";
        this._addItem(4600,2,"创建M服务类失败!","create M class failure");                       
        this._addItem(4601,2,"Monitor Interface的Initail方法调用失败!","Initail to Monitor Interface failure"); 
        this._addItem(4602,2,"Monitor服务器地址错误或者没有启动!","Monitor server  can't be use");            
        this._addItem(4603,2,"Monitor Interface服务器地址错误或者没有启动!","Monitor Interface  can't be use");
        this._addItem(4604,2,"登录(Login)Monitor服务器失败!","login in Monitor server failure");               
        this._addItem(4605,2,"由于某些原因网络中断,导致Monitor和服务器断开,5后重新连接....","agent disconnect from monitor server by network,will reconnect in 5 minutes");                                       
        this._addItem(4606,2,"Monitor正在和服务器重新连接....","monitor is reconnecting...");    
        this._addItem(4607,2,"由于某些原因网络中断,导致Monitor和服务器断开,请和管理员联系!","monitor can't be connected with server by network,please contact to admin"); 
        this._addItem(4608,2,"Monitor重连成功,监控座席就绪可以重新使用!","monitor reconnect success,it works"); 
	}
    this._addItem =function(code,level,des,edes)
    {
        var item = new CErrorItem();
        item.code = code;
        item.level = level;
        item.description = des;
        item.engshDes = edes;
        this._arrErrorInfo.push(item);
    }
	this.GetErrorItemDes = function(code)
	{ 
	    for (var i = 0;i<this._arrErrorInfo.length;i++) 
	    {
		    if(this._arrErrorInfo[i].code == code)
		    {
		        if(this._language == lg_zhcn)
			        return this._arrErrorInfo[i].description;
			    else
			        return this._arrErrorInfo[i].engshDes;
			}
	    }
	    return "";
	}
	
    this._loadErrorInfo();

	return this;
}
