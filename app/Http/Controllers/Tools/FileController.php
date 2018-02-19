<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use CURLFile;

class FileController extends Controller
{
    public function uploadFilePublic(Request $request)
    {
        $file = array_get($request, 'file', '');
        if (empty($file)) {
            return $this->responseJson([], -1, '文件不能为空');
        }

        $data = new \CURLFile($file->getPathname(), $file->getClientMimeType(), $file->getClientOriginalName());

        try {
            $result = $this->uploadObject($data);
            $result['origin_name'] = $file->getClientOriginalName();

            return $this->responseJson($result);
        } catch (\Exception $e) {
            return $this->responseJson([], '-1', '上传失败');
        }
    }

    private function uploadObject(CURLFile $file)
    {
        $pathInfo = pathinfo($file->getPostFilename());

        $pathFile = 'sku';
        $fileName =
            array_get($pathInfo, 'filename') . '_' .
            date('Ymd') . '.' . array_get($pathInfo, 'extension');

        $file_path = $pathFile . DIRECTORY_SEPARATOR . $fileName;
        if (file_exists($file_path)) {
            \Log::error('uploadObjectExist', [$file->getFilename(), '文件已经存在']);
            return ['file_path' => $file_path];
        } else {
            // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
            move_uploaded_file($file->getFilename(), $file_path);

            return ['file_path' => $file_path];
        }
    }
}