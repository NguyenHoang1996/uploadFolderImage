import React, { Component } from 'react';
import {Grid, Header, Image, Modal, Input, Tab, Button, Dropdown, Pagination} from 'semantic-ui-react'
// import Carousel from 'nuka-carousel';
// import { Carousel } from "react-responsive-carousel";
import './App.css';

import Dropzone from 'react-dropzone'
import DOMPurify from 'dompurify'
import Parser from 'html-react-parser';

import ReactHtmlParser from 'react-html-parser';

// import Pagination from 'rc-pagination';
// import 'rc-pagination/assets/index.css';

const imgs = [];
const slides = [];
let a = [];
let pane1 = [];
let pane_sample = [];
let maxPage = 0;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {open: false, imgs : "", folderName: "", files:[], imagePreviewUrl:[],
                  dimensionsOri: {}, test:[], testIsEmpty: true, train:[], trainIsEmpty: true, folderType : "",
                  pageLimit : 50, currentPageTest: 1, currentPageTrain: 1, maxPageTest: 0, maxPageTrain: 0,
                  paginationTest: [], paginationTrain: []};

    this.onImgLoadOri = this.onImgLoadOri.bind(this);

  }

  show = (dimmer, img)  => () => this.setState({ dimmer, imgs : img, open: true })
  close = () => this.setState({ open: false })

  onChangeTest = (page, data) => {
    console.log(page, data.activePage);
    this.setState({
      // currentPageTest: data.activePage,
      paginationTest : this.state.test.slice((data.activePage - 1)* this.state.pageLimit,data.activePage * this.state.pageLimit )
    });
  }

  onChangeTrain = (page, data) => {
    console.log(page, data.activePage);
    this.setState({
      // currentPageTrain: data.activePage,
      paginationTrain : this.state.train.slice((data.activePage - 1)* this.state.pageLimit, data.activePage * this.state.pageLimit )
    });
  }

  renderOutput(){
    if (this.state.testIsEmpty === false || this.state.trainIsEmpty === false) {
      let i = 0;
      const panesss = [
        { menuItem: 'Testing set', pane: [
          <div>
            <Grid container columns={5} stackable style={{paddingTop: 20}}>
            {
              this.state.paginationTest.map((img, index) => (
                  <div  key={index}
                        onClick={this.show( 'blurring', img, true)}>
                    <img src={img} style={{paddingBottom: 10, height: 200, width: 200}}/>
                  </div>
                )
              )
            }
            </Grid>
            <Pagination
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                totalPages={this.state.maxPageTest}
                onPageChange={this.onChangeTest.bind(this)}
                style={{marginTop:20}}
              />
          </div>]},
        { menuItem: 'Training set', pane: [
          <div>
            <Grid container columns={5} stackable style={{paddingTop: 20}}>
            {
              this.state.paginationTrain.map((img, index) => (
                  <div  key={index}
                        onClick={this.show( 'blurring', img, true)}>
                    <img src={img} style={{paddingBottom: 10, height: 200, width: 200}}/>
                  </div>
                )
              )
            }
            </Grid>
            <Pagination
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                totalPages={this.state.maxPageTrain}
                onPageChange={this.onChangeTrain.bind(this)}
                style={{marginTop:20}}
              />
          </div>
        ]}
      ];
      return (
        <Tab panes={panesss} key={1} renderActiveOnly={false} />
        )
  		}
  		//con neu json rong thi hien thi dong thong bao
  		else if (this.state.testIsEmpty === true|| this.state.trainIsEmpty === true) {
        return(
          <Tab panes={[{ menuItem: 'Testing set', pane: "" },{ menuItem: 'Traing set', pane: "" }]} key={1} renderActiveOnly={true} />
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
            if(this.files.length > 0){
                console.log(this.files.length);
                // console.log(this.state.pageLimit);
                if(this.files.length % 50 != 0){
                  maxPage = Math.floor(this.files.length / 50) + 1;
                } else {
                  maxPage = Math.floor(this.files.length / 50);
                }
                console.log(maxPage);
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
                    a.push(imgss);
                  }
                  reader.readAsDataURL(file)
                }
              }
            }
          });
        }

  onImgLoadOri({target:img}) {
			this.setState({dimensionsOri:{heightOri:img.offsetHeight, widthOri:img.offsetWidth}});
	}

  _handleUpload(){
      if(this.state.folderType == "testingset"){
        this.setState({
          test: a,
          testIsEmpty : false,
          paginationTest : a.slice(0, this.state.pageLimit),
          maxPageTest : maxPage
        });
      } else if(this.state.folderType == "trainingset"){
        this.setState({
          train: a,
          trainIsEmpty : false,
          paginationTrain : a.slice(0, this.state.pageLimit),
          maxPageTrain : maxPage
        });
      }
  }

  _handleDropDown(event, data){
    console.log("dropdown", data.value);
    this.setState({
      folderType : data.value,
    });
  }

  render() {

    const { open, dimmer } = this.state

    return (

      <div className="App" style={{padding: 50}}>
        <Header as='h2' content='IMAGE LOGO' textAlign='center' style={{paddingBottom: 20}}/>

        <div>
          { ReactHtmlParser(' <input type="file" webkitdirectory mozdirectory id="inputFile" />') }
          <Dropdown search selection
  									options={[
                      { key: 'test', text: 'Testing set', value: 'testingset' },
                      { key: 'train', text: 'Traing set', value: 'trainingset' }]
                    } placeholder='Choose Tab'
  									onChange={this._handleDropDown.bind(this)}
                    style={{ marginTop : 10, width: 200}}/>
        </div>

        <Button onClick={this._handleUpload.bind(this)} style={{margin: 10}}>Upload</Button>


        <Modal  open={open} onClose={this.close} closeIcon
                style={{  height: this.state.dimensionsOri.heightOri,
                          width: this.state.dimensionsOri.widthOri,
                          justifyContent:'center', alignItems:'center', flexDirection: 'columns'}}
                          >
          <Modal.Content style={{height: this.state.dimensionsOri.heightOri, width: this.state.dimensionsOri.widthOri,
              justifyContent:'center', alignItems:'center', flexDirection: 'columns'}}
              >
            <img  onClick={() => this.onImgLoadOri} src={this.state.imgs}
                  style={{height: "100%", width: "100%",
                      justifyContent:'center', alignItems:'center', flexDirection: 'columns'}}
                      />
          </Modal.Content>
        </Modal>
        {this.renderOutput()}
      </div>
    );
  }
}

export default App;
