import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";

// Main Page
import CarouselPage from "./pages/main/CarouselPage";
import SellingPointsPage from "./pages/main/SellingPointsPage";
import WhyVisitPage from "./pages/main/WhyVisitPage";
import AttractionsPage from "./pages/main/AttractionsPage";
import PricingPage from "./pages/main/PricingPage";

// Profile
import ProfilePage from "./pages/ProfilePage";

// Destinations
import DestinationsPage from "./pages/DestinationsPage";

// Heritage
import HeritagePage from "./pages/HeritagePage";

// Gallery
import GalleryImagesPage from "./pages/gallery/GalleryImagesPage";

// Regulations
import RegulationsPage from "./pages/regulations/RegulationsPage";

// Facilities
import FacilitiesPage from "./pages/FacilitiesPage";

// Contact
import ContactPage from "./pages/ContactPage";

// Analytics & Users
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import NewsPage from "./pages/news/NewsPage";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ErrorBoundary>
                    <DashboardHome />
                  </ErrorBoundary>
                }
              />

              {/* Main Page Routes */}
              <Route
                path="main/carousel"
                element={
                  <ErrorBoundary>
                    <CarouselPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="main/selling-points"
                element={
                  <ErrorBoundary>
                    <SellingPointsPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="main/why-visit"
                element={
                  <ErrorBoundary>
                    <WhyVisitPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="main/attractions"
                element={
                  <ErrorBoundary>
                    <AttractionsPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="main/pricing"
                element={
                  <ErrorBoundary>
                    <PricingPage />
                  </ErrorBoundary>
                }
              />

              {/* Profile */}
              <Route
                path="profile"
                element={
                  <ErrorBoundary>
                    <ProfilePage />
                  </ErrorBoundary>
                }
              />

              {/* Destinations */}
              <Route
                path="destinations"
                element={
                  <ErrorBoundary>
                    <DestinationsPage />
                  </ErrorBoundary>
                }
              />

              {/* Heritage */}
              <Route
                path="heritage"
                element={
                  <ErrorBoundary>
                    <HeritagePage />
                  </ErrorBoundary>
                }
              />

              {/* Gallery */}
              <Route
                path="gallery"
                element={
                  <ErrorBoundary>
                    <GalleryImagesPage />
                  </ErrorBoundary>
                }
              />

              {/* Regulations */}
              <Route
                path="regulations/"
                element={
                  <ErrorBoundary>
                    <RegulationsPage />
                  </ErrorBoundary>
                }
              />

              {/* Facilities */}
              <Route
                path="facilities"
                element={
                  <ErrorBoundary>
                    <FacilitiesPage />
                  </ErrorBoundary>
                }
              />

              {/* News */}
              <Route
                path="news"
                element={
                  <ErrorBoundary>
                    <NewsPage />
                  </ErrorBoundary>
                }
              />

              {/* Contact */}
              <Route
                path="contact"
                element={
                  <ErrorBoundary>
                    <ContactPage />
                  </ErrorBoundary>
                }
              />

              {/* Analytics & Users */}
              <Route
                path="analytics"
                element={
                  <ErrorBoundary>
                    <AnalyticsPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="users"
                element={
                  <ErrorBoundary>
                    <UsersPage />
                  </ErrorBoundary>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
