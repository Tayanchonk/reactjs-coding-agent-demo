import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";
import "./i18n";
import "quill/dist/quill.core.css";
import { ConfirmProvider } from "./context/ConfirmContext";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    <Provider store={store}>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </Provider>
  </BrowserRouter>
);
