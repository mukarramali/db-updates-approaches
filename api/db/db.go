package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

var dbConnection *sql.DB

func initializeDbConnection() {
	connStr := "user=postgres dbname=transactions sslmode=disable password=postgres"
	_db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	dbConnection = _db
}

func init() {
	initializeDbConnection()
}

func DB() *sql.DB {
	if dbConnection == nil {
		initializeDbConnection()
	}
	return dbConnection
}
