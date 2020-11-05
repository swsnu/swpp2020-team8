import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => {
  // TODO: userLogin redux state
  const user = false;

  return (
    <Route
      {...rest}
      render={(props) => {
        // eslint-disable-next-line no-unused-expressions
        user ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
};

export default PrivateRoute;
