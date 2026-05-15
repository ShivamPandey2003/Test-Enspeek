import { createBrowserRouter } from "react-router";
import Root_layout from "../layout/Root.layout";
import ProjectListing from "../components/common/list/project-list";
import CreateProject from "../components/common/create/create-project";
import Auth_layout from "../layout/Auth.layout";
import LoginForm from "../components/common/Auth/Form/LoginForm";
import PublishSurvey from "../components/common/Publish-survey/survey";
import QuestionList from "../components/common/Questionnaire/question-list";
import ProtectedRoute from "./ProtectedRoutes";
import Report_page from "../pages/Report.page";
import Cross_Tab_Page from "../pages/Cross_Tab.page";
import Error from "../components/global/Error";
import BannerDesign_page from "../pages/BannerDesign.page";
import { ErrorBoundary } from "react-error-boundary";
import TableList_page from "../pages/TableList.page";
import { Suspense } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../utils";

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
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-full h-full">
                    <AiOutlineLoading3Quarters
                      size={34}
                      className={cn("animate-spin text-action")}
                    />
                  </div>
                }
              >
                <TableList_page />
              </Suspense>
            </ErrorBoundary>
          ),
        },

        {
          path: "report",
          element: <Report_page />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute element={<Auth_layout />} reverse />,
      children: [
        {
          path: "login",
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
