package server

import (
	"encoding/json"
	"fmt"
	"log"      // logging messages to the console.
	"net/http" // Used for build HTTP servers and clients.
	"project/internal/apiHelpers"
	"project/internal/todoDB"

	_ "github.com/go-sql-driver/mysql"
)

// Port we listen on.
const portNum string = ":8080"

func InitServer() {
	log.Println("Starting our simple http server.")

	http.HandleFunc("/addTodo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiHelpers.PostRequestGenericChecksAndDataValidation[todoDB.AddToDoSchema](w, r)

		if err != nil {
			return
		}

		err = todoDB.InsertToDo(schema)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}
	})

	http.HandleFunc("/finishTodos", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiHelpers.PostRequestGenericChecksAndDataValidation[todoDB.MarkToDosAsDoneSchema](w, r)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		err = todoDB.MarkToDosAsDone(schema)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		w.WriteHeader(http.StatusOK)
		return
	})

	http.HandleFunc("/deleteToDo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiHelpers.PostRequestGenericChecksAndDataValidation[todoDB.DeleteToDoSchema](w, r)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		err = todoDB.DeleteToDo(schema)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		w.WriteHeader(http.StatusOK)
		return
	})

	http.HandleFunc("/getTodos", func(w http.ResponseWriter, r *http.Request) {
		_, err := apiHelpers.GetRequestGenericChecksAndDataValidation(w, r)

		if err != nil {
			return
		}

		data, err := todoDB.GetAllToDos()

		if err != nil {
			log.Println(err)
			w.WriteHeader(500)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(data)
	})

	log.Println("Started on port", portNum)
	fmt.Println("To close connection CTRL+C :-)")

	// Spinning up the server.
	err := http.ListenAndServe(portNum, nil)
	if err != nil {
		log.Fatal(err)
	}
}
