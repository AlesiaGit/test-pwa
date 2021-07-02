import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import strings from './strings';

import { AUTHORIZED, UNAUTHORIZED } from './constants';
const Home = () => {
  const location = useLocation();
  const history = useHistory();
  const [user, setUser] = useState(false);
  useEffect(() => {
    setUser(location?.state?.authorized);
  }, [location]);

  function logout() {
    setUser(null);
    history.replace({
      ...history.location,
      state: { authorized: false },
    });
  }

  console.log('user->', user);

  return (
    <div>
      <h2>{strings.hello(user ? AUTHORIZED : UNAUTHORIZED)}</h2>
      {!user ? (
        <Link to="/form">{strings.login}</Link>
      ) : (
        <button onClick={logout}>logout</button>
      )}
    </div>
  );
};

export default Home;
