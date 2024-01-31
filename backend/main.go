package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"project/internal/database"
	"project/internal/todoEndpoint"
	"project/internal/usersEndpoint"
	"time"
)

// Port we listen on.
const portNum string = ":8080"

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

	log.Println("Starting our simple http server.")

	log.Println("Started on port", portNum)
	fmt.Println("To close connection CTRL+C :-)")

	todoEndpoint.Init()
	usersEndpoint.Init()

	// Spinning up the server.
	err := http.ListenAndServe(portNum, nil)
	if err != nil {
		log.Fatal(err)
	}
}
