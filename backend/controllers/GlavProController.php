<?php
namespace backend\controllers;

use yii\rest\ActiveController;
use yii\filters\Cors;
use yii\web\Response;

class GlavproController extends ActiveController
{
    public $modelClass = 'backend\models\GlavPro';

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // Добавляем CORS фильтр
        $behaviors['corsFilter'] = [
            'class' => Cors::class,
            'cors' => [
                'Origin' => ['http://localhost:3000'], // Разрешаем любые домены
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешенные методы
                'Access-Control-Request-Headers' => ['*'], // Разрешенные заголовки
                'Access-Control-Allow-Credentials' => false, // Разрешаем передачу куки
                'Access-Control-Max-Age' => 3600, // Время кеширования предзапроса
            ],
        ];

        return $behaviors;
    }

    public function beforeAction($action)
    {
        if (parent::beforeAction($action)) {
            // Устанавливаем заголовки CORS
            \Yii::$app->response->headers->add('Access-Control-Allow-Origin', '*');
            \Yii::$app->response->headers->add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            \Yii::$app->response->headers->add('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            return true;
        }
        return false;
    }
}