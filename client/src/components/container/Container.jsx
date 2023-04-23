import React from "react";
import Board from "../board/Board";
import "./style.scss";
import { Button } from "@mui/material";
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: "#000000",
      size: "1",
      imgFile: "",
      loader: false,
      prompt:"",
      download:false
    };
  }

  changeColor(params) {
    this.setState({
      color: params.target.value,
    });
  }

  changeSize(params) {
    this.setState({
      size: params.target.value,
    });
  }
  changeTool(params) {
    this.setState({
      size: params.target.value,
    });
  }
  changeTools(params) {
    this.setState({
      color: "#aaafb6",
      size: "20",
    });
  }

  imgFileHandler(params) {
    if (1) {
      
      // askAI(this.imageFile)
      if (this.state.prompt==='') {
        document.getElementById("PromptName").style.borderColor = "red";
        alert('Tell us what are you drawing!')
        return;
      }
      this.setState({
        loader: true
      })
      this.sendData()
      setTimeout(() => {
        this.setState({
          loader: false
        })
      }, 5000);
      // this.setState({
      //   imgFile: URL.createObjectURL(params.target.files[0]),
      // });
    }
  }
  notify = () => 
  toast.success('Image is Ready to download', 
  { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });

  saveImage() {
    
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async sendData() {
    
    const formData = new FormData();
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL('image/png');
    formData.append('image', dataURL);
    formData.append('prompt', this.state.prompt);
    this.setState({ loader: true }); // start the loader
    try {
      try {
        const response = await axios.post('http://localhost:6001/api/process_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'multipart/form-data'
        }});
        if(response.data.success===true){
          this.notify();
          this.setState({
            download:true
          })
        }
        
      } catch (error) {
        console.log(error);
      }
      this.setState({ loader: false }); // stop the loader
      // Do something with the response, e.g. download the image
      // You can access the image in the response like response.data.image

    } catch (error) {
      console.error(error);
    }
  }
  downloadImage(){
    this.setState({
      download:false
    })
    const link = document.createElement('a');
    link.href = 'http://localhost:6001/image';
    link.download = 'example.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  render() {
    return (
      <div className="container">
        <div class="tools-section">
          <div className="prompt-section">
            <input
              id="PromptName"
              placeholder="What are you Drawing?"
              value={this.state.prompt}
              onChange={(e) => {
                this.setState({ prompt: e.target.value });
                document.getElementById("PromptName").style.borderColor = "";
              }}
              style={{ borderColor: !this.state.prompt ? "red" : "" }}

            />
          </div>
          <div className="color-picker-container">
            Brush Color : &nbsp;
            <input
              id="selectcolor"
              type="color"
              value={this.state.color}
              onChange={this.changeColor.bind(this)}
            />
          </div>
          <div className="color-picker-container">
            Eraser : &nbsp;
            <button onClick={this.changeTools.bind(this)}></button>
          </div>

          <div className="brushsize-container">
            Brush Size : &nbsp;
            <select
              id="selectsize"
              value={this.state.size}
              onChange={this.changeSize.bind(this)}
            >
              <option> 1 </option>
              <option> 2 </option>
              <option> 5 </option>
              <option> 10 </option>
              <option> 15 </option>
              <option> 20 </option>
            </select>
          </div>

          <div>
            <Button
              type="button"
              id="upload"
              onClick={this.imgFileHandler.bind(this)}
            >Imagine</Button>
          </div>

            {this.state.download && (
                <Button
                type="button"
                id="download"
                onClick={this.downloadImage.bind(this)}
              >Download</Button>
            )}
            {this.state.loader && (
              <div className="loader"></div>
            )}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
        />
        <div class="board-container">
          <Board
            socket={this.props.socket}
            room={this.props.room}
            color={this.state.color}
            size={this.state.size}
            img={this.state.imgFile}
          ></Board>
        </div>
      </div>
    );
  }
}

export default Container;
