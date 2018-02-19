<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Product\ProductService;

class SkuController extends Controller
{
    private $service;

    public function __construct()
    {
        $this->service = new ProductService();
    }

    public function index(Request $request)
    {
        $data = $this->service->getSkuList($request->all());

        return view('product.sku_list', $data);
    }

    public function item($id, Request $request)
    {
        $data = $this->service->getSkuItem($id, $request->all());

        return view('product.sku_item', $data);
    }

    public function create(Request $request)
    {
        return view('product.sku_save', ['item' => []]);
    }

    public function save(Request $request)
    {
        $data = $this->service->saveSku($request->all());

        return redirect()->back();
    }







}