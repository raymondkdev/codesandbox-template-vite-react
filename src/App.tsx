import { useEffect, useState } from "react";
import "./App.css";

type Todo = {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
};

type FilterCompleted = "All" | "Completed" | "Incompleted";

function App() {
  const [count, setCount] = useState(0);

  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");

  const [todos, setTodos] = useState<Todo[]>([]);

  const [filterTitle, setFilterTile] = useState("");
  const [filterCompleted, setFilterCompleted] =
    useState<FilterCompleted>("All");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => {
        console.log(err);
        setMsg(err.message);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  const handleDelete = (todoId: number) => {
    fetch("https://jsonplaceholder.typicode.com/todos/" + todoId, {
      method: "DELETE",
    })
      .then(() => {
        // TODO: refetch
        console.log("deleted successfully");
        setTodos(todos.filter((todo) => todo.id != todoId));
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.message);
      });
  };

  return (
    <div className="App">
      <div>
        Title:
        <input
          type="text"
          value={filterTitle}
          onChange={(e) => setFilterTile(e.target.value)}
        />
        Completed:
        {/* <input
          type="checkbox"
          checked={showOnlyCompleted}
          onChange={(e) => {
            setShowOnlyCompleted(e.target.checked);
          }}
        /> */}
        <select
          value={filterCompleted}
          onChange={(e) => setFilterCompleted(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Incompleted">Incompleted</option>
        </select>
      </div>
      {!loaded && <p>Loading...</p>}
      {msg && <p>{msg}</p>}
      {loaded && (
        <table className="todos">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>UserId</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos
              .filter((todo) => todo.title.indexOf(filterTitle) >= 0)
              .filter((todo) => {
                if (filterCompleted === "All") return true;
                if (filterCompleted === "Completed")
                  return todo.completed === true;
                if (filterCompleted === "Incompleted")
                  return todo.completed === false;
              })
              .map((todo) => {
                return (
                  <tr className="todo" key={`todo-${todo.id}}`}>
                    <td className="todo__id">{todo.id}</td>
                    <td className="todo__title">{todo.title}</td>
                    <td className="todo__userId">{todo.userId}</td>
                    <td className="todo__completed">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        disabled
                      />
                    </td>
                    <td>
                      <button onClick={() => handleDelete(todo.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
