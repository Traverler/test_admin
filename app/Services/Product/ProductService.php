<?php
namespace App\Services\Product;

use App\Services\Product\Repositories\SkuRepository;

/**
 * Class ProductService
 * @package App\Services\Product
 */
class ProductService
{
    public function getSkuList($input){
        $page = array_get($input, 'page') ?: 1;
        $pageSize = array_get($input, 'pageSize') ?: 15;

        $data = SkuRepository::getSkuPaginate($page, $pageSize);
        $items = array_get($data, 'list');
        $total = array_get($data, 'count');
        $list = array_paginate($items, $total, $page, $pageSize);

        return [
            'list' => $list,
        ];
    }

    public function getSkuItem($sku_id, $input){

        $item = SkuRepository::getSkuById($sku_id);
        $attachments =  SkuRepository::getSkuFileBySkuId($sku_id);

        return [
            'item' => $item,
            'attachments' => $attachments,
        ];
    }

    public function saveSku($input){
        $sku_id = array_get($input, 'sku_id');
        if($sku_id){
            $result = SkuRepository::updateSku($input);
        } else {
            $result = SkuRepository::createSku($input);
        }

        return [
            'result' => $result,
        ];
    }
}