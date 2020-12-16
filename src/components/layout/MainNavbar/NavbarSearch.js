import React from "react";
import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput
} from "shards-react";

import { useHistory } from "react-router-dom";

import SearchAutosuggest from "./Autosuggest";

var _ = require('lodash')


const storeLastSearch = (search) => {
  // Get Search History in local Storage
  let searchHistory = localStorage.getItem("searchHistory")

  // Append value to existing list
  if (searchHistory === null){
    searchHistory = []
  } else {
    searchHistory = JSON.parse(searchHistory)
  }
  searchHistory.push(search)
  searchHistory = _.uniq(searchHistory).slice(-5)
  searchHistory = JSON.stringify(searchHistory)

  // Store new values
  localStorage.setItem("searchHistory",searchHistory)

}




export default (props) => {

  const [searchValue,setSearchValue] = React.useState("");

  let history = useHistory()


  const handleChange = (e) => {
    setSearchValue(e);
    // setSearchValue(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    storeLastSearch(searchValue)
    // window.history.replaceState(null,"Test","/explore?q="+test)
    history.push({
      pathname: '/explore',
      search: '?q='+encodeURI(searchValue),
    });
  }

  return (
  <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex" onSubmit={handleSubmit}>
    <InputGroup seamless className="ml-3">
      <InputGroupAddon type="prepend">
        <InputGroupText>
          <i className="material-icons">search</i>
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupText>
        <SearchAutosuggest onChange={handleChange}/>
      </InputGroupText>
      {/* <FormInput
        onChange={handleChange}
        className="navbar-search"
        placeholder="Search for something..."
      /> */}
    </InputGroup>
  </Form>
)};
