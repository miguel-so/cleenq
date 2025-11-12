import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import { Path } from "../lib/constants/path.constants";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import PricingManagement from "../pages/pricing/PricingManagement";
import MembershipsPage from "../pages/memberships/MembershipsPage";
import RewardsPage from "../pages/rewards/RewardsPage";
import BookingsPage from "../pages/bookings/BookingsPage";
import CustomersPage from "../pages/customers/CustomersPage";
import CleanersPage from "../pages/cleaners/CleanersPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={Path.LOGIN} element={<Login />} />

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
