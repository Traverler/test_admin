<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/dashboard', function () {
    return view('dashboard');
});
//todo 进入商家中心内部,身份认证
Route::group(['middleware' => []], function () {

    Route::group(['prefix' => 'sku', 'namespace' => 'Product'], function () {

        Route::get('index', ['uses' => 'SkuController@index', 'as' => 'sku.index']);
        Route::get('item/{id}', ['uses' => 'SkuController@item', 'as' => 'sku.item']);
        Route::get('create', ['uses' => 'SkuController@create', 'as' => 'sku.create']);
        Route::post('save', ['uses' => 'SkuController@save', 'as' => 'sku.save']);
    });


});

Route::group(['middleware' => [], 'namespace' => 'Tools'], function () {
    Route::post('/file/public', 'FileController@uploadFilePublic')->name('tools.uploadFilePublic');
});