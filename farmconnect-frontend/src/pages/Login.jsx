import React from 'react';

const Login = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {/* TODO: Add login form */}
      <form>
        <input className="w-full mb-2 p-2 border rounded" type="email" placeholder="Email" />
        <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="Password" />
        <button className="w-full bg-green-700 text-white py-2 rounded mt-2">Login</button>
      </form>
    </div>
  );
};

export default Login; 