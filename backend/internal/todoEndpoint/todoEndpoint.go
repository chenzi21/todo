package todoEndpoint

import (
	"encoding/json"
	"log"      // logging messages to the console.
	"net/http" // Used for build HTTP servers and clients.
	"project/internal/apiHelpers"
	"project/internal/todoDB"

	_ "github.com/go-sql-driver/mysql"
)

func Init() {
	http.HandleFunc("/addTodo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiHelpers.RequestWithSchemaChecksAndDataValidation[todoDB.AddToDoSchema](w, r, http.MethodPost)

		if err != nil {
			return
		}

		err = todoDB.InsertToDo(schema)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})

	http.HandleFunc("/finishTodos", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiHelpers.RequestWithSchemaChecksAndDataValidation[todoDB.MarkToDosAsDoneSchema](w, r, http.MethodPost)

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

	http.HandleFunc("/deleteTodo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiHelpers.RequestWithSchemaChecksAndDataValidation[todoDB.DeleteToDoSchema](w, r, http.MethodPost)

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
		_, err := apiHelpers.GetRequestChecksAndDataValidation(w, r)

		if err != nil {
			log.Println(err)
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
}
