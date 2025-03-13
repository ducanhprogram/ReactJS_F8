import { useState } from "react";
import "./TodoList.css";
const TodoList = () => {
    const [todos, setTodos] = useState("");
    const [todoList, setTodoList] = useState(
        JSON.parse(localStorage.getItem("tasks")) || []
    );
    const [indexTodo, setIndexTodo] = useState(null);

    const saveLocalStorage = (tasks) => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const ChangeValue = (e) => {
        e.preventDefault();

        const todoValue = e.target.value.replace(/\s+/g, " ");
        setTodos(todoValue);
    };

    const AddTodoList = (e) => {
        e.preventDefault();
        if (todos.length > 250) {
            alert("Todo should not be more than 250 characters");
            return;
        }

        if (HandleDuplicateTodo(todos).length > 0) {
            alert("Todo already exists");
            return;
        }

        if (!todos || todos.trim() === "") {
            return;
        }

        if (indexTodo === null) {
            const newTodoList = [
                ...todoList,
                { text: todos, completed: false },
            ];

            setTodoList(newTodoList);
            saveLocalStorage(newTodoList);
        } else {
            const newTodoList = [...todoList];
            newTodoList[indexTodo].text = todos;
            setTodoList(newTodoList);
            saveLocalStorage(newTodoList);
            setIndexTodo(null);
            alert("Todo updated successfully");
        }

        setTodos("");
    };

    const HandleDuplicateTodo = (todo) => {
        const newTodoList = [...todoList];
        const todoDup = newTodoList.filter((todoDup) => {
            if (
                todoDup.text.toUpperCase().trim() === todo.toUpperCase().trim()
            ) {
                return true;
            }
            return false;
        });
        return todoDup;
    };

    const HandleUpdateTodo = (todo) => {
        setTodos(todo.text);
    };

    const HandleCancelTodo = (e) => {
        e.preventDefault();
        setTodos("");
        setIndexTodo(null);
    };

    const HandleDoneTodo = (index) => {
        const completedTodos = [...todoList];
        completedTodos[index].completed = !completedTodos[index].completed;
        setTodoList(completedTodos);
        saveLocalStorage(completedTodos);
    };

    const HandleDeleteTodo = (index) => {
        const newTodoList = [...todoList];
        const todo = newTodoList[index];
        const isConfirm = confirm(
            `Are you sure you want to delete todo "${todo.text}"?`
        );

        if (isConfirm) {
            newTodoList.splice(index, 1);
            setTodoList(newTodoList);
            saveLocalStorage(newTodoList);
            setTodos("");
            setIndexTodo(null);
            return;
        }
    };

    return (
        <main>
            <h1 className="page-heading">Create your Todo-List</h1>
            <form action="" className="todo-form">
                <input
                    value={todos}
                    type="text"
                    id="todo-input"
                    className="input"
                    placeholder="What are your tasks for today?"
                    spellCheck="false"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            AddTodoList(e);
                        }
                    }}
                    onChange={ChangeValue}
                />
                <button
                    onClick={AddTodoList}
                    id="submit"
                    className="submit-btn"
                    onMouseDown={AddTodoList}
                >
                    {indexTodo === null ? "Add" : "Save"}
                </button>
                {indexTodo !== null ? (
                    <button className="btn-cancel" onClick={HandleCancelTodo}>
                        Cancel
                    </button>
                ) : (
                    ""
                )}
            </form>

            <ul id="task-list" className="task-list">
                {todoList.map((todo, index) => {
                    return (
                        <li
                            key={index}
                            className={`task-item ${
                                todo.completed ? "completed" : ""
                            }`}
                        >
                            <span className="task-title">{todo.text}</span>
                            <div className="task-action">
                                <button
                                    onClick={() => {
                                        setIndexTodo(index);
                                        HandleUpdateTodo(todo);
                                    }}
                                    className="task-btn edit"
                                >
                                    Edit
                                </button>
                                <button
                                    className={`task-btn done ${
                                        todo.completed ? "completed" : ""
                                    }`}
                                    onClick={() => {
                                        HandleDoneTodo(index);
                                    }}
                                >
                                    {todo.completed
                                        ? "MARK AS UNDONE"
                                        : "MARK AS DONE"}
                                </button>
                                <button
                                    className="task-btn delete"
                                    onClick={() => {
                                        HandleDeleteTodo(index);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
};

export default TodoList;
