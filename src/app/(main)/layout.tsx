import NavBar from "./Navbar";

export default function Layout({children}:{children:React.ReactNode}){
    return <div>
        <NavBar />
        {children}
    </div>
}