import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageQuestions from '../pages/admin/ManageQuestions';
import ManageCategories from '../pages/admin/ManageCategories'; // NEW
import ManageUsers from '../pages/admin/ManageUsers'; // NEW
import Questions from '../pages/Questions';
import QuestionPage from '../pages/QuestionPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:id" element={<QuestionPage />} />

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'superadmin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="questions" element={<ManageQuestions />} />
                    <Route path="categories" element={<ManageCategories />} />
                    <Route path="users" element={<ManageUsers />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;