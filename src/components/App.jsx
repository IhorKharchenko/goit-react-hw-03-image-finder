import React, { Component } from 'react';
import { Box } from 'components/Box';
import { SearchBar } from './SearchBar/SearchBar';
import * as API from './services/api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
export class App extends Component {
  state = {
    searchText: '',
    images: [],
    page: 1,
    isLoading: false,
  };
  componentDidUpdate(prevProps, prevState) {
    const prevText = prevState.searchText;
    const nextText = this.state.searchText;
    const { page } = this.state;
    if (prevText !== nextText || prevState.page !== page) {
      this.searchImages(nextText, page);
    }
  }

  searchImages = async (searchText, page) => {
    try {
      this.setState({ isLoading: true });
      const images = await API.getImages(searchText, page);
      this.setState(state => ({
        images: [...state.images, ...images],
        isLoading: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  handleFormSubmit = ({ searchText }) => {
    this.setState({
      searchText,
      page: 1,
      images: [],
    });
  };
  loadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    return (
      <Box as="main" p="4">
        <SearchBar onSubmit={this.handleFormSubmit} />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <ImageGallery images={this.state.images} />
        )}

        {this.state.images.length > 0 && <Button onClick={this.loadMore} />}
      </Box>
    );
  }
}
