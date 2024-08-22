package db

import (
	"time"
	"transactions/connections/db/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var dsn string = "host=localhost user=postgres password=postgres dbname=transactions port=5432 sslmode=disable TimeZone=Asia/Shanghai"

var client *gorm.DB

func initializeDBClient() {
	_client, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default, PrepareStmt: false})
	if err != nil {
		panic(err)
	}
	db, _ := _client.DB()
	db.SetMaxIdleConns(20)
	db.SetMaxOpenConns(500)
	db.SetConnMaxLifetime(time.Hour)

	// AutoMigrate will create the tables for the models
	_client.AutoMigrate(&models.Product{})

	client = _client
}

func init() {
	initializeDBClient()
}

func DBClient() *gorm.DB {
	if client == nil {
		initializeDBClient()
	}
	return client
}
