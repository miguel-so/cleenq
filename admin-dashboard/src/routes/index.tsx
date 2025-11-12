import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { Path } from "../lib/constants/path.constants";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Home from "../pages/Home";
import PricingManagement from "../pages/pricing/PricingManagement";
import MembershipsPage from "../pages/memberships/MembershipsPage";
import RewardsPage from "../pages/rewards/RewardsPage";
import BookingsPage from "../pages/bookings/BookingsPage";
import CustomersPage from "../pages/customers/CustomersPage";
import CleanersPage from "../pages/cleaners/CleanersPage";
import PrivateRoute from "./PrivateRoute";
import UnauthorizedRoute from "./UnauthorizedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<UnauthorizedRoute />}>
          <Route path={Path.LOGIN} element={<Login />} />
          <Route path={Path.REGISTER} element={<Register />} />
          <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route
            path={`${Path.RESET_PASSWORD}/:email`}
            element={<ResetPassword />}
          />
          <Route
            path={`${Path.VERIFY_EMAIL}/:token`}
            element={<VerifyEmail />}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={Path.DASHBOARD} element={<Home />} />
          <Route path={Path.PRICING} element={<PricingManagement />} />
          <Route path={Path.MEMBERSHIPS} element={<MembershipsPage />} />
          <Route path={Path.REWARDS} element={<RewardsPage />} />
          <Route path={Path.BOOKINGS} element={<BookingsPage />} />
          <Route path={Path.CUSTOMERS} element={<CustomersPage />} />
          <Route path={Path.CLEANERS} element={<CleanersPage />} />
        </Route>

        <Route path="*" element={<Navigate to={Path.DASHBOARD} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
