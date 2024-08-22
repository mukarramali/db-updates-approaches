package connections

import (
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var dsn string = "host=localhost user=postgres password=postgres dbname=transactions port=6432 sslmode=disable"

var client *gorm.DB
var pool *gorm.ConnPool

func initializeDBClient() {
	_client, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{Logger: logger.Default.LogMode(logger.Error), PrepareStmt: false})
	if err != nil {
		panic(err)
	}
	db, _ := _client.DB()
	db.SetMaxIdleConns(200)
	db.SetMaxOpenConns(500)
	db.SetConnMaxLifetime(time.Hour)

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
