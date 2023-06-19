import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';

export const Todos = () => {
  const todos = useLoaderData();

  return (
    <div className='todos'>
      <h2>Todos</h2>
      {todos.map((todo) => (
        <Link to={todo.id.toString()} key={todo.id}>
          <p>{todo.title}</p>
        </Link>
      ))}
    </div>
  );
};

export const todosLoader = async () => {
  console.log('todosLoader');
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/todos?_limit=5'
  );

  if (!res.ok) {
    throw Error('Could not fetch the data');
  }

  return res.json();
};
