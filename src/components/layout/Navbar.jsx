import React from 'react'
import Logo from'../../assets/imgs/logo.png'

const Navbar = () => {
  return (
   
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
         <Navbar dg="dark" variant ="dark"></Navbar>
         <Link className='navbar-brand ms-5' to='/home'>
                    <img height={80} width={100} src={Logo}  />
                </Link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
      </form>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">HOME<span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">CHAT</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">NEW</a>
        </li>
      </ul>
      
    </div>
  </nav>
       
       
  
  )
}

export default Navbar
