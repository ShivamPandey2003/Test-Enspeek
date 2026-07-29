import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import Root_layout from "../layout/Root.layout";
import Auth_layout from "../layout/Auth.layout";
import ProtectedRoute from "./ProtectedRoutes";
import Error from "../components/global/Error";
import { ErrorBoundary } from "react-error-boundary";

// Route-level code splitting: each page is loaded on demand so heavy screens
// (admin panel, Highcharts-backed report/crosstab) stay out of the initial
// bundle. Suspense boundaries live in the layouts, around <Outlet />.
const ProjectListing = lazy(() => import("../components/common/list/project-list"));
const CreateProject = lazy(() => import("../components/common/create/create-project"));
const LoginForm = lazy(() => import("../components/common/Auth/Form/LoginForm"));
const OtpLoginPage = lazy(() => import("../components/common/Auth/otp-login/OtpLoginPage"));
const PublishSurvey = lazy(() => import("../components/common/Publish-survey/survey"));
const QuestionList = lazy(() => import("../components/common/Questionnaire/question-list"));
const Report_page = lazy(() => import("../pages/Report.page"));
const Cross_Tab_Page = lazy(() => import("../pages/Cross_Tab.page"));
const BannerDesign_page = lazy(() => import("../pages/BannerDesign.page"));
const TableList_page = lazy(() => import("../pages/TableList.page"));
const AdminPanelPage = lazy(() => import("../pages/admin-panel"));
const ProfilePage = lazy(() => import("../pages/Profile.page"));

const Router = createBrowserRouter(
  [
    {
      path: "/",
      element: <ProtectedRoute element={<Root_layout />} />,
      children: [
        {
          index: true,
          element: <ProjectListing />,
        },
        {
          path: "create",
          element: <CreateProject />,
        },
        {
          path: "questionnaire",
          element: <QuestionList />,
        },
        {
          path: "publish-survey",
          element: <PublishSurvey />,
        },
        {
          path: "crosstab",
          element: (
            <ErrorBoundary fallbackRender={() => <Error showHome />}>
              <Cross_Tab_Page />
            </ErrorBoundary>
          ),
        },
        {
          path: "crosstab/edit-banner",
          element: (
            <ErrorBoundary fallbackRender={() => <Error showHome />}>
              <BannerDesign_page />
            </ErrorBoundary>
          ),
        },
        {
          path: "crosstab/table-list",
          element: (
            <ErrorBoundary fallbackRender={() => <Error showHome />}>
              <TableList_page />
            </ErrorBoundary>
          ),
        },

        {
          path: "report",
          element: <Report_page />,
        },
        {
          path: "user-management",
          element: <ProtectedRoute element={<AdminPanelPage />} adminOnly />,
        },
        {
          path: "profile",
          element: <ProtectedRoute element={<ProfilePage />} profileOnly />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute element={<Auth_layout />} reverse />,
      children: [
        {
          path: "login",
          element: <OtpLoginPage />,
        },
        {
          path: "userlogin",
          element: <LoginForm />,
        },
      ],
    },
    {
      path: "*",
      element: (
        <Error
          title="404 Page not found"
          message="We couldn't find the data you're looking for. Please try again later."
          showHome
          showRetry={false}
        />
      ),
    },
  ],
  {
    // basename: "/enspeek/",
    basename: "/",
  }
);

export default Router;
