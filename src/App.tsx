import { useEffect } from "react";
import { requestForToken, onMessageListener, initializeMessaging } from "./firebase";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Pilots from "./pages/Pilots";
import PriceList from "./pages/PriceList";
import News from "./pages/News";
import ListOrders from "./pages/admin/ListOrder";
import DispatcherDashboard from "./pages/dispatcher/DispatcherDashboard";
import PilotDashboard from "./pages/pilot/PilotDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AccountManagement from "./pages/admin/AccountManagement";
import BookService from "./pages/customer/BookService";
import OrderDetail from "./pages/admin/OrderDetail";
import ServiceGuide from "./pages/customer/ServiceGuide";
import DispatcherOrderDetail from "./pages/dispatcher/OrderDetail";
import DispatchSchedule from "./pages/admin/DispatchSchedule";
import StatisticsDashboard from "./pages/dispatcher/StatisticsDashboard";
import TaskDetail from "./pages/pilot/TaskDetail";
import NotFound from "./pages/NotFound";
import CreatePilotPlan from "./pages/admin/CreateDailyPlan";
import EditPilotPlan from "./pages/admin/EditDailyPlan";
import InvestorRelations from "./pages/InvestorRelations";
import TenderInfo from "./pages/TenderInfor";
import EmailConfig from "./pages/admin/Email";
import PlanDetail from "./pages/PlanDetail";
import Forbiden from "./pages/Forbidden";
import ProtectedRoute from "./components/ProtectedRouter";
import UserProfile from "./pages/admin/UserDetail";
import News1 from "@/pages/customer/News1";
import News2 from "@/pages/customer/News2";
import News3 from "@/pages/customer/News3";
import News4 from "@/pages/customer/News4";
import News5 from "@/pages/customer/News5";
import News6 from "@/pages/customer/News6";
import { authService } from "./services/api";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const init = async () => {
      try {
        await initializeMessaging();

        // Chỉ nhận message, không đăng ký lại
        onMessageListener()
          .then((payload) => {
            console.log("Received foreground message:", payload);
            // Có thể toast thông báo ở đây nếu muốn
          })
          .catch((err) => console.error("onMessage error:", err));
      } catch (error) {
        console.error("Lỗi FCM:", error);
      }
    };

    init();
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/about" element={<About />} />
                <Route path="/pilots" element={<Pilots />} />
                <Route path="/price" element={<PriceList />} />
                <Route path="/news" element={<News />} />
                <Route path="/offer" element={<TenderInfo />} />
                <Route path="/shareholders" element={<InvestorRelations />} />
                <Route path="/customer/book-service" element={<BookService />} />
                <Route path="/plan-detail/:planId" element={<PlanDetail />} />
                <Route path="/403" element={<Forbiden />} />
                <Route path="/news/news-1" element={<News1 />} />
                <Route path="/news/news-2" element={<News2 />} />
                <Route path="/news/news-3" element={<News3 />} />
                <Route path="/news/news-4" element={<News4 />} />
                <Route path="/news/news-5" element={<News5 />} />
                <Route path="/news/news-6" element={<News6 />} />

                <Route
                  path="/pilot/dashboard"
                  element={
                    <ProtectedRoute requiredRoles={["PILOT"]}>
                      <PilotDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pilot/task/:taskId"
                  element={
                    <ProtectedRoute requiredRoles={["PILOT"]}>
                      <TaskDetail />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/accounts"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <AccountManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/user-detail"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/schedule"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <DispatchSchedule />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/pilot-plans/create"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <CreatePilotPlan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pilot-plans/:planId"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <EditPilotPlan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/config"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <EmailConfig />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/pilot-plans/create"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <CreatePilotPlan />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
};

export default App;
