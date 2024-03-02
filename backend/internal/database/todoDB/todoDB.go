package todoDB

import (
	"log"
	"project/internal/database/dbVar"
	"strings"
)

type AddToDoSchema struct {
	Todo    string `json:"todo"`
	Date    string `json:"date"`
	Urgency string    `json:"urgency"`
}

type EditToDoSchema struct {
	AddToDoSchema
	TodoId uint8 `json:"todoId"`
}

type ToDo struct {
	AddToDoSchema
	Id      int `json:"id"`
	Is_done int `json:"is_done"`
}

type MarkToDosAsDoneSchema struct {
	Ids []uint8 `json:"ids"`
}

type UpdateToDoSchema struct {
	Id uint8 `json:"id"`
}

func InsertToDo(args AddToDoSchema, userId string) error {
	_, err := dbVar.DBcon.Exec("INSERT INTO todos(userId, todo, date, urgency) VALUES(?, ?, ?, ?);", userId, args.Todo, args.Date, args.Urgency)

	if err != nil {
		log.Panic(err)
		return err
	}

	return nil
}

func EditToDo(args EditToDoSchema) error {
	_, err := dbVar.DBcon.Exec("UPDATE todos SET todo = ?, date = ?, urgency = ? WHERE id = ?;", args.Todo, args.Date, args.Urgency, args.TodoId)

	if err != nil {
		log.Panic(err)
		return err
	}

	return nil
}

func DeleteToDo(args UpdateToDoSchema) error {
	_, err := dbVar.DBcon.Exec("UPDATE todos SET is_deleted=1 WHERE id=?", args.Id)
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

	_, err := dbVar.DBcon.Exec("UPDATE todos SET is_done=1 WHERE id IN (?"+strings.Repeat(",?", len(args.Ids)-1)+");", values...)
	if err != nil {
		log.Panic(err)
		return err
	}

	return nil
}

func GetAllToDos(userId string) ([]ToDo, error) {
	rows, err := dbVar.DBcon.Query("SELECT id, todo, DATE_FORMAT(date, '%Y-%m-%dT%TZ') as date, urgency, is_done FROM todos WHERE userId = ? AND is_deleted = 0 ORDER BY id DESC;", userId)

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

func GetToDo(todoId uint8) (ToDo, error) {

	var todo ToDo

	err := dbVar.DBcon.QueryRow("SELECT id, todo, DATE_FORMAT(date, '%Y-%m-%dT%TZ') as date, urgency, is_done FROM todos WHERE id = ? AND is_deleted = 0 ORDER BY id DESC;", todoId).Scan(&todo.Id, &todo.Todo, &todo.Date, &todo.Urgency, &todo.Is_done)

	if err != nil {
		log.Panic(err)
	}

	return todo, err
}
