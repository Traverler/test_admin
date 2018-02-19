
<!-- User Info, Notifications and Menu Bar -->
<nav class="navbar user-info-navbar" role="navigation" style="height: 50px; margin-bottom:5px; ">



<!-- Left links for user info navbar -->
<ul class="user-info-menu left-links list-inline list-unstyled">

    <li class="hidden-sm hidden-xs" data-toggle="tooltip" data-placement="right" title="" data-original-title="收缩/展开左侧菜单" >
        <a href="#" data-toggle="sidebar" style="padding:0px; padding-left:15px; padding-top: 15px; " >
            <i class="fa fa-bars bigger-140"></i>
        </a>
    </li>
 

</ul> 

<!-- Right links for user info navbar -->
<ul class="user-info-menu right-links list-inline list-unstyled">

    <li class="dropdown user-profile">
        <a href="#" data-toggle="dropdown" style="padding: 15px; padding-left:20px; ">
            <img src="/images/user-1.png" alt="user-image" class="img-circle img-inline userpic-32" width="28" />
            <span style="font-weight:bold;">
                {{--{{ \App\Services\AuthService::getInstance()->getLoginUserName() }}--}}
                <i class="fa-angle-down"></i>
            </span>
        </a>
        
        <ul class="dropdown-menu user-profile-menu list-unstyled">
            
            <li class="last">
                <a id="logout">
                    <i class="fa-lock"></i>
                    退出
                </a>
            </li>
        </ul>
    </li>

</ul>

 
    
</nav>
 