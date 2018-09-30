import React, { Component } from "react";
import Layout from "../layout/Layout";
import Dropzone from "react-dropzone";

class Home extends Component {
  state = {
    isDropped: false,
    labels: {},
    imagePreview: {},
    isLoading: false
  };
  handleImageProcess = img => {
    const url = "http://localhost:3005/";
    var formData = new FormData();
    this.setState({ isLoading: true });
    formData.append("photo", img);

    fetch(url, {
      method: "POST",
      enctype: "multipart/form-data",
      body: formData
    })
      .then(result => result.json())
      .then(data => {
        this.setState({ labels: data.labels, isLoading: false });
      });
  };

  dropzoneActive = async image => {
    this.handleImageProcess(image[0]);
    this.setState({ isDropped: true, imagePreview: image[0].preview });
  };

  handleAnotherImgBtn = () => {
    this.setState({ labels: {}, isDropped: false });
  };

  render() {
    const { labels, isDropped, imagePreview, isLoading } = this.state;
    const isLabelFinished = Object.values(labels).length != 0;
    return (
      <Layout>
        <div className="container home">
          <header>
            <h1>Welcome to image fun!</h1>
            <h2>We'll analyze your image for you</h2>
          </header>
          <div className="div">
            <section className="section img">
              {isDropped ? (
                <img
                  className="img-preview"
                  src={imagePreview}
                  alt="image preview"
                />
              ) : (
                <Dropzone
                  className="dropzone"
                  onDrop={this.dropzoneActive}
                  accept="image/jpeg, image/png"
                >
                  <p>Drop your image here for analysis</p>
                </Dropzone>
              )}
            </section>
            <section className="section result">
              {isLabelFinished ? (
                <button onClick={this.handleAnotherImgBtn}>
                  Submit another image
                </button>
              ) : null}
              <p>Your result is: </p>
              {isLoading ? (
                <span className="loader">
                  <div className="loader-dot" />
                  <div className="loader-dot" />
                  <div className="loader-dot" />
                </span>
              ) : null}
              <ul>
                {isLabelFinished
                  ? labels.map((label, i) => (
                      <li key={`label_${i}`}>{label}</li>
                    ))
                  : null}
              </ul>
            </section>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Home;
