import React from 'react';
import {
    BookmarkBorderOutlined,
    DeleteOutline,
    MoreHoriz,
    ThumbUp,
    ModeCommentOutlined,
    Share,
    Circle,
} from '@mui/icons-material';

import Dropdown from 'react-bootstrap/Dropdown';
import {useState} from "react";

const Post = () => {
    return <div className ='d-flex flex-column flex-lg-row justify-content-center align-items-center bg-white border border-radius-15 box-shadow-sm' style={{maxWidth: 510, minHeight:662 }} >Post
        <div className ='bd-white'>
            <div style={{width:61 , height:61 , marginTop:-247 , marginLeft: 198}} ></div>
            <Circle style={{width:61 , height:61 , marginTop:247 , marginLeft:-198}}></Circle>
            <p>Username</p>
             {        
    function SplitBasicExample() {
      return (
          <div>
        <Dropdown as={ButtonGroup}>
          <MoreHoriz style={{width:45 , height:45 , marginTop :-243 , marginLeft :238}} variant="success" ></MoreHoriz> 
    
          <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
    
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">{ <BookmarkBorderOutlined style={{width:37 , height:37, matginTop: -198, marginLeft :111 }}> <p style={{width:7 , height:33 , marginTop:-191 , marginLeft: 157}}>Save Post</p></BookmarkBorderOutlined>}</Dropdown.Item>
            <Dropdown.Item href="#/action-2">{<DeleteOutline>  <p className='w-112 line-height-l h-33'>Delete post </p></DeleteOutline>}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>
      );
    }}
    {
function Seemore ({children}) {
    const [isSeeMoreShown, setSeeMoreShown] =useState(False)
    const toggleBtn =()=>{
        setSeeMoreShown(prevState=>! prevSate)
    }
    return(
<div className ="read-more-read-less">
    {isSeeMoreShown ? children:children. 
    substr(0,200)}
    <button onclick ={toggleBtn}>See more</button>
</div>
    )
}}
      
        </div>
        <div style={{width: 510,height: 328,background:D9D9D9}}> </div>
        <ThumbUp style={{width: 56,height: 31}}>Like</ThumbUp>
        <p> 1K</p>
        <p>126 Comment</p>
        <hr></hr>
        <div>
            <ThumbUp class='Like' style={{Width:56,Height:31,marginTop: 351,marginLeft:-184}}>Like</ThumbUp>
            <ModeCommentOutlined style={{width: 56,height: 31, marginTop:351, marginLeft:26 }}>Comment</ModeCommentOutlined>
            <Share style={{Width:38,Height:38, marginTop:348, marginLeft:138}}>Share</Share>

        </div>
    </div>;


};

export default  {Seemore ,SplitBasicExample} ;
export { Post };
