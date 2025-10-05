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
import AttractionsPage from "./pages/main/AttractionsPage";
import PricingPage from "./pages/main/PricingPage";

// Profile
import ProfilePage from "./pages/ProfilePage";

// Destinations
import DestinationsPage from "./pages/DestinationsPage";

// Gallery
import GalleryImagesPage from "./pages/gallery/GalleryImagesPage";
import GalleryCategoriesPage from "./pages/gallery/GalleryCategoriesPage";

// Regulations
import RegulationsPage from "./pages/regulations/RegulationsPage";
import RegulationCategoriesPage from "./pages/regulations/RegulationCategoriesPage";

// Facilities
import FacilitiesPage from "./pages/FacilitiesPage";

// News
import NewsArticlesPage from "./pages/news/NewsArticlesPage";
import NewsCategoriesPage from "./pages/news/NewsCategoriesPage";

// Contact
import ContactMessagesPage from "./pages/contact/ContactMessagesPage";
import ContactBookingsPage from "./pages/contact/ContactBookingsPage";

// Analytics & Users
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";

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

              {/* Gallery */}
              <Route
                path="gallery/images"
                element={
                  <ErrorBoundary>
                    <GalleryImagesPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="gallery/categories"
                element={
                  <ErrorBoundary>
                    <GalleryCategoriesPage />
                  </ErrorBoundary>
                }
              />

              {/* Regulations */}
              <Route
                path="regulations/list"
                element={
                  <ErrorBoundary>
                    <RegulationsPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="regulations/categories"
                element={
                  <ErrorBoundary>
                    <RegulationCategoriesPage />
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
                path="news/articles"
                element={
                  <ErrorBoundary>
                    <NewsArticlesPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="news/categories"
                element={
                  <ErrorBoundary>
                    <NewsCategoriesPage />
                  </ErrorBoundary>
                }
              />

              {/* Contact */}
              <Route
                path="contact/messages"
                element={
                  <ErrorBoundary>
                    <ContactMessagesPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="contact/bookings"
                element={
                  <ErrorBoundary>
                    <ContactBookingsPage />
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
