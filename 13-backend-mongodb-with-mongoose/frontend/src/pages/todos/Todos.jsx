import React from 'react';
import { useLoaderData, NavLink } from 'react-router-dom';
import styles from '../../components/Navbar.module.css';

export const Todos = () => {
  const todos = useLoaderData();

  return (
    <div className='todos'>
      <h2>Todos</h2>
      {todos.map((todo) => (
        <NavLink
          className={({ isActive }) => `nav-link ${isActive && 'active'}`}
          to={todo.id.toString()}
          key={todo.id}
        >
          <p>{todo.title}</p>
        </NavLink>
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
