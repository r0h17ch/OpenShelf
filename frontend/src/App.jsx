import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import BorrowedBooks from './pages/BorrowedBooks';
import AllBorrowedBooks from './pages/AllBorrowedBooks';
import MyReservations from './pages/MyReservations';
import MyFines from './pages/MyFines';
import ManageFines from './pages/ManageFines';
import MyTransactions from './pages/MyTransactions';
import AllTransactions from './pages/AllTransactions';
import BookSuggestions from './pages/BookSuggestions';
import SuggestBook from './pages/SuggestBook';
import DonateBook from './pages/DonateBook';
import MyDonations from './pages/MyDonations';
import ManageDonations from './pages/ManageDonations';
import Reports from './pages/Reports';
import InventoryIssues from './pages/InventoryIssues';
import Users from './pages/Users';
import Profile from './pages/Profile';
import RagChatbot from './pages/RagChatbot';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="books/add" element={<ProtectedRoute adminOnly><AddBook /></ProtectedRoute>} />
        <Route path="borrowed" element={<BorrowedBooks />} />
        <Route path="borrowed/all" element={<ProtectedRoute adminOnly><AllBorrowedBooks /></ProtectedRoute>} />
        <Route path="reservations" element={<MyReservations />} />
        <Route path="fines" element={<MyFines />} />
        <Route path="fines/manage" element={<ProtectedRoute adminOnly><ManageFines /></ProtectedRoute>} />
        <Route path="transactions" element={<MyTransactions />} />
        <Route path="transactions/all" element={<ProtectedRoute adminOnly><AllTransactions /></ProtectedRoute>} />
        <Route path="suggestions" element={<BookSuggestions />} />
        <Route path="suggestions/new" element={<SuggestBook />} />
        <Route path="donations/new" element={<DonateBook />} />
        <Route path="donations" element={<MyDonations />} />
        <Route path="donations/manage" element={<ProtectedRoute adminOnly><ManageDonations /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute adminOnly><InventoryIssues /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
        <Route path="profile" element={<Profile />} />
        <Route path="rag" element={<RagChatbot />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
