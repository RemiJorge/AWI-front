import { Outlet, Link } from "react-router-dom"

const Layout = () => {
    return (
        <main className="App">
            <Outlet />
            <footer>
                <p>© 2023 - 2024 | BucketDev</p>
                <Link to="/">Accueil</Link>
            </footer>
        </main>
    )
}

export default Layout
