import { useEffect, lazy, Suspense } from "react"
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom"
import Lenis from "lenis"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LoadingSpinner from "./components/common/LoadingSpinner"

const Home = lazy(() => import("./pages/Home"))
const Tickets = lazy(() => import("./pages/Tickets"))
const Contact = lazy(() => import("./pages/Contact"))
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"))
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"))
const AdminTickets = lazy(() => import("./pages/Admin/AdminTickets"))
const AdminBookings = lazy(() => import("./pages/Admin/AdminBookings"))
const AdminMessages = lazy(() => import("./pages/Admin/AdminMessages"))
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings"))
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"))
const AdminAuditLogs = lazy(() => import("./pages/Admin/AdminAuditLogs"))
const AdminHero = lazy(() => import("./pages/Admin/AdminHero"))
const AdminContent = lazy(() => import("./pages/Admin/AdminContent"))
const AdminGallery = lazy(() => import("./pages/Admin/AdminGallery"))
const AdminAttractions = lazy(() => import("./pages/Admin/AdminAttractions"))
const AdminRestaurant = lazy(() => import("./pages/Admin/AdminRestaurant"))
const AdminSuites = lazy(() => import("./pages/Admin/AdminSuites"))
const AdminHalls = lazy(() => import("./pages/Admin/AdminHalls"))
const AdminOffers = lazy(() => import("./pages/Admin/AdminOffers"))
const AdminSEO = lazy(() => import("./pages/Admin/AdminSEO"))
import AdminLayout from "./components/Admin/AdminLayout"
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute"
const Privacy = lazy(() => import("./pages/Privacy"))
const Terms = lazy(() => import("./pages/Terms"))
const Refund = lazy(() => import("./pages/Refund"))
const FAQ = lazy(() => import("./pages/FAQ"))
const Gallery = lazy(() => import("./pages/Gallery"))
const NotFound = lazy(() => import("./pages/NotFound"))
import ScrollToTop from "./components/ScrollToTop"
import AuthProvider from "./context/AuthProvider"
import FloatingWhatsApp from "./components/FloatingWhatsApp"
import TopTicker from "./components/TopTicker"
import ErrorBoundary from "./components/common/ErrorBoundary"

function AdminPage({ children, roles }) {
  return (
    <ProtectedAdminRoute roles={roles}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedAdminRoute>
  )
}

function AppShell() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-black focus:outline-none">
        Skip to main content
      </a>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
      <Routes id="main-content">
        <Route path="/" element={<Home />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/refund-policy" element={<Refund />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminPage><AdminDashboard /></AdminPage>} />
        <Route path="/admin/hero" element={<AdminPage><AdminHero /></AdminPage>} />
        <Route path="/admin/tickets" element={<AdminPage><AdminTickets /></AdminPage>} />
        <Route path="/admin/bookings" element={<AdminPage><AdminBookings /></AdminPage>} />
        <Route path="/admin/messages" element={<AdminPage><AdminMessages /></AdminPage>} />
        <Route path="/admin/gallery" element={<AdminPage><AdminGallery /></AdminPage>} />
        <Route path="/admin/attractions" element={<AdminPage><AdminAttractions /></AdminPage>} />
        <Route path="/admin/restaurant" element={<AdminPage><AdminRestaurant /></AdminPage>} />
        <Route path="/admin/suites" element={<AdminPage><AdminSuites /></AdminPage>} />
        <Route path="/admin/halls" element={<AdminPage><AdminHalls /></AdminPage>} />
        <Route path="/admin/offers" element={<AdminPage roles={["super_admin", "admin"]}><AdminOffers /></AdminPage>} />
        <Route path="/admin/content" element={<AdminPage roles={["super_admin", "admin"]}><AdminContent /></AdminPage>} />
        <Route path="/admin/seo" element={<AdminPage roles={["super_admin", "admin"]}><AdminSEO /></AdminPage>} />
        <Route path="/admin/settings" element={<AdminPage roles={["super_admin", "admin"]}><AdminSettings /></AdminPage>} />
        <Route path="/admin/users" element={<AdminPage roles={["super_admin", "admin"]}><AdminUsers /></AdminPage>} />
        <Route path="/admin/audit-logs" element={<AdminPage roles={["super_admin", "admin"]}><AdminAuditLogs /></AdminPage>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      {!isAdminRoute && (
        <>
          <Footer />
          <FloatingWhatsApp />
        </>
      )}
    </>
  )
}

function App() {

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.2,
      gestureOrientation: "vertical",
      normalizeWheel: true,
      smoothWheel: true
    })

    window.__lenis = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return (
    <ErrorBoundary>
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
