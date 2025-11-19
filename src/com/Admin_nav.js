import React from "react";

const Admin_nav = () => {
    return (
        <div className="font-style">
            <h3 className="text-center mt-2">Admin panel</h3>
            <ul className="nav flex-column ml-4" style={{fontSize:"18px"}} >
                <li className="nav-item" >
                    <a className="nav-link" href="/show_tailor">
                        🧵 Tailor Manage
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/show_user">
                        👤 User Manage
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/adminaddoptions">
                    🎨 Inventory manage
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/orderspage">
                        📦 Order List
                    </a>
                </li>
               
            </ul>
        </div>
    );
};

export default Admin_nav;