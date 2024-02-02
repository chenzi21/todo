package sessionsDB

import (
	"log"
	"project/internal/database"
)

func CreateSession(userId string) (string, error) {
	var sessionId string

	_, err := database.DBcon.Exec("INSERT INTO sessions(userId) VALUES(?)", userId)

	if err != nil {
		log.Println(err.Error())
		return "", err
	}

	err = database.DBcon.QueryRow("SELECT id FROM sessions WHERE userId = ? ORDER BY created_at DESC LIMIT 1;", userId).Scan(&sessionId)

	if err != nil {
		log.Println(err.Error())
		return "", err
	}

	return sessionId, nil
}
