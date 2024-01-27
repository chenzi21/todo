package main

import (
	"database/sql"
	"project/internal/database"
	"project/internal/server"
	"time"
	"log"
)

func main() {
	var dbErr error

	// init database
	database.DBcon, dbErr = sql.Open("mysql", "root:password@tcp(mysql:3306)/todo")
	if dbErr != nil {
		log.Panic(dbErr)
	}

	database.DBcon.SetConnMaxLifetime(time.Minute * 3)
	database.DBcon.SetMaxOpenConns(10)
	database.DBcon.SetMaxIdleConns(10)

	defer database.DBcon.Close()

	// init server routes
	server.InitServer()
}
