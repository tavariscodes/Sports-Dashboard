import Navbar from "./Navbar";
const MainLayout: React.FC = ({children}) => {
    return(
        <div style={{display: 'flex'}}>
            <Navbar/>
            {children}
        </div>
    )
}

export default MainLayout;