package usersEndpoint

import (
	"encoding/json"
	"log"
	"net/http"
	"project/internal/api/utils"
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
			w.WriteHeader(http.StatusUnauthorized)
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

		type ReturnData struct {
			SessionId string `json:"sessionId"`
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(ReturnData{SessionId: sessionId})
	})
}
