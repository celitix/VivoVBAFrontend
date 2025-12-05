import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/login/Login";
import Approutes from "@/routes/Approutes/Approutes";
import PageNotFound from "@/NotFound/PageNotFound";
import GlobalToaster from "@/components/toaster/GlobalToaster";
import LoadingBar from "@/utils/LoadingBar";
import PrivateRoute from "./routes/Auth/PrivateRoute";
import SurveyForm from "./SurveyForm/SurveyForm";
import ThankYou from "./SurveyForm/ThankYou";

const App = () => {
  return (
    <Router>

      {/* Toaster */}
      <GlobalToaster />

      {/* Loading Top Progress Bar */}
      <LoadingBar />

      <Routes>
        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route element={<PrivateRoute />}>
          <Route path="/*" element={<Approutes />} />
        </Route>

        <Route path="/surveyform" element={<SurveyForm />} />
        <Route path="/thank-you" element={<ThankYou />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App