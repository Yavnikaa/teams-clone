import React from "react"
import ReactDom from "react-dom"
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom' 
import Register from './components/register'

ReactDom.render(
<div> 
   <Router>
       <Switch>
           <Route path="/register">
               <Register/>
           </Route>
       </Switch>
    </Router>  
</div>, 
document.getElementById('app'))