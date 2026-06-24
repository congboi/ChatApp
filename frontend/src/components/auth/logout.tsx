import React from "react";
import { useAuthStore } from "@/stores/useAuthStore"
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";
const Logout = () =>{
    const {signOut} = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Button variant="completeGhost" onClick={handleLogout}>
            <LogOutIcon className="text-destructive" />
            Logout
        </Button>
    )
}

export default Logout