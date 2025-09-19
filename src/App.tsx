import { memo } from 'react';
// import User from './components/User';
import Student from './components/Student';
// import Login from './components/Login';
// import Main from './components/Main';
// import Animate from './components/Animate';

const App = () => {
  return (
    <div className="App">
      {/* <User/> */}
      {/* <Main/> */}
      {/* <Animate/> */}
      {/* <Login/> */}
      <Student/>
    </div>
  );
};

export default memo(App);