import React, { Component } from 'react';
import {Grid, Header, Image, Modal, Input, Tab, Button} from 'semantic-ui-react'
// import Carousel from 'nuka-carousel';
// import { Carousel } from "react-responsive-carousel";
import './App.css';

import Dropzone from 'react-dropzone'
import DOMPurify from 'dompurify'
import Parser from 'html-react-parser';

import ReactHtmlParser from 'react-html-parser';

const imgs = [];
const slides = [];
let a = [];
let pane1 = [];
let pane_sample = [];

for (let i = 0; i < 30; i++) {
  imgs.push(`https://unsplash.it/600/600?image=${i}`);

  slides.push({
    media: (
      <img src={`https://unsplash.it/600/400?image=${i}`} />
    ),
  });
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {open: false,   slideIndex: 3 , imgs : "", folderName: "", files:[], imagePreviewUrl:[],
                  dimensionsOri: {}, test:[], testIsEmpty: true, train:[], trainIsEmpty: true };

    this.onImgLoadOri = this.onImgLoadOri.bind(this);

  }

  show = (dimmer, img)  => () => this.setState({ dimmer, imgs : img, open: true })
  close = () => this.setState({ open: false })

  renderOutput(arrayJson){
    if (this.state.testIsEmpty === false) {
    let i = 0;
    console.log("arrayJson : ", arrayJson);
    const panesss = [
      { menuItem: 'Testing set', pane: [
        <Grid container columns={5} stackable style={{paddingTop: 20}}>
        {
          this.state.test.map((img, index) => (
            <div  key={index}
                  onClick={this.show( 'blurring', img, true)}>
              <img src={img} style={{paddingBottom: 10, height: 200, width: 200}}/>
            </div>
            )
          )
        }
      </Grid>]},
      { menuItem: 'Training set', pane: [
        <Grid container columns={5} stackable style={{paddingTop: 20}}>
        {
          this.state.train.map((img, index) => (
            <div  key={index}
                  onClick={this.show( 'blurring', img, true)}>
              <img src={img} style={{paddingBottom: 10, height: 200, width: 200}}/>
            </div>
            )
          )
        }
      </Grid>]}
    ];
    return (
      <Tab panes={panesss} key={1} renderActiveOnly={false} />
      )
		}
		//con neu json rong thi hien thi dong thong bao
		else if (this.state.testIsEmpty === true) {
      return(
        <Tab panes={[{ menuItem: 'Training set', pane: ""  }]} key={1} renderActiveOnly={false} />
      );
    }
  }

  componentDidMount(){
      let s = "";
      let imgss = [];

      let formData = new FormData();
      var inps = document.querySelectorAll('input');
      [].forEach.call(inps, function(inp) {
          inp.onchange = function(e) {
              console.log(this.files);
              s = this.files[0].webkitRelativePath;
              s = s.substring(0, s.indexOf('/'));
              console.log(s);
              //Upload hinh cho nay, nhung ma chua co cho de up
              a = [];
              for (let i = 0; i < e.target.files.length; i++) {
                let reader = new FileReader();
                let file = e.target.files[i];
                //Khi ma load file xong roi thi thuc hien promise
                reader.onloadend = () => {
                  imgss = reader.result;
                  // console.log(imgss);
                  a.push(imgss);
                  // console.log(a.length);
                }
                reader.readAsDataURL(file)
                // formData.append(`myFile-${i}`, e.target.files[0].name)
              }
            }
          });
          this.setState({
            test: a
          });
          console.log("Test: ", this.state.test);
        }

  onImgLoadOri({target:img}) {
			this.setState({dimensionsOri:{heightOri:img.offsetHeight, widthOri:img.offsetWidth}});
	}

  _handleUpload(){
      console.log("upload");
      console.log(a.length);
      console.log(this.state.testIsEmpty);
      this.setState({
        test: a,
        testIsEmpty : false
      });
  }

  render() {

    const { open, dimmer } = this.state

    pane_sample = [
      { menuItem: 'Training set', pane:[
        <Grid container columns={5} stackable style={{paddingTop: 20}}></Grid>] },
      { menuItem: 'Testing set', pane:[
          <Grid container columns={5} stackable style={{paddingTop: 50}}></Grid>] },
      { menuItem: 'Validate set', pane: [<Grid container columns={5} stackable style={{paddingTop: 20}}></Grid>] },
    ]
    const panes = [
      { menuItem: 'Training set', pane: [
        <Grid container columns={5} stackable style={{paddingTop: 20}}>
        {
          this.state.test.map((img, index) => (
            <div  key={index}
                  onClick={this.show( 'blurring', img, true)}>
              <img src={img} style={{paddingBottom: 10, height: 200, width: 200}}/>
            </div>
            )
          )
        }
      </Grid>] },
      { menuItem: 'Testing set', pane:[
          <Grid container columns={5} stackable style={{paddingTop: 50}}>
          {
            imgs.map((img, index) => (
              <div  key={index}
                    onClick={this.show( 'blurring', img, true)}>
                <img src={img} style={{paddingBottom: 10, height: 200, width: 200}}/>
              </div>
              )
            )
          }
          </Grid>
        ]
      },
      { menuItem: 'Validate set', pane: [<Grid container columns={5} stackable style={{paddingTop: 20}}>
        {
          imgs.map((img, index) => (
            <div  key={index}
                  onClick={this.show( 'blurring', img, true)}>
              <img src={img} style={{paddingBottom: 10, height: 200, width: 200}}/>
            </div>
            )
          )
        }
      </Grid>] },
    ]

    let $imagePreview = null;
    //Neu ma co upload thi load hinh len
    if (this.state.testIsEmpty === false) {
       $imagePreview = (
         <div>
            <Header as="h1">Detect Image</Header>
            <img src={this.state.test[0]}/>
         </div>
       );
    } else if (this.state.testIsEmpty === true) {
      <div>
        <img src={this.state.test[0]}/>
        <Header as="h1">Detect</Header>
      </div>
    }
    return (

      <div className="App" style={{padding: 50}}>
        <Header as='h3' content='Image LOGO' textAlign='center' style={{paddingBottom: 20}}/>

        <div>
          { ReactHtmlParser(' <input type="file" webkitdirectory mozdirectory id="inputFile" />') }
          <Button onClick={this._handleUpload.bind(this)}>H</Button>
        </div>

        <Modal  open={open} onClose={this.close} closeIcon
                style={{  height: this.state.dimensionsOri.heightOri + 50,
                          width: this.state.dimensionsOri.widthOri + 50,
                          justifyContent:'center', alignItems:'center', flexDirection: 'columns'}}
                          >
          <Modal.Content style={{height: this.state.dimensionsOri.heightOri, width: this.state.dimensionsOri.widthOri,
              justifyContent:'center', alignItems:'center', flexDirection: 'columns'}}
              >
            <img  onLoad={this.onImgLoadOri} src={this.state.imgs}
                  style={{height: this.state.dimensionsOri.heightOri, width: this.state.dimensionsOri.widthOri,
                      justifyContent:'center', alignItems:'center', flexDirection: 'columns'}}
                      />
          </Modal.Content>
        </Modal>
        {this.renderOutput(this.state.testIsEmpty === true ?  this.state.test: "" )}
      </div>
    );
  }
}

export default App;
