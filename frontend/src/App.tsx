import { useState } from "react";

import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

export function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return (
            <AdminLogin
                onLoginSuccess={handleLoginSuccess}
            />
        );
    }

    return <AdminDashboard />;
}

export default App;