<?php
//    dd(\App\Services\AuthService::getInstance()->getQCAuthList());
// dd(can( "/task/finished/customerService") );
?>
<div class="sidebar-menu toggle-others fixed" style=" width:150px;">

    <div class="sidebar-menu-inner">

        <header class="logo-env" style="padding: 20px 20px;">

            <!-- logo -->
            <div class="logo">
                <a href="/"  class="logo-expanded" style="font-size: 24px;color:#fff;">
                    商家中心
                </a>

                <a href="/" class="logo-collapsed" style="font-size: 14px;color:#fff;">

                </a>
            </div>


        </header>



        <ul id="main-menu" class="main-menu multiple-expanded auto-inherit-active-class" style="padding-left:10px;padding-right: 5px;">
            <!-- add class "multiple-expanded" to allow multiple submenus to open -->
            <!-- class "auto-inherit-active-class" will automatically add "active" class for parent elements who are marked already with class "active" -->

            <li class=" has-sub">
                <a href="#" >
                    <i class="fa fa-institution"></i>
                    <span class="title">商品管理</span>
                </a>
                <ul>

                    <li  class="opened" >

                        <a class="documentTabLink" href="javascript:void(0);" tab-url="/sku/index" tab-id="sku_index" tab-title="商品列表">
                            <span class="title">商品列表</span>
                        </a>

                        <a class="documentTabLink" href="javascript:void(0);" tab-url="/sku/create" tab-id="sku_create" tab-title="商品新增">
                            <span class="title">商品新增</span>
                        </a>

                    </li>
                </ul>
            </li>



        </ul>

    </div>

</div>

<script>
    $(function(){
    })
</script>
