import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Divsul from "../../components/Divsul/Divsul";

function Home(){
    return(
        <>
        <Header/>
        <Divsul/>
        <div className="mt-5">
            <Footer/> 
        </div>
       
        </>
    )

}
export default Home;