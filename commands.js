function addTodo(array, todo) {
  return array.push(todo);
}
function deleteTodo(array, todo) {
  var index = array.indexOf(todo);
  if (index >= 0) {
    return array.splice(index, 1);
  }
  else {
    return "Unable to find item!"
  }
}

module.exports = {
  add: addTodo,
  delete: deleteTodo
}