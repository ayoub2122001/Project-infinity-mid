import React from "react";
import {AiFillHome,AiOutlineShoppingCart} from "react-icons/ai";
import {IoIosPaper,IoMdPeople} from "react-icons/io";
import {FaProductHunt} from "react-icons/fa";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Incomes",
    path: "/incomes",
    icon: <IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Orders",
    path: "/orders",
    icon: <AiOutlineShoppingCart />,
    cName: "nav-text",
  },
  {
    title: "Exponses",
    path: "/exponses",
    icon: <IoMdPeople />,
    cName: "nav-text",
  },
  {
    title: "Articles",
    path: "/insertArticle",
    icon: <FaProductHunt />,
    cName: "nav-text",
  }
];
