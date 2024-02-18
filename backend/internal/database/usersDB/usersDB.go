package usersDB

import (
	"database/sql"
	"errors"
	"log"
	"project/internal/database/dbVar"

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

type SessionId struct {
	SessionId any `json:"sessionId"`
}

func CreateUser(args UserSchema) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(args.Password), 8)

	if err != nil {
		log.Panic(err)
		return "", err
	}
	var UserId string

	_, err = dbVar.DBcon.Exec("INSERT INTO users(username, password) VALUES(?, ?)", args.Username, hashed)
	
	if err != nil {
		log.Panic(err)
		return "", err
	}

	err = dbVar.DBcon.QueryRow("SELECT id FROM users WHERE username = ?;", args.Username).Scan(&UserId)

	if err != nil {
		log.Panic(err)
		return "", err
	}

	return UserId, nil
}

func AuthenticateUser(args UserSchema) (string, error) {
	var UserId string
	var Password string

	err := dbVar.DBcon.QueryRow("SELECT id as userId, password FROM users WHERE username = ?;", args.Username).Scan(&UserId, &Password)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", errors.New("user Doesn't Exist");
		}
		return "", errors.New("internal Server Error");
	}

	return UserId, bcrypt.CompareHashAndPassword([]byte(Password), []byte(args.Password))
}

func AuthenticateSession(args SessionId) (error) {
	var isValid int
	err := dbVar.DBcon.QueryRow("SELECT 1 FROM sessions WHERE id = ?;", args.SessionId).Scan(&isValid)

	if err != nil {
		return err
	}

	return nil
}
