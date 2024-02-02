package usersEndpoint

import (
	"encoding/json"
	"log"
	"net/http"
	"project/internal/apiHelpers"
	"project/internal/sessionsDB"
	"project/internal/usersDB"
)

func Init() {
	http.HandleFunc("/authenticateUser", func(w http.ResponseWriter, r *http.Request) {
		requestBody, err := apiHelpers.RequestWithSchemaChecksAndDataValidation[usersDB.UserSchema](w, r, http.MethodPost)

		if err != nil {
			log.Println(err)
			return
		}

		var userId string

		userId, err = usersDB.AuthenticateUser(requestBody)

		if err != nil {
			log.Println(err)
			w.WriteHeader(403)
			return
		}

		var sessionId string

		sessionId, err = sessionsDB.CreateSession(userId)

		if err != nil {
			log.Println(err)
			w.WriteHeader(500)
			return
		}		
		

		type ReturnData struct {
			SessionId string `json:"sessionId"`
		}

		var returnData = ReturnData{SessionId: sessionId}

		log.Printf("data: %v", returnData)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(returnData)
	})

	http.HandleFunc("/createUser", func(w http.ResponseWriter, r *http.Request) {
		requestBody, err := apiHelpers.RequestWithSchemaChecksAndDataValidation[usersDB.UserSchema](w, r, http.MethodPost)

		if err != nil {
			log.Println(err)
			return
		}

		var userId string

		userId, err = usersDB.CreateUser(requestBody)

		if err != nil {
			log.Println(err)
			w.WriteHeader(500)
			return
		}

		var sessionId string

		sessionId, err = sessionsDB.CreateSession(userId)

		if err != nil {
			log.Println(err)
			w.WriteHeader(500)
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
