<?php

if (! function_exists('formatMobile')) {
        
    function formatMobile($mobile){
        if(strlen($mobile) < 8){
            return substr($mobile, 0, 3).'****';
        }else{
            $mobile = str_replace('-', '', $mobile);
            $pattern = "/(\d{0,3})\d{4}(\d{4})/";
            $replacement = "\$1****\$2";
            return preg_replace($pattern, $replacement, $mobile);
        }
    }

}

if (! function_exists('formatIdNumber')) {

    function formatIdNumber($id_number){
        if(strlen($id_number) < 13){
            return '****';
        }else{
            return preg_replace('/(\d{3})(\d{11})(\d{3})([0-9]|X)/i', '$1***********$3$4', $id_number);
        }
    }

}


if (! function_exists('logDump')) {
    //打印并输出日志
    function logDump($content)
    {
        \Log::info($content);
        echo('['.date('Y-m-d H:i:s').'] '.print_r($content,true)."\n");
    }

}

if (! function_exists('dumpSql')) {
    function dumpSql()
    {

        \DB::listen(function($data)
        {
            dump($data->sql,$data->bindings);
        });

    }
}


if (! function_exists('millisecond')) {
    /**
     * @return float
     */
    function millisecond() {
        list($msec, $sec) = explode(" ", microtime());
        return ((float)$msec + (float)$sec);
    }
}

if (! function_exists('array_paginate')) {
    /**
     * @param $items
     * @param $total
     * @param int $page
     * @param int $perPage
     * @param string $path
     * @return $this|\Illuminate\Pagination\LengthAwarePaginator
     */
    function array_paginate($items,$total,$page=1,$perPage=20,$path='') {
        if(!empty($items)){
            $items = array_slice($items, ($page-1)*$perPage,$perPage);
        }
        $paged = new \Illuminate\Pagination\LengthAwarePaginator($items,$total,$perPage);
        $paged = $paged->setPath($path);

        return $paged;
    }
}

if (! function_exists('array_simple_paginate')) {

    /**
     * @param $items
     * @param int $has_more
     * @param int $page
     * @param int $perPage
     * @param string $path
     * @return $this|\Illuminate\Pagination\Paginator
     */
    function array_simple_paginate($items,$has_more=1,$page=1,$perPage=20,$path=''){

        if($has_more){
            $items += ['has_more'=>"1" ];
        }

        $paged = new \Illuminate\Pagination\Paginator($items,$perPage,$page);
        $paged = $paged->setPath($path);

        return $paged;
    }

}

if (!function_exists('isMobileFormat')) {
    //校验手机号是否符合规则
    function isMobileFormat($mobile)
    {
        if ( strlen($mobile) == 11 and  preg_match('/^1([0-9]{9})/',$mobile) ){
            return true;
        }
        return false;
    }
}
