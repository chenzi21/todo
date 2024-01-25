package main

import (
	"database/sql"
	"project/internal/database"
	"project/internal/server"
	"time"
)

func main() {
	var dbErr error

	database.DBcon, dbErr = sql.Open("mysql", "chenzadik:password@tcp(localhost:3306)/todo")
	if dbErr != nil {
		panic(dbErr)
	}

	database.DBcon.SetConnMaxLifetime(time.Minute * 3)
	database.DBcon.SetMaxOpenConns(10)
	database.DBcon.SetMaxIdleConns(10)

	defer database.DBcon.Close()

	server.InitServer()
}
