package usersDB

import (
	"database/sql"
	"errors"
	"log"
	"project/internal/database"

	"golang.org/x/crypto/bcrypt"
)

type UserSchema struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserAuthenticationReturnValue struct {
	Password string
	UserId string
}

func CreateUser(args UserSchema) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(args.Password), 8)

	if err != nil {
		log.Panic(err)
		return "", err
	}

	_, err = database.DBcon.Exec("INSERT INTO users(username, password) VALUES(?, ?);", args.Username, hashed)
	if err != nil {
		log.Panic(err)
		return "", err
	}

	var userId string

	err = database.DBcon.QueryRow("SELECT LAST_INSERT_ID();").Scan(&userId)

	return userId, nil
}

func AuthenticateUser(args UserSchema) (string, error) {
	var returnValue UserAuthenticationReturnValue

	log.Printf("username: %v", args.Username)

	row := database.DBcon.QueryRow("SELECT id as userId FROM users WHERE username = $1", args.Username)

	log.Printf("row: %v", *row)


	err := row.Scan(&returnValue.UserId);
	
	if err == sql.ErrNoRows {
		return "", errors.New("User Doesn't Exist");
	}
	
	if err != nil {
		return "", errors.New("Internal Server Error");
	}

	return returnValue.UserId, bcrypt.CompareHashAndPassword([]byte(returnValue.Password), []byte(args.Password))
}
