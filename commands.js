function addTodo(array, todo) {
  return array.push(todo);
}

function deleteTodo(array, todo) {
  array.forEach(function(e, i) {
    if (e.includes(todo)) {
      return array.splice(i, 1)
    }
  });
}

function viewTodos(array) {
  var todos = "*Todos:*\n";
  for (var i = 0; i < array.length; i++) {
    todos += array[i] + "\n";
  }
  return todos;
}

module.exports = {
  add: addTodo,
  delete: deleteTodo,
  view: viewTodos
}