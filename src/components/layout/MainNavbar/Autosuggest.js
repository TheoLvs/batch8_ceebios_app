import React from 'react';
import Autosuggest from 'react-autosuggest';
import { Badge } from "shards-react";

// https://react-autosuggest.js.org/

import "./Autosuggest.css"

var _ = require('lodash')

const COLORS = {
  SPECIES:"#fb2056",
  GENUS:"#fc8f5b",
  FAMILY:"#ffd055",
  ORDER:"#8dd58c",
  CLASS:"#38c9b1",
  PHYLUM:"#1798c3",
  KINGDOM:"#182573",
}

const ORDER = {
  KINGDOM:1,
  PHYLUM:2,
  CLASS:3,
  ORDER:4,
  FAMILY:5,
  GENUS:6,
  SPECIES:7,
  SUBSPECIES:8,
  VARIETY:9,
}



// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = async value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  let options = []
  
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
  searchHistory = _.uniq(searchHistory).slice(-5)
  searchHistory = searchHistory.map(el => ({"name":el}))
  options.push({
    "title":"Last searches",
    "suggestions":searchHistory
  })
  // options.push({
  //   "title":"Species recommendation",
  //   "suggestions":[{"name":"bonjour"}]
  // })
  // // options.push(...searchHistory)

  if (inputLength > 2){
    await getSuggestionsGBIF(value).then(results => {
      options.push({
        "title":"Scientific names recommendation",
        "suggestions":results
      })
    })
  }

  if (inputLength === 0){
    return []
  } else {
    return options
  }

  return inputLength === 0 ? [] : options.filter(option => {
    return option.name.toLowerCase().slice(0, inputLength) === inputValue
  }
    
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.rank === undefined ?
     "" :
     <span><Badge style={{backgroundColor:COLORS[suggestion.rank] || "gray",fontSize:12,width:80}}>{suggestion.rank}</Badge></span>
      // `- ${suggestion.rank}`
    } {suggestion.name}
  </div>
);

const renderSectionTitle = section => {
  return <strong>{section.title}</strong>;
}

const getSectionSuggestions = section => {
  return section.suggestions;
}

const getSuggestionsGBIF = async (q) => {
  const response = await fetch(`https://api.gbif.org/v1/species/suggest?q=${encodeURI(q)}`)
  const json = await response.json()
  let results = json.map(el => ({
    name:el.canonicalName,
    rank:el.rank,
    order:ORDER[el.rank] || 8
  }))
  results = _.sortBy(results,"order")
  return results
}


export default class SearchAutosuggest extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.props.onChange(newValue)
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value).then(results => {
      console.log(results);
      this.setState({
        suggestions: results
      });
    })

  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search for a species',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        multiSection={true}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps}
      />
    );
  }
}