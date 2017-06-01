



function addTodo(array, todo) {
  return array.push(todo);
}

function deleteTodo(array, todo) {
  array.forEach(function(e, i) {
    if (e.text.includes(todo)) {
      return array.splice(i, 1)
    }
  });
}

function completeTodo(array, todo, todoTS) {
  for (let t of array) {
    // Check to see if given the todo ID
    if (typeof todo === "number") {
      if (t.id === todo) {
        t.completed = true;
        t.doneTS = todoTS;
      }
    }
  }
}

function viewTodos(array) {
  var todos = "";
  for (let todo of array) {
    if (todo.completed) {
      todos += `${todo.id}\t[X]\t${todo.text}\t<!date^${todo.doneTS}^(completed: {date_pretty} @ {time}|May>)\n`;
    }
    else {
      todos += `${todo.id}\t[ ]\t${todo.text}\t<!date^${todo.time}^({date_pretty} @ {time}|May>)\n`;
    }
  }
  return todos;
}

module.exports = {
  add: addTodo,
  delete: deleteTodo,
  view: viewTodos,
  done: completeTodo
}