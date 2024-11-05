import { Routes, Route, Navigate } from 'react-router-dom';
import Board from '~/pages/Board/_id';
import NotFound from '~/pages/404/NotFound';
import Auth from '~/pages/Auth/Auth';
import AccountVerification from '~/pages/Auth/AccountVerification';

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route
        path="/"
        element={
          // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / không còn nằm trong history của browser
          <Navigate to="/boards/671ef64bf8baf6e103a25c5c" replace={true} />
        }
      />
      <Route path="/boards/:boardId" element={<Board />} />
      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      {/* 404 not found page  */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
