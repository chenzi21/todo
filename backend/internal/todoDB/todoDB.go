package todoDB

import (
	"log"
	"project/internal/database"
	"strings"
)

type AddToDoSchema struct {
	Todo    string `json:"todo"`
	Date    string `json:"date"`
	Urgency int    `json:"urgency"`
}

type ToDo struct {
	AddToDoSchema
	Id      int `json:"id"`
	Is_done int `json:"is_done"`
}

type MarkToDosAsDoneSchema struct {
	Ids []uint8 `json:"ids"`
}

type DeleteToDoSchema struct {
	Id uint8 `json:"id"`
}

func InsertToDo(args AddToDoSchema) error {
	_, err := database.DBcon.Exec("INSERT INTO todos(todo, date, urgency) VALUES(?, ?, ?);", args.Todo, args.Date, args.Urgency)
	if err != nil {
		log.Panic(err)
		return err
	}

	return nil
}

func DeleteToDo(args DeleteToDoSchema) error {
	_, err := database.DBcon.Exec("UPDATE todos SET is_deleted=1 WHERE id=?", args.Id)
	if err != nil {
		log.Panic(err)
		return err
	}

	return nil
}

func MarkToDosAsDone(args MarkToDosAsDoneSchema) error {
	values := make([]interface{}, len(args.Ids))

	for i := range args.Ids {
		values[i] = args.Ids[i]
	}

	_, err := database.DBcon.Exec("UPDATE todos SET is_done=1 WHERE id IN (?"+strings.Repeat(",?", len(args.Ids)-1)+");", values...)
	if err != nil {
		log.Panic(err)
		return err
	}

	return nil
}

func GetAllToDos() ([]ToDo, error) {
	rows, err := database.DBcon.Query("SELECT id, todo, DATE_FORMAT(date, '%M %d %Y %H:%i') as date, urgency, is_done FROM todos WHERE is_deleted = 0 ORDER BY id DESC")

	if err != nil {
		log.Panic(err)
	}

	defer rows.Close()

	// An album slice to hold data from returned rows.
	var todos []ToDo

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var todo ToDo
		if err := rows.Scan(&todo.Id, &todo.Todo, &todo.Date, &todo.Urgency, &todo.Is_done); err != nil {
			return todos, err
		}
		todos = append(todos, todo)
	}

	if err = rows.Err(); err != nil {
		return todos, err
	}

	return todos, nil
}
