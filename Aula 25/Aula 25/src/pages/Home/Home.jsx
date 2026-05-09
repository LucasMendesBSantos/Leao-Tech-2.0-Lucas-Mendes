import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Home(){
    return(
        <>
        <Header/>
        <main className="main-home">
                <div className="container mt-4">
                    <div className="row">
                        <aside className="col-4 ">
                           <div className="border rounded-2 shadow p-2">
                             <ul>
                                <li>Item1</li>
                                <li>Item2</li>
                                <li>Item3</li>
                                <li>Item1</li>
                                <li>Item2</li>
                                <li>Item3</li>
                            </ul>
                           </div>
                        </aside>

                        <section className="col-8  ">

                            <div className="border rounded-2 shadow p-2">
                                <h1>Conteudo 1</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
                            </div>

                             <div className="border rounded-2 shadow p-2 mt-5">
                                <h1>Conteudo 2</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
                            </div>
                            
                        </section>

                    </div>
                    
                    </div> 
       </main>
        <Footer/>
        </>
    )

}
export default Home;