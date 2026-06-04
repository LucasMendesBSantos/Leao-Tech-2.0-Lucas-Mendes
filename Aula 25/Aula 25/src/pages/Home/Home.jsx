import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Divsul from "../../components/Divsul/Divsul";
import "./Home.css";

function Home(){
    return(
        <>
        <Header/>
        <div className="container main-home">

        </div>
       
          <Divsul/>  
    
        <div className=" mt-5">
          <Footer/>  
        </div>
        
        </>
    )

}
export default Home;