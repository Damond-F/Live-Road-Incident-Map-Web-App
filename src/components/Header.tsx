import React from 'react'
import { AiFillLinkedin } from "react-icons/ai";
import { VscClearAll } from "react-icons/vsc";
import '../Header.css'
import Axios from 'axios'

function Header() {
  return (
    <header id='Header'>
        <div className='git' onClick={() => {
          Axios.delete('http://localhost:3001/deleteAll')
        }}>
            <VscClearAll size={'3rem'} />
        </div>

        <div className='linked'>
            <AiFillLinkedin size={'3rem'}/>

        </div>
    </header>
  )
}


export default Header