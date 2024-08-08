import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "views/homePage";
// import HomePage from "scenes/homePage";
// import ProfilePage from "scenes/profilePage";
import LoginPage from "views/loginPage"
import ProfilePage from "views/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeSettings } from "theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
