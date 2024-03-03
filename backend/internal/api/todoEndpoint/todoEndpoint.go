package todoEndpoint

import (
	"encoding/json"
	"log"      // logging messages to the console.
	"net/http" // Used for build HTTP servers and clients.
	apiUtils "project/internal/api/utils"
	"project/internal/database/sessionsDB"
	"project/internal/database/todoDB"

	_ "github.com/go-sql-driver/mysql"
)

func Init() {
	http.HandleFunc("/addTodo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiUtils.RequestWithSchemaChecksAndDataValidation[todoDB.AddToDoSchema](w, r, http.MethodPost)

		
		if err != nil {
			log.Println(err)
			return
		}
		
		sessionId, err := apiUtils.GetSessionCookie(r)

		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		userId, err := sessionsDB.GetUserId(sessionId);

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = todoDB.InsertToDo(schema, userId)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})

	http.HandleFunc("/editTodo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiUtils.RequestWithSchemaChecksAndDataValidation[todoDB.EditToDoSchema](w, r, http.MethodPost)
		
		if err != nil {
			log.Println(err)
			return
		}

		err = todoDB.EditToDo(schema)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})

	http.HandleFunc("/finishTodos", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiUtils.RequestWithSchemaChecksAndDataValidation[todoDB.UpdateToDosSchema](w, r, http.MethodPost)

		if err != nil {			
			log.Println(err)
			return
		}

		err = todoDB.MarkToDosAsDone(schema)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		w.WriteHeader(http.StatusOK)
	})

	http.HandleFunc("/deleteTodo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiUtils.RequestWithSchemaChecksAndDataValidation[todoDB.UpdateToDosSchema](w, r, http.MethodPost)

		if err != nil {
			log.Println(err)
			return
		}

		err = todoDB.DeleteToDo(schema)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			return
		}

		w.WriteHeader(http.StatusOK)
	})

	http.HandleFunc("/getTodos", func(w http.ResponseWriter, r *http.Request) {
		_, err := apiUtils.GetRequestChecksAndDataValidation(w, r)

		if err != nil {
			log.Println(err)
			return
		}

		sessionId, err := apiUtils.GetSessionCookie(r)

		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		userId, err := sessionsDB.GetUserId(sessionId);
		
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		todos, err := todoDB.GetAllToDos(userId)

		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todos)
	})

	http.HandleFunc("/getTodo", func(w http.ResponseWriter, r *http.Request) {
		schema, err := apiUtils.RequestWithSchemaChecksAndDataValidation[todoDB.UpdateToDoSchema](w, r, http.MethodPost)

		if err != nil {
			log.Println(err)
			return
		}

		todo, err := todoDB.GetToDo(schema)

		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todo)
	})
}
