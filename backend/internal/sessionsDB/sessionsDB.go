package sessionsDB

import (
	"database/sql"
	"errors"
	"project/internal/database"
)

func CreateSession(userId string) (string, error) {
	var sessionId string

	_, err := database.DBcon.Exec("INSERT INTO sessions(userId) VALUES(?)", userId)

	if err != nil {
		return "", err
	}

	err = database.DBcon.QueryRow("SELECT id FROM sessions WHERE userId = ? ORDER BY created_at DESC LIMIT 1;", userId).Scan(&sessionId)

	if err != nil {
		return "", err
	}

	return sessionId, nil
}

func GetUserId(sessionId string) (string, error) {
	var userId string
	err := database.DBcon.QueryRow("SELECT userId FROM sessions WHERE id = ? ORDER BY created_at DESC LIMIT 1;", sessionId).Scan(&userId)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", errors.New("user is not logged in")
		}
		return "", err
	}

	return userId, nil
}
