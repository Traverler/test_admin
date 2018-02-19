<?php
namespace App\Services\Product\Repositories;

use App\Services\Product\Models\Sku;
use App\Services\Product\Models\SkuFile;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SkuRepository
 * @package App\Services\Product\Repositories
 */
class SkuRepository
{

    public static function getSkuSimplePaginate($page, $length)
    {
        $query = Sku::query();

        $has_more = $query->skip($page * $length)->take(1)->count(['id']);
        $list     = $query->skip(($page - 1) * $length)->take($length)->get(['*'])->toArray();

        return ['list' => $list, 'has_more' => $has_more];
    }

    public static function getSkuPaginate($page, $length)
    {
        $query = Sku::query();

        $count = $query->count(['id']);
        $list  = $query->skip(($page - 1) * $length)->take($length)->get(['*'])->toArray();

        return ['list' => $list, 'count' => $count];
    }

    public static function getSkuById($sku_id)
    {
        $item = Sku::query()->where('is_deleted', 0)->find($sku_id);

        return $item;
    }

    public static function getSkuFileBySkuId($sku_id)
    {
        $item = SkuFile::query()->where('sku_id', $sku_id)->where('is_deleted', 0)
            ->orderBy('sort')
            ->get();

        return $item;
    }

//name:新增测试名称
//attachments[0][file_path]:sku/图片_20180219.jpg
//attachments[0][origin_name]:图片.jpg
//attachments[0][sort]:0
//remark:新增测试备注
    public static function createSku($input){
        $attr = [
            'name' => array_get($input, 'name'),
            'remark' => array_get($input, 'remark'),
        ];

        $sku = Sku::query()->create($attr);

        $attachments = array_get($input, 'attachments');
        if($attachments){
            foreach($attachments as $attachment){
                $tmp = $attachment;
                $tmp['sku_id'] = $sku->id;
                SkuFile::query()->create($tmp);
            }
        }

        return $sku->id;
    }

    public static function updateSku($input){
        return 0;
    }
}