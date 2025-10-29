import RoleBasedRoute from "@components/RoleBasedRoute";

// Layouts
import LayoutDefault from "@layouts/LayoutDefault";
import LayoutAdmin from "@layouts/LayoutAdmin";
import LayoutModerator from "@layouts/LayoutModerator";
import LayoutManager from "@layouts/LayoutManager";
import LayoutInspector from "@layouts/LayoutInspector";
import LayoutStaff from "../layouts/LayoutStaff";
// import ConsignmentCreate from "@pages/Member/ConsignmentCreate/ConsignmentCreate";

// Admin pages
import AdminDashboard from "@pages/Admin/AdminDashboard";
import ManageAccounts from "@pages/Admin/ManageAccounts";
import CategoryManagement from "@pages/Admin/CategoryManagement/CategoryManagement";
import BrandManagement from "@pages/Admin/BrandManagement/BrandManagement";
import ModelManagement from "@pages/Admin/ModelManagement/ModelManagement";
import ProductVehicleManagement from "@pages/Admin/ProductVehicleManagement/ProductVehicleManagement";
import ProductBatteryManagement from "@pages/Admin/ProductBatteryManagement/ProductBatteryManagement";

// Staff pages
import StaffDashboard from "@pages/Staff/StaffDashboard";
// import ManageListingPage from "@pages/Staff/ManageListing";
// import ManageListingDetail from "@pages/Staff/ManageListingDetail";
import StaffConsignmentsManagement from "@/pages/Staff/StaffConsignmentsManagement/StaffConsignmentsManagement";
import StaffConsignmentsConsider from "@/pages/Staff/StaffConsignmentsConsider/StaffConsignmentsConsider";
import StaffInspectionSchedule from "@/pages/Staff/StaffInspectionSchedule/StaffInspectionSchedule";

// Moderator pages
import ModeratorDashboard from "@pages/Moderator/ModeratorDashboard";
import ModeratorApprovalListings from "@pages/Moderator/ApprovalListings";
import ModeratorHistoryPage from "@pages/Moderator/ModeratorHistory";

// Manager pages
import ManagerDashboard from "@pages/Manager/ManagerDashboard";
import ManagerConsigmentsAssign from "@/pages/Manager/ManagerConsignmentsAssign/ManagerConsignmentsAssign";
import ManagerConsigmentsManagement from "@/pages/Manager/ManagerConsignmentsManagement/ManagerConsignmentsManagement";

// Inspector pages
import InspectorDashboard from "@pages/Inspector/InspectorDashboard";

// Common (member)
import HomeWrapper from "@pages/Member/HomeWrapper/HomeWrapper";
import InfoUser from "@pages/Member/InfoUser";
import Battery from "@pages/Member/Battery";
import Vehicle from "@pages/Member/Vehicle";
import GoogleCallback from "@pages/Auth/GoogleCallback";
import ProductDetail from "@pages/Member/ProductDetail/ProductDetail";
import ListingCreate from "@pages/Member/ListingCreate";
import SearchResults from "@pages/Member/SearchResults";
import ListingEdit from "@pages/Member/ListingEdit";
import ManagerListing from "@pages/Member/ManagerListing";
import MyFavoritesPage from "@pages/Member/MyFavoritesPage/MyFavoritesPage";
import VnpReturnPage from "@pages/Payment";
import MemberConsignment from "@/pages/Member/MemberConsignment/MemberConsignment";
import ConsignmentForm from "@/pages/Member/ConsignmentCreate/ConsignmentCreate";

// Errors
import Error403 from "@pages/Errors/Error403";
import Error404 from "@pages/Errors/Error404";
import InspectionAvailabilityPage from "../pages/Member/MemberConsignment/InpectionAvailabilityPage/InspectionAvailabilityPage";
import StaffInspectingManagement from "../pages/Staff/StaffInspectingsManagement/StaffInspectingManagement";
import StaffAgreementManagement from "../pages/Staff/StaffAgreementManagement/StaffAgreementManagement";

export const routes = () => [
  {
    path: "/",
    element: <LayoutDefault />,
    breadcrumb: "Trang chủ",
    children: [
      { index: true, element: <HomeWrapper /> },
      { path: "vehicle", element: <Vehicle /> },
      { path: "battery", element: <Battery /> },
      { path: "search-results", element: <SearchResults /> },
      { path: "detail/:id", element: <ProductDetail /> },
      { path: "auth/google/callback", element: <GoogleCallback /> },

      {
        element: <RoleBasedRoute allowedRoles={["member", "staff", "admin"]} />,
        children: [
          { path: "info-user", element: <InfoUser /> },
          { path: "listing/new", element: <ListingCreate /> },
          { path: "listing/edit/:id", element: <ListingEdit /> },
          { path: "my-ads", element: <ManagerListing /> },
          { path: "payment/vnpay/call_back", element: <VnpReturnPage /> },
          {
            path: "consignment",
            breadcrumb: "Ký gửi",
            children: [
              {
                index: true,
                element: <MemberConsignment />,
              },
              {
                path: "new",
                element: <ConsignmentForm mode="create" />,
                breadcrumb: "Tạo yêu cầu ký gửi",
              },
              {
                path: "edit/:id",
                element: <ConsignmentForm mode="update" />,
                breadcrumb: "Chỉnh sửa yêu cầu ký gửi",
              },
              {
                path: "availability",
                element: <InspectionAvailabilityPage />
              },
              
            ],
          },
          { path: "my-favorites", element: <MyFavoritesPage /> },
          { path: "payment/vnpay/call_back", element: <VnpReturnPage /> },
          { path: "staff", element: <StaffDashboard /> },
        ],
      },
    ],
  },

  // MODERATOR
  {
    path: "/",
    element: <LayoutModerator />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["moderator"]} />,
        children: [
          { path: "moderator", element: <ModeratorDashboard /> },
          {
            path: "moderator/approval",
            element: <ModeratorApprovalListings />,
          },
          {
            path: "moderator/history",
            element: <ModeratorHistoryPage />,
          },
        ],
      },
    ],
  },

  //Staff
  {
    path: "/staff/*", // ✅ tách scope riêng
    element: <LayoutStaff />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["staff"]} />,
        children: [
          { index: true, element: <StaffDashboard /> }, // /staff
          {
            path: "consignment/management",
            element: <StaffConsignmentsManagement />,
          },
          {
            path: "consignment/consider",
            element: <StaffConsignmentsConsider />,
          },
          {
            path: "consignment/inspection-schedule",
            element: <StaffInspectionSchedule />,
          },
          {
            path: "consignment/inspecting",
            element: <StaffInspectingManagement/>
          },{
            path: "consignment/agreement",
            element: <StaffAgreementManagement/>
          },
        ],
      },
    ],
  },

  // MANAGER
  {
    path: "/",
    element: <LayoutManager />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["manager"]} />,
        children: [
          { path: "manager", element: <ManagerDashboard /> },
          {
            path: "manager/consignment/assign",
            element: <ManagerConsigmentsAssign />,
          },
          {
            path: "manager/consignment/management",
            element: <ManagerConsigmentsManagement />,
          },
        ],
      },
    ],
  },

  // INSPECTOR
  {
    path: "/",
    element: <LayoutInspector />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["inspector"]} />,
        children: [{ path: "inspector", element: <InspectorDashboard /> }],
      },
    ],
  },

  // ADMIN
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "admin", element: <AdminDashboard /> },
          {
            path: "admin/product/category",
            element: <CategoryManagement />,
          },
          {
            path: "admin/product/brand",
            element: <BrandManagement />,
          },
          {
            path: "admin/product/model",
            element: <ModelManagement />,
          },
          {
            path: "admin/product/vehicle",
            element: <ProductVehicleManagement />,
          },
          {
            path: "admin/product/battery",
            element: <ProductBatteryManagement />,
          },
          { path: "admin/accounts", element: <ManageAccounts /> },
        ],
      },
    ],
  },
  { path: "/403", element: <Error403 /> },
  { path: "*", element: <Error404 /> },
];
