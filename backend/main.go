package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"project/internal/api/todoEndpoint"
	"project/internal/api/usersEndpoint"
	"project/internal/database/dbVar"
	"time"
)

// Port we listen on.
const portNum string = ":8080"

func loadEnv() (string, string, string) {
	var db_user_file = os.Getenv("DB_USER_FILE")
	var db_database_file = os.Getenv("DB_DATABASE_FILE")
	var db_password_file = os.Getenv("DB_PASSWORD_FILE")

	var db_database []byte
	var db_password []byte

	db_user, err := os.ReadFile(db_user_file)

	if err != nil {
		log.Panic("Error reading db user file")
	}

	db_database, err = os.ReadFile(db_database_file)

	if err != nil {
		log.Panic("Error reading db database file")
	}

	db_password, err = os.ReadFile(db_password_file)

	if err != nil {
		log.Panic("Error reading db password file")
	}

	return string(db_user), string(db_password), string(db_database)
}

func generateConnString() string {
	user, password, database := loadEnv()
	return fmt.Sprintf("%s:%s@tcp(mysql:3306)/%s", user, password, database)
}

func main() {
	var dbErr error

	connString := generateConnString()

	// init database
	dbVar.DBcon, dbErr = sql.Open("mysql", connString)
	if dbErr != nil {
		log.Panic(dbErr)
	}

	dbVar.DBcon.SetConnMaxLifetime(time.Minute * 3)
	dbVar.DBcon.SetMaxOpenConns(10)
	dbVar.DBcon.SetMaxIdleConns(10)

	defer dbVar.DBcon.Close()

	log.Println("Starting our simple http server.")

	todoEndpoint.Init()
	usersEndpoint.Init()

	// Spinning up the server.
	err := http.ListenAndServe(portNum, nil)
	if err != nil {
		log.Fatal(err)
	}
}
