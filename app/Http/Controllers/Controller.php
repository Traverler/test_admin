<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function responseJson($data = null, $code = 0, $message = '')
    {
        $ret = [
            'code' => $code,
            'message' => $message,
            'data' => $data,
        ];
        return response()->json($ret);
    }

}
