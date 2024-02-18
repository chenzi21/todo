package usersEndpoint

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	apiUtils "project/internal/api/utils"
	"project/internal/database/sessionsDB"
	"project/internal/database/usersDB"
)

func Init() {
	http.HandleFunc("/authenticateUser", func(w http.ResponseWriter, r *http.Request) {
		requestBody, err := apiUtils.RequestWithSchemaChecksAndDataValidation[usersDB.UserSchema](w, r, http.MethodPost)

		if err != nil {
			log.Println(err)
			return
		}

		var userId string

		userId, err = usersDB.AuthenticateUser(requestBody)

		if err != nil {
			log.Println(err)
			log.Println("auth:", err.Error())
			if (err.Error() == "user Doesn't Exist") {
				w.WriteHeader(http.StatusUnauthorized)
			} else {
				w.WriteHeader(http.StatusInternalServerError)
			}
			return
		}

		var sessionId string

		sessionId, err = sessionsDB.CreateSession(userId)

		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}		
		

		type ReturnData struct {
			SessionId string `json:"sessionId"`
		}

		var returnData = ReturnData{SessionId: sessionId}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(returnData)
	})

	http.HandleFunc("/createUser", func(w http.ResponseWriter, r *http.Request) {
		requestBody, err := apiUtils.RequestWithSchemaChecksAndDataValidation[usersDB.UserSchema](w, r, http.MethodPost)

		if err != nil {
			log.Println(err)
			return
		}

		var userId string

		userId, err = usersDB.CreateUser(requestBody)

		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		var sessionId string

		sessionId, err = sessionsDB.CreateSession(userId)

		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(usersDB.SessionId{SessionId: sessionId})
	})

	http.HandleFunc("/authenticateSession", func(w http.ResponseWriter, r *http.Request) {
		requestBody, err := apiUtils.RequestWithSchemaChecksAndDataValidation[usersDB.SessionId](w, r, http.MethodPost)

		if err != nil {
			log.Println(err)
			return
		}

		err = usersDB.AuthenticateSession(requestBody)

		if err != nil {
			log.Println(err)
			if err == sql.ErrNoRows {
				w.WriteHeader(http.StatusUnauthorized)
			} else {
				w.WriteHeader(http.StatusInternalServerError)
			}
			return
		}

		w.WriteHeader(http.StatusOK)
	})
}
