import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import ExploreView from "./views/Explore";
import MapView from "./views/Map";
import AboutView from "./views/About";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    // component: () => <Redirect to="/explore" />
    component: AboutView
  },
  {
    path: "/explore",
    layout: DefaultLayout,
    component: ExploreView
  },
];
