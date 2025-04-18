import { Outlet } from "react-router-dom";
import Navbar from "./Utilis components/navbar/Navbar";
import Footer from "./Utilis components/footer/Footer";
import { Box } from "@mui/material";

export default function Guest() {




    return (
        <>
        <Navbar/>
        <Box sx={{minHeight: "80vh"}}
        component={'div'}
        >
            <Outlet />
        </Box>
        
        <Footer/>
        </>
    );
}