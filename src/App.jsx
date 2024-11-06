import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Board from '~/pages/Board/_id';
import NotFound from '~/pages/404/NotFound';
import Auth from '~/pages/Auth/Auth';
import AccountVerification from '~/pages/Auth/AccountVerification';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

// Sẽ la nhưng router chỉ cho đăng nhập khi đã login
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />;
  return <Outlet />; // sẽ chạy vào route child trong route này
};

function App() {
  const currentUser = useSelector(selectCurrentUser);

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
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>
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
